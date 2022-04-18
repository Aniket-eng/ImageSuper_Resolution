from PIL import Image
from flask import Flask, request,jsonify
from flask import render_template
import script
import cv2
import os,io
import numpy as np
from flask_cors import CORS
import base64
from keras.models import load_model



app = Flask(__name__)
CORS(app)

""" @app.route('/')
def index():
    return render_template('index.html')  """


@app.route('/predict_image',methods=['POST'])
def predict_image():
    srcnn = load_model('SRCNN_Model.h5')
    print(request.files)
    """ f = request.files['file']
    f.save(f.filename)
    print(f.filename) 
    directory = r'F:\drag drop'"""
    input = request.files['image'].read()
    
    
    """ os.chdir(directory)
    name = f.filename
    img = cv2.imread(name) """
    
    npimg = np.fromstring(input, np.uint8)
    # convert numpy array to images
    img = cv2.imdecode(npimg, cv2.IMREAD_UNCHANGED)
    result = script.predict(img)
    # filename = 'saveImage.png'
    img = Image.fromarray(result.astype("uint8"))
    rawBytes = io.BytesIO()
    img.save(rawBytes, "JPEG")
    rawBytes.seek(0)
    img_base64 = base64.b64encode(rawBytes.read())
    return jsonify({'status':str(img_base64)})
     
    

    

if __name__=="__main__":
    print("Starting python flask server")
    app.run()