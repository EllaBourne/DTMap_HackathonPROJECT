from flask import Flask, jsonify, render_template
import requests

app = Flask(__name__)

# NASA EONET API URL and API key
NASA_API_URL = "https://eonet.gsfc.nasa.gov/api/v2.1/events"
NASA_API_KEY = "GET_API_TOKEN"

# Google Maps API key
GOOGLE_MAPS_API_KEY = "GET_API_TOKEN"

@app.route('/')
def home():
    """Serve the index.html file."""
    return render_template('index.html')

@app.route('/api/nasa-disasters', methods=['GET'])
def get_nasa_disasters():
    """Fetch natural disaster data from NASA API (v2.1) and return as JSON."""
    try:
        # Add the API key to the request parameters
        params = {
            'api_key': NASA_API_KEY
        }

        # Request data from NASA's EONET API
        response = requests.get(NASA_API_URL, params=params)
        response.raise_for_status()  # Raise an exception for bad status codes

        # Try to parse JSON directly without relying on Content-Type header
        try:
            data = response.json()
        except ValueError:
            return jsonify({'error': 'Failed to parse JSON', 'details': response.text}), 500

        # Extract relevant information: title, coordinates, and description
        disaster_data = []
        for event in data['events']:
            if event['geometries']:  # Ensure event has coordinates
                coordinates = event['geometries'][0]['coordinates']
                disaster_data.append({
                    'title': event['title'],
                    'coordinates': coordinates,
                    'description': event.get('description', 'No description available')
                })

        return jsonify(disaster_data), 200

    except requests.exceptions.RequestException as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/test-google-maps', methods=['GET'])
def test_google_maps():
    """Query Google's Geocoding API to test Google Maps integration."""
    params = {
        'address': 'San Francisco, CA',
        'key': GOOGLE_MAPS_API_KEY
    }
    google_maps_url = "https://maps.googleapis.com/maps/api/geocode/json"

    try:
        response = requests.get(google_maps_url, params=params)
        response.raise_for_status()
        data = response.json()
        return jsonify(data), 200
    except requests.exceptions.RequestException as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
