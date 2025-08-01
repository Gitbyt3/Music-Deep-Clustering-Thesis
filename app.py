from flask import Flask, jsonify, request
from firebase_admin import credentials, firestore, storage, initialize_app
from google.cloud.firestore_v1.base_query import FieldFilter
import torch
import torch.nn.functional as F
from flask_cors import CORS
import os
import importlib.util
import sys
import pickle
from dotenv import load_dotenv
from waitress import serve
import tempfile

load_dotenv()
app = Flask(__name__)
CORS(app)
cred = credentials.Certificate(os.getenv("GOOGLE_APPLICATION_CREDENTIALS"))
initialize_app(cred, {'storageBucket':os.getenv("FIREBASE_STORAGE_BUCKET")})
db, bucket = firestore.client(), storage.bucket()

downloaded_files = {}
model = None

@app.route('/api/download-files', methods=['GET'])
def download_files():
    try:
        files = {
            'audio_dict.pkl':'mvp_2_files/audio_dict.pkl',
            'audio_projections.pkl':'mvp_2_files/audio_projections.pkl',
            'ids.pkl':'mvp_2_files/ids.pkl',
            'model_weights.pt':'mvp_2_files/model_weights.pt',
            'model.py':'mvp_2_files/model.py'
        }
        temp_dir = tempfile.mkdtemp()

        for filename, path in files.items():
            blob = bucket.blob(path)
            temp_path = os.path.join(temp_dir, filename)
            blob.download_to_filename(temp_path)
            downloaded_files[filename] = temp_path

        spec = importlib.util.spec_from_file_location('model', downloaded_files['model.py'])
        model_module = importlib.util.module_from_spec(spec)
        sys.modules['model'] = model_module
        spec.loader.exec_module(model_module)

        from model import VaDE
        global model
        model = VaDE(input_dim=640, hidden_dims=[512, 256, 128], latent_dim=32, n_clusters=6)
        model.load_state_dict(torch.load(downloaded_files['model_weights.pt'], map_location=torch.device('cpu')))
        model.to('cpu')
        model.eval()

        return jsonify({'status':'success', 'message':'Files Downloaded, Model Loaded', 'files':list(files.keys())})

    except Exception as e:
        return jsonify({'status':'error', 'message':str(e)}), 500

def retrieve_k_closest(AV_query, database, ids, audio_dict, model, k=5):
    with torch.no_grad():
        query_tensor = torch.tensor(AV_query, dtype=torch.float32).unsqueeze(0)
        query_projected = model.projector(model.av_encoder(query_tensor))

    query_projected = F.normalize(query_projected, p=2, dim=1)
    database['projected_audio'] = F.normalize(database['projected_audio'], p=2, dim=1)

    similarities = torch.mm(query_projected, database['projected_audio'].T)
    topk_similarity, topk_indices = torch.topk(similarities.squeeze(), k=k+20)
    topk_similarity = topk_similarity.tolist()
    topk_clusters = database['cluster_ids'][topk_indices].tolist()
    topk_ids = [ids[index] for index in topk_indices.tolist()]

    unique_ids, unique_similarities, unique_clusters = [], [], []
    for sim, id, cluster in zip(topk_similarity, topk_ids, topk_clusters):
        if id not in unique_ids:
            unique_ids.append(id), unique_similarities.append(sim), unique_clusters.append(cluster)
            if len(unique_ids) == k:
                break

    unique_filenames = [os.path.basename(audio_dict[id]) for id in unique_ids]
    return unique_filenames

@app.route('/api/get-tracks', methods=['POST'])
def retrieve_tracks():
    try:
        data = request.json
        input_arousal, input_valence = float(data['arousal']), float(data['valence'])
        if abs(input_arousal) > 1 or abs(input_valence) > 1: raise ValueError('Arousal/Valence must be between -1 and +1')

        with open(downloaded_files['audio_dict.pkl'], 'rb') as f:
            audio_dict = pickle.load(f)
        with open(downloaded_files['audio_projections.pkl'], 'rb') as f:
            audio_projections = pickle.load(f)
        with open(downloaded_files['ids.pkl'], 'rb') as f:
            ids = pickle.load(f)

        audio_projections['projected_audio'] = audio_projections['projected_audio'].cpu()
        audio_projections['cluster_ids'] = audio_projections['cluster_ids'].cpu()

        retrieved_filenames = retrieve_k_closest((input_arousal, input_valence), audio_projections, ids, audio_dict, model)
        print(f'Retrieved filenames: {retrieved_filenames}')
        tracks_ref = db.collection('audio_tracks_unique').where(filter=FieldFilter('audio.filename', 'in', retrieved_filenames))
        track_dict = {track.id: track.to_dict() for track in tracks_ref.stream()}
        print(f'Firestore track_dict: {track_dict}')
        tracks_retrieved = []
        for fn in retrieved_filenames:
            if fn in track_dict:
                tracks_retrieved.append(track_dict[fn])

        debug_info = {
            'input':(input_arousal, input_valence),
            'retrieved_filenames':retrieved_filenames,
            'firestore_data':track_dict
        }

        if len(tracks_retrieved) == 0:
            return jsonify({'status':'debug', 'data':debug_info})

        return jsonify({'status':'success', 'tracks':tracks_retrieved})

    except Exception as e:
        return jsonify({'status':'error', 'message':str(e)}), 500

if __name__ == "__main__":
    # app.run(debug=True)
    serve(app, host="0.0.0.0", port=8080)