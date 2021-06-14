import pandas as pd
import re
import string
import time
import json
import numpy as np
from transformers import BertTokenizer, TFBertForSequenceClassification
from tensorflow.keras.backend import clear_session
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras import backend as K
import tensorflow as tf
from flask import jsonify
import json
from nltk.corpus import stopwords

def loadModel(preprocessedSearchedTweets):
    print("*************************************************")
    print(preprocessedSearchedTweets)
    resultsDETAILED=[]
    results=[]
    labeledTweets=[]
    labeledTweetsDETAILED={}
    model1 = TFBertForSequenceClassification.from_pretrained('results/tokenizer/')
    tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")
    tf_batch = tokenizer(preprocessedSearchedTweets, max_length=128, padding=True, truncation=True, return_tensors='tf') 
    tf_outputs = model1(tf_batch)                                  
    tf_predictions = tf.nn.softmax(tf_outputs[0], axis=-1)      
    labels = ['Negative','Positive']
    label = tf.argmax(tf_predictions, axis=1)
    label = label.numpy()
    for i in range(len(preprocessedSearchedTweets)):
        resultsDETAILED.append(round(tf_predictions[i][0].numpy().tolist(),4))
        results.append(round(tf_predictions[i][0].numpy().tolist(),2))
        labeledTweets.append([preprocessedSearchedTweets[i],labels[label[i]]])
        # print("-----*-*-**---------------------")
        # print(labels[label[i]])
        labeledTweetsDETAILED[preprocessedSearchedTweets[i]]=resultsDETAILED[i]
    tuples=list(zip(preprocessedSearchedTweets,results))
    df = pd.DataFrame(tuples, columns=['Tweet','results'])
    polarityvals=df.values.tolist();
    # print("----------------")
    # print(labeledTweets)
    # print("------------------------------------")
    # print(labeledTweetsDETAILED)
    # print("****************************************")
    # print(labels)
    data={'labeledTweetsDETAILED':labeledTweetsDETAILED,
         'labeledTweets':labeledTweets,
         "results":polarityvals}
    return data