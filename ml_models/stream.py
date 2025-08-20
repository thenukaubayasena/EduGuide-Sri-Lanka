from flask import Flask, request, jsonify
import numpy as np
import pandas as pd
import joblib
from flask_cors import CORS
from sklearn.metrics.pairwise import euclidean_distances

app = Flask(__name__)
CORS(app)

# Load the model and supporting data
try:
    model_data = joblib.load('model.pkl')
    best_model = model_data["model"]
    preprocessor = model_data["preprocessor"]
    X_train = model_data["X_train"]
    data = model_data["data"]
    print("Model loaded successfully!")
except Exception as e:
    print(f"Error loading model: {str(e)}")

def predict_success_probability(user_inputs: dict):

    try:
        # Convert user inputs to DataFrame
        user_df = pd.DataFrame([user_inputs])

        # Find similar students using Euclidean distance on numeric features
        # Preprocess user input same as training data
        processed_input = preprocessor.transform(user_df)

        # Preprocess training data
        X_train_processed = preprocessor.transform(X_train)

        # Calculate distances to all training samples
        distances = euclidean_distances(processed_input, X_train_processed)[0]

        # Get indices of the 50 most similar students
        similar_indices = np.argsort(distances)[:50]
        similar_students = data.iloc[similar_indices]

        # Calculate success percentage
        success_counts = similar_students['Did everything go well with your A/L exams?'].value_counts(
            normalize=True) * 100
        success_percentage = success_counts.get("Yes, everything went well", 0)
        similar_count = len(similar_indices)

        return float(success_percentage), similar_count
    except Exception as e:
        print(f"Error in success prediction: {str(e)}")
        return 0.0, 0


def enhanced_predict(user_inputs: dict):
    try:
        # Get stream prediction
        user_df = pd.DataFrame([user_inputs])
        predicted_stream = best_model.predict(user_df)[0]

        # Get probabilities
        class_probabilities = best_model.predict_proba(user_df)[0]
        confidence = np.max(class_probabilities)

        # Get success probability
        success_percentage, similar_count = predict_success_probability(user_inputs)

        return {
            "predicted_stream": predicted_stream,
            "confidence": float(confidence),
            "success_probability": float(success_percentage),
            "similar_students_count": int(similar_count),
            "interpretation": f"Based on {similar_count} similar past students, {success_percentage:.1f}% achieved good A/L results"
        }
    except Exception as e:
        print(f"Error in prediction: {str(e)}")
        return {
            "error": str(e),
            "predicted_stream": "Error",
            "confidence": 0.0,
            "success_probability": 0.0,
            "similar_students_count": 0,
            "interpretation": "An error occurred during prediction"
        }


@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json(force=True)

        # Validate input data
        required_fields = ["Maths", "Science", "Religion", "English",
                           "Sinhala or Tamil", "History", "Basket I",
                           "Basket II", "Basket III", "Favorite Subject", "Career"]

        for field in required_fields:
            if field not in data:
                return jsonify({
                    "error": f"Missing required field: {field}",
                    "predicted_stream": "Error",
                    "confidence": 0.0,
                    "success_probability": 0.0,
                    "similar_students_count": 0,
                    "interpretation": "Please provide all required information"
                })

        # Make prediction
        result = enhanced_predict(data)
        return jsonify(result)

    except Exception as e:
        return jsonify({
            "error": str(e),
            "predicted_stream": "Error",
            "confidence": 0.0,
            "success_probability": 0.0,
            "similar_students_count": 0,
            "interpretation": "An error occurred during processing"
        })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)