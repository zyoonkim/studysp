from flask import Flask, jsonify, request
from flask_cors import CORS
import cv2
import torch
import time
import os
import json
import base64
import numpy as np

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load YOLOv5 model
model = torch.hub.load('ultralytics/yolov5', 'yolov5s')

@app.route('/detect', methods=['POST'])
def detect_people():
    try:
        # Get image data from request
        data = request.json
        if not data or 'image' not in data:
            return jsonify({'error': 'No image data provided'}), 400

        # Decode base64 image
        image_data = base64.b64decode(data['image'])
        nparr = np.frombuffer(image_data, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if frame is None:
            return jsonify({'error': 'Failed to decode image'}), 400

        # Convert to RGB
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        # Run detection
        results = model(frame_rgb)
        results.render()
        
        # Get detections
        detections = results.xywh[0]
        
        # Count people
        people_count = sum(1 for detection in detections if int(detection[5]) == 0)

        # Convert the processed image back to base64
        _, buffer = cv2.imencode('.jpg', frame)
        processed_image = base64.b64encode(buffer).decode('utf-8')

        return jsonify({
            'people_count': people_count,
            'processed_image': processed_image
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)