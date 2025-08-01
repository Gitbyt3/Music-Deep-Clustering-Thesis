import csv
import os
from firebase_admin import credentials, firestore, storage, initialize_app

def initialise_firebase():
    cred = credentials.Certificate('serviceAccountKey.json')
    initialize_app(cred, {'storageBucket':'thesis-evaluation-survey.firebasestorage.app'})
    return firestore.client(), storage.bucket()

# def import_clusters(db, csv_path=os.path.join(os.getcwd(), 'CSV_files', 'cluster_scores.csv')):
#     with open(csv_path) as csv_file:
#         for row in csv.DictReader(csv_file):
#             print(row)
#             db.collection('clusters').document(row['label']).set({'median_valence':float(row['valence']), 'median_arousal':float(row['arousal'])})
#             print(f"Imported cluster: {int(row['label'])}")

# def import_tracks_clustered(db, csv_path=os.path.join(os.getcwd(), 'CSV_files', 'tracks_clustered.csv')):
#     with open(csv_path, encoding='utf-8') as csv_file:
#         for row in csv.DictReader(csv_file):
#             track_id = f'{row['file']}_{row['label']}'
#             track_data = {
#                     'cluster_id':row['label'],
#                     'dist_to_centroid':float(row['dist_centroid']),
#                     'valence':float(row['valence']),
#                     'arousal':float(row['arousal']),
#                     'audio':{
#                         		'url':f'https://storage.googleapis.com/thesis-evaluation-survey.firebasestorage.app/tracks/{row['file']}',
#                                 'filename':row['file']},
#                     'film_metadata':{
#                         		'familiarity':row['familiarity'],
#                                 'track_title':row['title'],
#                                 'track_composer':row['composer'],
#                                 'film_title':row['film'],
#                                 'film_release_year':float(row['year']),
#                                 'film_genre':row['genre'],
#                                 'film_director':row['director']}
#                     }
#             db.collection('audio_tracks').document(track_id).set(track_data)
#             print(f'Imported track: {track_id}')

def import_tracks_unique(db, csv_path=os.path.join(os.getcwd(), 'CSV_files', 'arousal_valence.csv')):
    with open(csv_path, encoding='utf-8') as csv_file:
        unique_tracks = []
        for row in csv.DictReader(csv_file):
            track_id = row['file']
            if track_id not in unique_tracks:
                track_data = {
                    'audio':{
                            'url':f'https://storage.googleapis.com/thesis-evaluation-survey.firebasestorage.app/tracks/{track_id}',
                            'filename':track_id},
                    'film_metadata':{
                        'track_composer':row['composer'],
                        'film_title':row['film'],
                        'film_release_year':float(row['year']),
                        'film_genre':row['genre'],
                        'film_director':row['director']}
                    }
                db.collection('audio_tracks_unique').document(track_id).set(track_data)
                print(f'Imported track: {track_id}')
                unique_tracks.append(track_id)

# def upload_audio_files(bucket, audio_path=os.path.join(os.getcwd(), 'audios')):
#     for filename in os.listdir(audio_path):
#         filepath = os.path.join(audio_path, filename)
#         blob = bucket.blob(f"tracks/{filename}")
#         blob.metadata = {'contentType': f'audio/{filename.split('.')[-1]}',
#                          'cacheControl': 'public, max-age=31536000'}
#         blob.upload_from_filename(filepath)
#         blob.make_public()
#         print(f"Uploaded audio: {filename} -> {blob.public_url}")

if __name__ == "__main__":
    db, bucket = initialise_firebase()
    import_tracks_unique(db)
    