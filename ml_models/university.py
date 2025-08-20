from flask import Flask, request, jsonify
import joblib
from sentence_transformers import util
from flask_cors import CORS

# Load pre-trained components
data = joblib.load('university_recommender.pkl')
model = data['model']
career_df = data['career_df']
private_unis = data['private_unis']
gov_unis_df = data['gov_unis_df']
skill_embeddings = data['skill_embeddings']
private_field_embeddings = data['private_field_embeddings']

app = Flask(__name__)
CORS(app)

@app.route('/recommend', methods=['POST'])
def recommend():
    data_json = request.get_json()

    if not data_json or 'skill_input' not in data_json:
        return jsonify({'error': 'Missing skill input'}), 400

    user_skill_input = data_json['skill_input']
    gov_interest = data_json.get('gov_interest', 'no').lower()
    user_z = data_json.get('z_score', None)
    user_district = data_json.get('district', '')
    al_stream = data_json.get('stream', '')

    # === Step 1: Career Matching ===
    query_embedding = model.encode(user_skill_input, convert_to_tensor=True)
    search_results = util.semantic_search(query_embedding, skill_embeddings, top_k=1)[0]

    if not search_results:
        matched_career = career_df.iloc[0]['Career']
        matched_skill_text = career_df.iloc[0]['Skill']
    else:
        top_match = search_results[0]
        matched_career = career_df.iloc[top_match['corpus_id']]['Career']
        matched_skill_text = career_df.iloc[top_match['corpus_id']]['Skill']

    # === Step 2: Private Uni Recommendations ===
    private_results = util.semantic_search(query_embedding, private_field_embeddings, top_k=5)[0]
    private_recommendations = []
    for result in private_results:
        row = private_unis.iloc[result['corpus_id']]
        private_recommendations.append({
            'university': row['University'],
            'degree': row['Degree'],
            'field': row['Relevant_Field'],
            'link': row['Link'],
            'score': round(result['score'], 2)
        })

    # === Step 3: Government Uni Recommendations ===
    gov_recommendations = []
    if gov_interest in ['yes', 'y'] and user_z is not None:
        filtered_gov = gov_unis_df[gov_unis_df['Z_score'] <= user_z]

        # Priority Filtering
        priority1 = filtered_gov[
            (filtered_gov["District"].str.title() == user_district.title()) &
            (filtered_gov["Stream"].str.title() == al_stream.title())
        ]

        if not priority1.empty:
            filtered_gov = priority1
        else:
            priority2 = filtered_gov[filtered_gov["Stream"].str.title() == al_stream.title()]
            if not priority2.empty:
                filtered_gov = priority2
            else:
                filtered_gov = filtered_gov[
                    (filtered_gov["Stream"].str.title() == al_stream.title()) |
                    (filtered_gov["Stream"].str.lower() == "all")
                ]

        if not filtered_gov.empty:
            combined_fields = filtered_gov["Stream"] + " " + filtered_gov["Course"]
            gov_field_embeddings = model.encode(combined_fields.tolist(), convert_to_tensor=True)
            gov_results = util.semantic_search(query_embedding, gov_field_embeddings, top_k=5)[0]

            seen_unis = set()
            for result in gov_results:
                row = filtered_gov.iloc[result['corpus_id']]
                if row['Selected_University'] not in seen_unis:
                    seen_unis.add(row['Selected_University'])
                    gov_recommendations.append({
                        'university': row['Selected_University'],
                        'course': row['Course'],
                        'z_score_required': row['Z_score'],
                        'district': row.get('District', 'N/A'),
                        'stream': row['Stream'],
                        'score': round(result['score'], 2)
                    })

    return jsonify({
        'matched_skill': matched_skill_text,
        'career_suggestion': matched_career,
        'private_universities': private_recommendations,
        'government_universities': gov_recommendations
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
