import cv2
import numpy as np
from keras.models import load_model


def predict(input):
    
    # load the srcnn model with weights
    srcnn = load_model('SRCNN_Model.h5')
    
    # load the degraded and reference images
    degraded = input
    
    
    
    # preprocess the image with modcrop
    degraded = modcrop(degraded, 3)
    
    # convert the image to YCrCb - (srcnn trained on Y channel)
    temp = cv2.cvtColor(degraded, cv2.COLOR_BGR2YCrCb)
    
    # create image slice and normalize  
    Y = np.zeros((1, temp.shape[0], temp.shape[1], 1), dtype=float)
    Y[0, :, :, 0] = temp[:, :, 0].astype(float) / 255
    
    # perform super-resolution with srcnn
    pre = srcnn.predict(Y, batch_size=1)
    
    # post-process output
    pre *= 255
    pre[pre[:] > 255] = 255
    pre[pre[:] < 0] = 0
    pre = pre.astype(np.uint8)
    
    # copy Y channel back to image and convert to BGR
    temp = shave(temp, 6)
    temp[:, :, 0] = pre[0, :, :, 0]
    output = cv2.cvtColor(temp, cv2.COLOR_YCrCb2BGR)
    
    # remove border from reference and degraged image
    
    degraded = shave(degraded.astype(np.uint8), 6)

    result = cv2.cvtColor(output, cv2.COLOR_BGR2RGB)
    
    # return images and scores
    return result


def modcrop(degraded, scale):
    tmpsz = degraded.shape
    sz = tmpsz[0:2]
    sz = sz - np.mod(sz, scale)
    degraded = degraded[0:sz[0],1:sz[1]]
    return degraded



def shave(image, border):
    img = image[border: -border, border: -border]
    return img


""" img = cv2.imread("pancard Aniket Matodkar.jpg")
result = predict(img)
result1 =  cv2.cvtColor(result, cv2.COLOR_BGR2RGB)
filename="rsult.jpg"
cv2.imwrite(filename, result1) """