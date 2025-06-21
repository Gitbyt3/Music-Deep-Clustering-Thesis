from flask import Flask, jsonify, request
from firebase_admin import credentials, firestore, storage, initialize_app
from google.cloud.firestore_v1.base_query import FieldFilter
import numpy as np
from flask_cors import CORS
import os
from dotenv import load_dotenv
from waitress import serve

load_dotenv()
app = Flask(__name__)
CORS(app)
cred = credentials.Certificate(os.getenv("GOOGLE_APPLICATION_CREDENTIALS"))
initialize_app(cred, {'storageBucket':"FIREBASE_STORAGE_BUCKET"})
db, bucket = firestore.client(), storage.bucket()

def get_all_clusters():
    clusters_ref = db.collection('clusters')
    cluster_data = {int(doc.id): doc.to_dict() for doc in clusters_ref.stream()}
    sorted_cluster_data = sorted(cluster_data.items(), key=lambda i: i[0])
    cluster_array = np.array([[cluster[1]['median_arousal'], cluster[1]['median_valence']] for cluster in sorted_cluster_data])
    return cluster_array

@app.route('/api/find-tracks', methods=['POST'])
def find_tracks():
    try:
        data = request.json
        input_arousal, input_valence = float(data['arousal']), float(data['valence'])
        if abs(input_arousal) > 1 or abs(input_valence) > 1: raise ValueError('Arousal/Valence must be between -1 and +1')

        clusters = get_all_clusters()
        input_score = np.array([input_arousal, input_valence])
        closest_centroid = np.argmin(np.linalg.norm(clusters - input_score, axis=1))

        tracks_ref = db.collection('audio_tracks').where(filter=FieldFilter('cluster_id', '==', str(closest_centroid))).order_by('dist_to_centroid').limit(5)
        tracks_retrieved = [track.to_dict() for track in tracks_ref.stream()]
        
        return jsonify({
            'status':'success',
            'closest_centroid':str(closest_centroid),
            'tracks':tracks_retrieved
        })
    
    except Exception as e:
        return jsonify({
            'status':'error',
            'message':str(e)
        }), 400


if __name__ == "__main__":
    serve(app, host="0.0.0.0", port=8080)