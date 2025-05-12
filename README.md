# Smart Library Occupancy Monitor (Proof of Concept) 
## ⚠️⚠️ Still in Progress ⚠️⚠️

A proof-of-concept application demonstrating how real-time library space monitoring could work using AI-powered people detection. This prototype uses a mobile device's camera to simulate how the system would work with library-installed cameras.

## Overview

This project demonstrates how libraries could implement automated occupancy monitoring. In a production environment, this would use fixed cameras installed in library spaces rather than mobile device cameras. The current implementation uses a mobile camera to simulate this functionality.

## Features

- Simulated real-time people detection (using mobile camera as a stand-in for library cameras)
- Floor-by-floor capacity monitoring for multiple libraries
- Automatic space monitoring with 30-second refresh intervals
- Processed images with detection overlays
- Support for multiple university libraries (Shapiro, Hatcher, Law, Duderstadt)

## Tech Stack

### Frontend

- React Native
- Expo
- Axios for API communication
- Expo Camera for image capture

### Backend

- Flask (Python)
- YOLOv5 for object detection
- PyTorch
- OpenCV
- Flask-CORS

## Prerequisites

- Node.js and npm
- Python 3.7+
- Expo CLI
- iOS/Android device or emulator

## Setup Instructions

### Backend Setup

1. Navigate to the Detect directory:

```bash
cd Detect
```

2. Install Python dependencies:

```bash
pip install flask flask-cors torch opencv-python numpy
```

3. Start the Flask server:

```bash
python app.py
```

The server will run on http://localhost:5000

### Frontend Setup

1. Navigate to the Studyapp directory:

```bash
cd Studyapp
```

2. Install dependencies:

```bash
npm install
```

3. Start the Expo development server:

```bash
expo start
```

4. Use the Expo Go app on your mobile device to scan the QR code, or press 'i' for iOS simulator or 'a' for Android emulator.

## Usage

1. Launch the app and grant camera permissions when prompted
2. Select a library from the list to view floor-by-floor capacity
3. Use the camera to simulate how library-installed cameras would work:
   - Tap "Take Picture" for manual detection
   - Enable "Auto-refresh" for continuous monitoring
4. View the processed image with detection overlays and people count
5. Check floor capacities in the library dropdowns

Note: In a production environment, this would use fixed cameras installed in library spaces rather than mobile device cameras. The current implementation is a proof of concept using mobile cameras to demonstrate the functionality.

## API Endpoints

- POST `/detect`: Accepts base64-encoded image data and returns people count and processed image

## Environment Variables

- `REACT_APP_API_URL`: Backend API URL (defaults to http://localhost:5000)
