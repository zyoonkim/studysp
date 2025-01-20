import cv2
import torch
import time
import os
import json




model = torch.hub.load('ultralytics/yolov5', 'yolov5s')

# open webcam
cap = cv2.VideoCapture(0)
interval = 5  
# testing ^^
last_capture = time.time()


cam_index = [0,1,2,3,4,5]
cam_counts = {}

for cam_inxnum in cam_index:

# Check if  webcam  accessible
    if not cap.isOpened():
        print(f"Cam {cam_inxnum} not accessible.")
        continue
    
    print(f"Webcam {cam_inxnum} accessible.")

    
    ret, frame = cap.read()
    if not ret:
            print(f"Failed to capture frame from Webcam {cam_inxnum}")
            cap.release()
            continue

    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    current_time = time.time()

    if current_time - last_capture >= interval:
        
        results = model(frame_rgb)

        # Render
        results.render()  

        detections = results.xywh[0]  # bounding box format
        
        
        # actually counting
        people_count = sum(1 for detection in detections if int(detection[5]) == 0)  # Class ID 0 = people w this model

        cam_counts[f"camera_{cam_inxnum}"] = {people_count}

        last_capture = current_time  # update time

        cap.release()

output_data = {"people_counts": cam_counts}
with open("people_counts.json", "w") as output_file:
    json.dump(output_data, output_file, indent=4)



cv2.destroyAllWindows()