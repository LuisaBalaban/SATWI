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
retweets=[]
timeline=[]
tweets=[]
wordJSON={}
most_retweeted=0
tweets_rt={}
tweets_nsw=[]
rt_paired_freq={}
max_faved=0
rt_count=0
max_fav_count=0
total_no_tweets=0
hashtags=[]
all_followers=0
retweet_count_list=[]
hashtags_text=[]
hashtags_pairing_id={}
hashtags_freq={}
most_used_hashtag=0
created_at=[]
timelineRepeatedList=[]
timelineTimestamps=[]
def creatingTestSet(searched_keyword):
   
   global tweets_rt
   global max_fav_count 
   global all_followers
   global rt_count 
   global timeline
   global max_faved
   global most_retweeted 
   global rt_paired_freq
   global retweets
   global tweets
   global total_no_tweets
   global total_no_rtweets
   global hashtags
   global no_hashtags
   global hashtags_text
   global hashtags_freq
   global hashtags_pairing_id
   global most_used_hashtag
   global created_at
   hashtags=[]
   most_used_hashtag=0
   all_followers=0
   hashtags_text=[]
   retweets=[]
   no_hashtags=0
   tweets=[]
   timeline=[]
   rt_paired_freq={}
   res = []
   tweets_rt={}
   max_fav_count =0
   rt_count =0
   hashtags_freq={}
   max_faved=0
   most_retweeted =0
   total_no_tweets=0
   total_no_rtweets=0
   hashtags_pairing_id={}
   created_at=[]

   for tweet_info in tweepy.Cursor(api.search, q=searched_keyword,rpp=50, lang="en", tweet_mode='extended', type='popular').items(50):
     created_at.append(tweet_info.created_at)
     retweet_count_list.append(tweet_info.retweet_count)
     if 'retweeted_status' in dir(tweet_info):
               tweet=tweet_info.retweeted_status.full_text
               retweets.append(tweet)
               if tweet_info.retweet_count > rt_count:
                 rt_count=tweet_info.retweet_count
                 most_retweeted=tweet_info.id
               if tweet_info.user.followers_count>max_fav_count:
                 max_fav_count=tweet_info.user.followers_count
                 max_faved=tweet_info.id
               ht=[]
               if tweet_info.entities.get('hashtags'):
                   hashtags.append(tweet_info.entities['hashtags'])
                   if hashtags[0]:
                     for text in hashtags[0]:
                      print(text)
                      print(text['text'])
                      hashtags_text.append(text['text'])    
                      hashtags_pairing_id[text['text']]=tweet_info.id              
     else:
               tweet=tweet_info.full_text
               tweets.append(tweet)
               total_no_rtweets+=1
               if tweet_info.retweet_count > rt_count:
                 rt_count=tweet_info.retweet_count
                 most_retweeted=tweet_info.id
     hashtags_freq=Counter(hashtags_text)         
     all_followers+=tweet_info.user.followers_count
     total_no_tweets+=1   
     res.append(tweet) 
     tweets_rt[tweet]=tweet_info.retweet_count
   if list(hashtags_freq):  
    most_used_hashtag=hashtags_pairing_id[list(hashtags_freq)[0]]
   allTweets=''
   for tweet in res:
     tweet=preprocess._processTweet(tweet)
     allTweets+=tweet
   wordlist=allTweets.split() 
   wordlist=[w for w in wordlist if w not in stop_words] 
   wordfreq=[]
   for w in wordlist:
      wordfreq.append(wordlist.count(w))
   wordPairs=str(list(zip(wordlist, wordfreq))) 
   freqdict=wordListToFreqDict(wordlist)
   sorteddict=sortFreqDict(freqdict)
   for value in tweets_rt.keys():
    totalRTS=0
    words=value.split()
    for word in words:
      for word_rt in sorteddict:
        word_freq=word_rt[1]
        if word==word_freq:
         totalRTS+=tweets_rt[value]
         rt_paired_freq[word]=[totalRTS,word_rt[0]]
   
   dataframe_Timeline=pd.DataFrame(created_at, columns=['date'])
   timelineRepeatedList=dataframe_Timeline.reset_index();
   timelineRepeatedList=timelineRepeatedList.to_numpy()
   timelineRepeatedList=timelineRepeatedList.tolist()
   for i in range(len(timelineRepeatedList)):
      timelineRepeatedList[i]=timelineRepeatedList[i][1]   
   dataframe_Timeline['day/month/year/hh'] = dataframe_Timeline['date'].apply(lambda x: "%d-%d-%d %d" % (x.month, x.day, x.year, x.hour))
   timelineTimestamps.append(timelineRepeatedList)
   dataframe_Timeline= dataframe_Timeline.groupby(['day/month/year/hh']).size().to_frame('count').reset_index()
   timeline=dataframe_Timeline.to_numpy()
   timeline=timeline.tolist()
   #print(timeline)
   return [tweet for tweet in res]

def count():
 count=[] 
 count_re=0;
 count_tw=0; 
 for i in retweets:
  count_re+=1;
 for j in tweets:
  count_tw+=1;
 count.append(count_re);
 count.append(count_tw); 
 return count;

def wordListToFreqDict(wordlist):
    wordfreq = [wordlist.count(p) for p in wordlist]
    return dict(list(zip(wordlist,wordfreq)))
  
def sortFreqDict(freqdict):
    aux = [(freqdict[key], key) for key in freqdict]
    aux.sort()
    aux.reverse()
    return aux