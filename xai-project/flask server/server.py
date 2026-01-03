from flask import Flask, request, render_template, jsonify
from flask_cors import CORS
import requests
import joblib
from dotenv import dotenv_values

config = dotenv_values(".env")

app = Flask(__name__)
CORS(app)
model1 = joblib.load("random_forest_model_property_value.joblib")
model2 = joblib.load("logistic_regression_model.joblib")

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
def predict():
    data = request.json
    mapped_data = map_data(data)
    print(mapped_data)

    features = [
        mapped_data['under_construction'],
        mapped_data['rera'],
        mapped_data['bhk'],
        mapped_data['square_feet'],
        mapped_data['ready_to_move'],
        mapped_data['resale'],
        mapped_data['longitude'],
        mapped_data['latitude'],
        mapped_data['city_tier'],
        mapped_data['city_avg'],
        mapped_data['builder'],
        mapped_data['dealer'],
        mapped_data['owner'],
    ]

    prediction = model1.predict([features])

    return jsonify({"prediction": prediction[0]})


@app.route('/predict_loan', methods=['POST'])
def predict_loan():
    """
    Predict loan default using Logistic Regression model.
    
    Expected features in order (15 features):
    1. loan_amnt (Loan Amount)
    2. term (Term)
    3. int_rate (Interest Rate)
    4. funded_amnt_inv (Funded Amount Investor)
    5. dti (Debit to Income)
    6. tot_coll_amnt (Total Collection Amount)
    7. revol_bal (Revolving Balance)
    8. collection_recovery_fee (Collection Recovery Fee)
    9. revol_util (Revolving Utilities)
    10. total_cur_bal (Total Current Balance)
    11. last_week_pay (Last week Pay)
    12. delinq_2yrs (Delinquency - two years)
    13. inq_last_6mths (Inquires - six months)
    14. open_acc (Open Account)
    15. total_acc (Total Accounts)
    """
    info = request.json
    
    # Map incoming request to the 15 features in the exact order the model expects
    input_data = [
        info.get('loan_amnt', 0),                    # 1. Loan Amount
        info.get('term', 0),                          # 2. Term
        info.get('int_rate', 0),                     # 3. Interest Rate
        info.get('funded_amnt_inv', 0),              # 4. Funded Amount Investor
        info.get('dti', 0),                          # 5. Debit to Income
        info.get('tot_coll_amnt', 0),                # 6. Total Collection Amount
        info.get('revol_bal', 0),                    # 7. Revolving Balance
        info.get('collection_recovery_fee', 0),      # 8. Collection Recovery Fee
        info.get('revol_util', 0),                   # 9. Revolving Utilities
        info.get('total_cur_bal', 0),                # 10. Total Current Balance
        info.get('last_week_pay', 0),               # 11. Last week Pay
        info.get('delinq_2yrs', 0),                  # 12. Delinquency - two years
        info.get('inq_last_6mths', 0),               # 13. Inquires - six months
        info.get('open_acc', 0),                     # 14. Open Account
        info.get('total_acc', 0)                     # 15. Total Accounts
    ]
    
    # Scale the input data if scaler is available
    if loan_scaler is not None:
        input_data_scaled = loan_scaler.transform([input_data])
    else:
        input_data_scaled = [input_data]
    
    # Make prediction
    prediction = model2.predict(input_data_scaled)
    
    return jsonify({"prediction": int(prediction[0])})


if __name__== '__main__':
    app.run(debug=True)