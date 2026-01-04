from flask import Flask, request, render_template, jsonify #type:ignore
from flask_cors import CORS #type:ignore
import requests
import joblib #type:ignore
from dotenv import dotenv_values #type:ignore
import numpy as np
import tensorflow as tf #type:ignore
from utils.shap_explainer import generate_shap_plot
import pandas as pd #type:ignore
import matplotlib.pyplot as plt
from utils.shap_property import generate_property_shap_plot
from utils.lime_loan import generate_loan_lime_plot



config = dotenv_values(".env")

app = Flask(__name__)
CORS(app)
model1 = joblib.load("random_forest_model_property_value.joblib")
model2 = joblib.load("logistic_regression_model.joblib")

stock_model = tf.keras.models.load_model("model.keras")
stock_scaler = joblib.load("scaler.pkl")
X_train_loan = joblib.load("X_train_loan.pkl")

print("Stock model and scaler loaded successfully")


# Load scaler if it exists, otherwise create a dummy one
try:
    loan_scaler = joblib.load("loan_scaler.joblib")
    print("Loan scaler loaded successfully")
except FileNotFoundError:
    loan_scaler = None
    print("Warning: Loan scaler not found. Model may not work correctly without scaling.")

print(f"Loan model expects {model2.n_features_in_} features")

GEOAPIFY_URL = "https://api.geoapify.com/v1/geocode/search"

def get_coordinates(location):
    try:
        # Construct the full URL with location and API key
        url = f"{GEOAPIFY_URL}?text={location}&apiKey={config['GEOAPIFY_API_KEY']}"

        # Make the request to the Geoapify API
        response = requests.get(url)

        # Check if the response was successful
        if response.status_code == 200:
            data = response.json()
            # print(data)
            # Check if results are found
            if 'features' in data and len(data['features']) > 0:
                latitude = data['features'][0]['geometry']['coordinates'][1]
                longitude = data['features'][0]['geometry']['coordinates'][0]
                return latitude, longitude
            else:
                return None, None  # No results found
        else:
            print(f"Error with the Geoapify API request: {response.status_code}")
            return None, None
    except Exception as e:
        print(f"Error during geocoding: {e}")
        return None, None

def map_city(city):
    if city in ['Ahmedabad', 'Bangalore', 'Chennai', 'Delhi', 'Hyderabad', 'Kolkata', 'Mumbai', 'Pune']:
        return 1
    elif city in ['Agra', 'Ajmer', 'Aligarh', 'Amravati', 'Amritsar', 'Asansol', 'Aurangabad', 'Bareilly', 
                  'Belgaum', 'Bhavnagar', 'Bhiwandi', 'Bhopal', 'Bhubaneswar', 'Bikaner', 'Bilaspur', 'Bokaro Steel City', 
                  'Chandigarh', 'Coimbatore', 'Cuttack', 'Dehradun', 'Dhanbad', 'Bhilai', 'Durgapur', 'Dindigul', 'Erode', 
                  'Faridabad', 'Firozabad', 'Ghaziabad', 'Gorakhpur', 'Gulbarga', 'Guntur', 'Gwalior', 'Gurgaon', 'Guwahati', 
                  'Hamirpur', 'Hubli–Dharwad', 'Indore', 'Jabalpur', 'Jaipur', 'Jalandhar', 'Jammu', 'Jamnagar', 'Jamshedpur', 
                  'Jhansi', 'Jodhpur', 'Kakinada', 'Kannur', 'Kanpur', 'Karnal', 'Kochi', 'Kolhapur', 'Kollam', 'Kozhikode', 
                  'Kurnool', 'Ludhiana', 'Lucknow', 'Madurai', 'Malappuram', 'Mathura', 'Mangalore', 'Meerut', 'Moradabad', 
                  'Mysore', 'Nagpur', 'Nanded', 'Nashik', 'Nellore', 'Noida', 'Patna', 'Pondicherry', 'Purulia', 'Prayagraj', 
                  'Raipur', 'Rajkot', 'Rajahmundry', 'Ranchi', 'Rourkela', 'Ratlam', 'Salem', 'Sangli', 'Shimla', 'Siliguri', 
                  'Solapur', 'Srinagar', 'Surat', 'Thanjavur', 'Thiruvananthapuram', 'Thrissur', 'Tiruchirappalli', 'Tirunelveli', 
                  'Tiruvannamalai', 'Ujjain', 'Bijapur', 'Vadodara', 'Varanasi', 'Vasai-Virar City', 'Vijayawada', 'Visakhapatnam', 
                  'Vellore', 'Warangal']:
        return 2
    else:
        return 3

