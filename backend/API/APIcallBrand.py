import pandas as pd
import numpy as np
import json
import collections
import twitter
from pickle import load
import joblib
import string
from numpy import array
import nltk
import re
from nltk.corpus import stopwords
from sklearn import preprocessing
import random
import tweepy
from API import Connect as connect
from collections import Counter
from API import Preprocess as preprocess

stop_words = set(stopwords.words('english'))

auth = tweepy.OAuthHandler(connect.consumer_key,connect.consumer_secret)
auth.set_access_token(connect.access_token_key, connect.access_token_secret)
api = tweepy.API(auth)

def creatingTestSet(rawquery):
    tweets=[]
    retweets=[]
    res=[]
    for tweet_info in tweepy.Cursor(api.search, q=rawquery,rpp=50, lang="en", tweet_mode='extended', type='popular').items(50):
        print(tweet_info)
        if 'retweeted_status' in dir(tweet_info):
               tweet=tweet_info.retweeted_status.full_text
               retweets.append(tweet)
        else:
               tweet=tweet_info.full_text
               tweets.append(tweet)
        print(tweet)
        res.append(tweet) 
    return [tweet for tweet in res]