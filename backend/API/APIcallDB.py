
import pandas as pd
import numpy as np
import tweepy
from collections import Counter
from API import Connect as connect

auth = tweepy.OAuthHandler(connect.consumer_key,connect.consumer_secret)
auth.set_access_token(connect.access_token_key, connect.access_token_secret)
api = tweepy.API(auth)
   
def creatingTestSet(searched_keyword):
    created_at=[]
    hashtags=[]
    ids=[]
    tweetType=[]
    retweet_count_dict={}
    followers_count_list=[]
    hashtags_pairing_id={}
    tweet_followers=[]
    result=[]
    users=[]
    for tweet_info in tweepy.Cursor(api.search, q=searched_keyword,rpp=30, lang="en", tweet_mode='extended', type='popular').items(30):
        tweet_information=extractTweetData(tweet_info,created_at,ids,tweetType,retweet_count_dict, followers_count_list,hashtags_pairing_id,tweet_followers, hashtags,users)
        if 'retweeted_status' in dir(tweet_info):
            tweet=tweet_info.retweeted_status.full_text
        else: 
            tweet=tweet_info.full_text
        result.append(tweet)
    createdTestSet={"tweet_information":tweet_information,
                    "result":[tweet for tweet in result]}
    return createdTestSet

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

def extractTweetData(tweet_info, created_at,ids,tweetType,retweet_count_dict, followers_count_list, hashtags_pairing_id,tweet_followers,hashtags, users):
    print(tweet_info.created_at)
    created_at.append(tweet_info.created_at)
    users.append(tweet_info.user.screen_name)
    ids.append(tweet_info.id)
    if 'retweeted_status' in dir(tweet_info):
            tweet=tweet_info.retweeted_status.full_text
            tweetType.append("retweet")
    else: 
            tweet=tweet_info.full_text
            tweetType.append("text")
    retweet_count_dict[tweet]=tweet_info.retweet_count
    followers_count_list.append(tweet_info.user.followers_count)
    if tweet_info.entities.get('hashtags'):       
        if tweet_info.entities['hashtags'][0]['text']:
                hashtags_pairing_id[tweet_info.entities['hashtags'][0]['text']]=tweet_info.id
                hashtags.append( tweet_info.entities['hashtags'][0]['text'])
        else:         
            hashtags.append("NaN")
    else:
       hashtags.append("NaN")
    tweet_info={"tweet_type":tweetType,
                "created_at":created_at,
                "retweet_count_dict":retweet_count_dict,
                "followers_count_list":followers_count_list,
                "hashtags_pairing_id":hashtags_pairing_id,
                "ids":ids  ,
                "hashtags":hashtags,
                "users":users  
                }
    return tweet_info