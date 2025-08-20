// src/services/SuggestionService.js
import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000'; // Change this to your Flask API URL if needed

class SuggestionService {
    // Method to get stream recommendation
    async suggestStream(formData) {
        try {
            // Make sure we have all required fields
            const requiredFields = [
                'Maths', 'Science', 'Religion', 'English', 
                'Sinhala or Tamil', 'History', 'Basket I', 
                'Basket II', 'Basket III', 'Favorite Subject', 'Career'
            ];

            for (const field of requiredFields) {
                if (formData[field] === undefined || formData[field] === '') {
                    throw new Error(`Missing required field: ${field}`);
                }
                
                // Make sure grade values are numbers
                if (['Maths', 'Science', 'Religion', 'English', 'Sinhala or Tamil', 
                     'History', 'Basket I', 'Basket II', 'Basket III'].includes(field)) {
                    formData[field] = Number(formData[field]);
                }
            }

            console.log('Sending data to API:', formData);
            
            // Send request to the Flask API's predict endpoint
            const response = await axios.post(`${API_URL}/predict`, formData);
            
            console.log('Received response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error in suggestion service:', error);
            throw error;
        }
    }
    
    // Method to get sample data (useful for testing)
    async getSampleData() {
        try {
            const response = await axios.get(`${API_URL}/sample`);
            return response.data;
        } catch (error) {
            console.error('Error fetching sample data:', error);
            throw error;
        }
    }
}

export default new SuggestionService();