def get_city_avg(city_name):
        city_avg_map = {
            "Mumbai": 264.61586752348,
            "Delhi": 6500.0,
            "Agra":39.883133,
            "Siliguri":37.71204819277108,
            "Noida":135.0367911714771,
            "Raigad":28.918461538461536,
            "Bhubaneswar":60.59553191489361,
            "Nagpur":66.30386904761905,
            "Bhiwadi":25.418633540372674,
            "Faridabad":56.12788906009245,
            "Lalitpur":250.9768793852322,
            "Maharashtra":310.0906269791007,
            "Vadodara":53.819411764705876,
            "Visakhapatnam":65.22597765363129,
            "Mangalore":66.75327868852459,
            "Aurangabad":32.31515151515152,
            "Vijayawada":49.510000000000005,
            "Belgaum":44.142105263157895,
            "Bhopal":32.06422018348624,
            "Wardha":24.4,
            "Pune":134.19696132596687,
            "Mohali":116.85323741007193,
            "Chennai":141.67314741035858,
            "Jaipur":55.33284823284823,
            "Vapi":24.427027,
            "Bangalore": 162.82778341013827,
            "Mysore":62.35348837209302,
            "Ghaziabad":54.40696412143514,
            "Kochi":133.88146341463414,
            "Kolkata": 99.8070801638385    
        }
        return city_avg_map.get(city_name, 6000.0)

def map_data(data):
    mapped_data = data.copy()  # Make a copy of the original data to avoid modifying it directly
    mapped_data['city_tier'] = map_city(data['city'])
    mapped_data['city_avg'] = get_city_avg(data['city'])

    if mapped_data['posted_by'] == 0:
        mapped_data['owner'] = 1
        mapped_data['builder'] = 0
        mapped_data['dealer'] = 0
    
    if mapped_data['posted_by'] == 1:
        mapped_data['owner'] = 0
        mapped_data['builder'] = 1
        mapped_data['dealer'] = 0
    if mapped_data['posted_by'] == 2:
        mapped_data['owner'] = 0
        mapped_data['builder'] = 0
        mapped_data['dealer'] = 1
    

    latitude, longitude = get_coordinates(data['locality'] + " " + data['city'])
    # print(latitude, longitude)
    mapped_data['latitude'] = latitude
    mapped_data['longitude'] = longitude


    return mapped_data


@app.route('/', methods=['GET'])
def test():

    return jsonify({"status": 200})


@app.route('/predict_property', methods=['POST'])
def predict_property():
    data = request.json

    # ---- HARD SAFETY CHECKS ----
    required_fields = [
        'under_construction', 'rera', 'bhk', 'square_feet',
        'ready_to_move', 'resale',
        'posted_by', 'locality', 'city'
    ]

    missing = [f for f in required_fields if f not in data]
    if missing:
        return jsonify({
            "error": "Missing required fields",
            "missing_fields": missing
        }), 400

    mapped_data = map_data(data)

    feature_names = [
        'under_construction',
        'rera',
        'bhk',
        'square_feet',
        'ready_to_move',
        'resale',
        'longitude',
        'latitude',
        'city_tier',
        'city_avg',
        'builder',
        'dealer',
        'owner'
    ]

    features = [mapped_data[name] for name in feature_names]
    input_array = np.array([features])

    prediction = model1.predict([features])[0]
    shap_image = generate_property_shap_plot(
    model=model1,
    input_array=input_array,
    feature_names=feature_names
)
    return jsonify({
        "prediction": float(prediction),
        "shap_image": shap_image
    })



@app.route('/predict_loan', methods=['POST'])
def predict_loan():
    info = request.json

    feature_names = [
        "loan_amnt",
        "term",
        "int_rate",
        "funded_amnt_inv",
        "dti",
        "tot_coll_amnt",
        "revol_bal",
        "collection_recovery_fee",
        "revol_util",
        "total_cur_bal",
        "last_week_pay",
        "delinq_2yrs",
        "inq_last_6mths",
        "open_acc",
        "total_acc"
    ]

    input_data = [
        info.get(name, 0) for name in feature_names
    ]

    if loan_scaler is not None:
        input_scaled = loan_scaler.transform([input_data])
    else:
        input_scaled = np.array([input_data])

    prediction = model2.predict(input_scaled)[0]
    confidence = model2.predict_proba(input_scaled)[0][1]

    lime_image = generate_loan_lime_plot(
        model=model2,
        training_data=X_train_loan,   
        input_array=input_scaled,
        feature_names=feature_names
    )

    return jsonify({
        "prediction": "Approved" if prediction == 1 else "Rejected",
        "confidence": round(float(confidence), 3),
        "lime_plot": lime_image
    })


@app.route('/predict_stock', methods=['POST'])
def predict_stock():
    data = request.json

    features = [
        data['open'],
        data['high'],
        data['low'],
        data['volume'],
        data['change'],
        data['prev_price']
    ]

    feature_names = [
        "Open",
        "High",
        "Low",
        "Vol.(Millions)",
        "Change",
        "Prev_Price"
    ]

    X_scaled = stock_scaler.transform([features])
    input_df = pd.DataFrame(X_scaled, columns=feature_names)
 
    prediction = stock_model.predict(X_scaled)[0][0]

    shap_image = generate_shap_plot(
    stock_model,
    input_df,
    feature_names
    )


    return jsonify({
        "prediction": round(float(prediction), 2),
        "shap_plot": shap_image
    })



if __name__== '__main__':
    app.run(debug=True)