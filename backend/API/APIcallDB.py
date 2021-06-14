import twitter
import collections
import pandas as pd
import numpy as np
import tweepy
from collections import Counter
from API import Connect as connect

auth = tweepy.OAuthHandler(connect.consumer_key,connect.consumer_secret)
auth.set_access_token(connect.access_token_key, connect.access_token_secret)
api = tweepy.API(auth)


created_at=[]
retweets=[]
tweets=[]
hashtags_pairing_id={}
result= []
hashtags=[]
tweets_rt_count={}
rt_count=0
most_retweeted=0
max_fav_count=0
max_faved=0
all_followers=0
total_no_retweets=0
most_used_hashtag=0
retweet_count_list=[]
followers_count_list=[]
hashtags_count_list=[]
timeline=[]


   
def creatingTestSet(searched_keyword):
    global most_retweeted
    global max_fav_count
    global max_faved
    global most_used_hashtag
    global all_followers
    global total_no_retweets
    global rt_count
    rt_count=0
    most_retweeted=0
    max_fav_count=0
    max_faved=0
    all_followers=0
    total_no_retweets=0
    most_used_hashtag=0
    for tweet_info in tweepy.Cursor(api.search, q=searched_keyword,rpp=30, lang="en", tweet_mode='extended', type='popular').items(30):
        created_at.append(tweet_info.created_at)
        if 'retweeted_status' in dir(tweet_info):
            tweet=tweet_info.retweeted_status.full_text
            retweets.append(tweet)
            total_no_retweets+=1
        else: 
            tweet=tweet_info.full_text
            tweets.append(tweet)
        if tweet_info.retweet_count > rt_count:
                 rt_count=tweet_info.retweet_count
                 most_retweeted=tweet_info.id
        retweet_count_list.append(tweet_info.retweet_count)
        if tweet_info.user.followers_count>max_fav_count:
                 max_fav_count=tweet_info.user.followers_count
                 max_faved=tweet_info.id
        followers_count_list.append(tweet_info.user.followers_count)
        if tweet_info.entities.get('hashtags'):             
          hashtags.append(tweet_info.entities['hashtags'])
          if hashtags[0]:
                 for hashtag in hashtags[0]:
                        hashtags_pairing_id[hashtag['text']]=tweet_info.id
                        hashtags_count_list.append(hashtags[0])
        else:
              hashtags_count_list.append("0")
        all_followers+=tweet_info.user.followers_count
        result.append(tweet)
        tweets_rt_count[tweet]=tweet_info.retweet_count
    hashtags_freq=Counter(hashtags_pairing_id.keys()) 
    if list(hashtags_freq):  
     most_used_hashtag=hashtags_pairing_id[list(hashtags_freq)[0]]
    dataframe_Timeline=pd.DataFrame(created_at, columns=['date'])
    dataframe_Timeline['day/month/year/hh'] = dataframe_Timeline['date'].apply(lambda x: "%d-%d-%d %d" % (x.month, x.day, x.year, x.hour))
    dataframe_Timeline= dataframe_Timeline.groupby(['day/month/year/hh']).size().to_frame('count').reset_index()
    timeline=dataframe_Timeline.to_numpy()
    timeline=timeline.tolist()
  
    print(max_faved)
    print('-------------------------------')
    print('-------------------------------')
    print(len(retweet_count_list))
    print(len(followers_count_list))
    print(len(hashtags_count_list))
    print(len(created_at))
    return [tweet for tweet in result]

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