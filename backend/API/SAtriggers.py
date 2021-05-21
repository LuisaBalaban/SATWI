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
from API import APIcall as APIcall
from API import Preprocess as preprocess
from API import APIcallBrand as APIcallBrand
import json 
from nltk.corpus import stopwords
spam_words=['act','get','got','like','please','make','buy','call','click','compare','free','get','open','opt','order','order','miss','yourself','Sign','Stop','subscription','link','chance','next','unsubscribe','visit','Competitions','Congratulations','giveaway','prize','prizes','Win','Winner','Won','winner','selected','Order','shipped','retweet','follow','$$$', 'dollars','cash','think','least','would','could','already','away','us','says', '-', '_', 'im', 'still', 'back', 'deal!', 'deal', 'go', 'like', 'said','one', 'mates']
for w in spam_words:
 w.lower()
stop_words = set(stopwords.words('english'))


def loadModel(preprocessedSearchedTweets):
 added_polarity={};
 bubble_chart_data=[];
 polarity=''
 results=[]
 df=[]
#  global word_sentiment_negative
#  global word_sentiment_positive
 model1 = TFBertForSequenceClassification.from_pretrained('results/tokenizer/')
 tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")
 tf_batch = tokenizer(preprocessedSearchedTweets, max_length=128, padding=True, truncation=True, return_tensors='tf') 
 tf_outputs = model1(tf_batch)                                  
 tf_predictions = tf.nn.softmax(tf_outputs[0], axis=-1)      
 labels = ['Negative','Positive']
 label = tf.argmax(tf_predictions, axis=1)
 label = label.numpy()
 labeledTweets={}
 for i in range(len(preprocessedSearchedTweets)):
  results.append(round(tf_predictions[i][0].numpy().tolist(),2))
  labeledTweets[preprocessedSearchedTweets[i]]=labels[label[i]]

 tuples=list(zip(preprocessedSearchedTweets,results))
 df = pd.DataFrame(tuples, columns=['Tweet','results'])
 polarityvals=df.values.tolist();
 i=0
 average=0
 for val in results:
     average=average+val
     i=i+1
 average=average/i
 jsonData={"labeledTweets":[labeledTweets],
           "results":[polarityvals],
           "count":APIcallBrand.count(),
           "mostRetweeted":str(APIcallBrand.most_retweeted),
           "polarity":added_polarity,
           "max_followers":str(APIcallBrand.max_faved),
           "total_no_rtweets":APIcallBrand.total_no_rtweets,
           "total_no_tweets":APIcallBrand.total_no_tweets,
           "all_followers":APIcallBrand.all_followers,
        #    "most_used_hashtag":str(APIcall.most_used_hashtag),
           "most_used_hashtag":APIcallBrand.hashtags_text,
           "average":average*100,
           "timeline":APIcallBrand.timeline}
 print(jsonData)
 return jsonData