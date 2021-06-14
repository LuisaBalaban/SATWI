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
import json
from nltk.corpus import stopwords
# spam_words=['act','get','got','like','please','make','buy','call','click','compare','free','get','open','opt','order','order','miss','yourself','Sign','Stop','subscription','link','chance','next','unsubscribe','visit','Competitions','Congratulations','giveaway','prize','prizes','Win','Winner','Won','winner','selected','Order','shipped','retweet','follow','$$$', 'dollars','cash','think','least','would','could','already','away','us','says', '-', '_', 'im', 'still', 'back', 'deal!', 'deal', 'go', 'like', 'said','one', 'mates']
spam_words=[]
for w in spam_words:
 w.lower()
stop_words = set(stopwords.words('english'))


def loadModel(preprocessedSearchedTweets):
 added_polarity={};
 bubble_chart_data=[];
 word_sentiment_negative=[]
 word_sentiment_positive=[]
 polarity=''
 results=[]
 resultsDETAILED=[]
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
 labeledTweetsDETAILED={}
 resultTwee={}
 for i in range(len(preprocessedSearchedTweets)):
  results.append(round(tf_predictions[i][0].numpy().tolist(),2))
  resultsDETAILED.append(round(tf_predictions[i][0].numpy().tolist(),4))
  labeledTweets[preprocessedSearchedTweets[i]]=labels[label[i]];
  labeledTweetsDETAILED[preprocessedSearchedTweets[i]]=resultsDETAILED[i]
#  print(labeledTweetsDETAILED);
 for tweet in labeledTweetsDETAILED:
   tweet=preprocess._processTweet(tweet)
   polarity=0
   words=tweet.split()
   words=[w for w in words if w not in stop_words] 
#    print(words)
   for word in words:
    #print(word)
    for word_frq in APIcall.rt_paired_freq.keys():
      if word.lower()==word_frq.lower():
         polarity=labeledTweetsDETAILED[tweet]
         if word_frq in added_polarity:
          added_polarity[word]=polarity+added_polarity[word_frq]
         else:
          added_polarity[word]=polarity
    added_polarity[word]=polarity/APIcall.rt_paired_freq[word_frq][1]
 tuples=list(zip(preprocessedSearchedTweets,results))
 df = pd.DataFrame(tuples, columns=['Tweet','results'])
 for word in APIcall.rt_paired_freq.keys():
  if APIcall.rt_paired_freq[word][1]>=2:
    if word not in spam_words:
     if APIcall.rt_paired_freq[word][0]>=2:  
      bubble_chart_data.append([word,added_polarity[word],APIcall.rt_paired_freq[word][1],APIcall.rt_paired_freq[word][0]])
     if added_polarity[word]<0.5:
      word_sentiment_positive.append([word,APIcall.rt_paired_freq[word][1],'stroke-color: #703593; opacity:0.7; fill-color: #703593'])
     else:
      word_sentiment_negative.append([word,APIcall.rt_paired_freq[word][1],'stroke-color: #703593; opacity:0.7; fill-color: #703593'])
#  print('&&&&&&&&&&&&&&')
#  print(bubble_chart_data)
#  array=np.array(results).tolist()
 #polarityToJson(df)
#  print(labeledTweets)
#  print('****************')
#  print(APIcall.most_retweeted)
#  print(APIcall.max_faved)
 polarityvals=df.values.tolist();
 jsonData={"labeledTweets":[labeledTweets],
           "results":[polarityvals],
           "count":APIcall.count(),
           "mostRetweeted":str(APIcall.most_retweeted),
           "rts":[item[0] for item in APIcall.rt_paired_freq.values()],
           "freq":[item[1] for item in APIcall.rt_paired_freq.values()],
           "words": APIcall.rt_paired_freq,
           "polarity":added_polarity,
           "bubble_chart_data":bubble_chart_data,
           "max_followers":str(APIcall.max_faved),
           "total_no_rtweets":APIcall.total_no_rtweets,
           "total_no_tweets":APIcall.total_no_tweets,
           "no_hashtags":len(APIcall.hashtags_text),
           "all_followers":APIcall.all_followers,
           "most_used_hashtag":str(APIcall.most_used_hashtag),
           "word_sentiment_positive":word_sentiment_positive,
           "word_sentiment_negative":word_sentiment_negative,
           "timeline":APIcall.timeline}
 #print(jsonData)
 return jsonData

# def polarityToJson(polarityValues):
#   out=polarityValues.to_json(orient='records')
#   with open('C:\\Users\\Admin\\Desktop\\an 3\\DemoSC\\demo_sc\\frontend\\src\\polarityValues.json', 'w') as f:
#    f.seek(0) 
#    f.write(out)
#    f.truncate()
#   return 
