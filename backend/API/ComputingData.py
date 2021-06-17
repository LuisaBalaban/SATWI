from API import APIcallDB
from API import Preprocess
from API import SADB
from API import SAtriggers
from API import APIcallBrand
from API import APIcall
import pandas as pd


def extractingDataForFeatures(username,feature,date,jsonfeatures):
    query1=feature+' '+username+' since:'+date
    set1=APIcallDB.creatingTestSet(query1)
    preprocessedSearchedTweets1=Preprocess.processTweets(set1)
    labeledTweets1=SADB.loadModel(preprocessedSearchedTweets1)
    jsonfeatures[feature]=computeDataForFeature(labeledTweets1)
    return jsonfeatures[feature]

def extractingDataForTriggers(username,trigger,jsonfeatures):
    query2=trigger+' '+username
    set2=APIcallDB.creatingTestSet(query2)
    preprocessedSearchedTweets2=Preprocess.processTweets(set2)
    labeledTweets2=SADB.loadModel(preprocessedSearchedTweets2)
    jsonfeatures[trigger]=labeledTweets2
    jsonfeatures[trigger]=computeDataForFeature(labeledTweets2)
    #print("Printing trigger data")
    return jsonfeatures[trigger]

def computeDataForFeature(labeledTweets):
   max_faved=APIcallDB.max_faved
   rt_paired_freq={}
   allTweets=''
   tweets = labeledTweets['labeledTweetsDETAILED']
   allTweets=createTweetsList(tweets.keys())
   wordlist=allTweets.split()
   wordPairs=createWordsListFromTweets(wordlist,allTweets)
   rt_paired_freq=pairRetCountWithWords(wordlist, APIcallDB.tweets_rt_count)
   word_pairings = pairingWordsWithRetCountAndPolarity(tweets,rt_paired_freq)
   df = pd.DataFrame(labeledTweets.items(), columns=['Tweet','results'])
   polarityvals=df.values.tolist();
   data={'labeledTweets':labeledTweets['labeledTweets'],
         'labeledTweetsDETAILED':labeledTweets['labeledTweetsDETAILED'],
         'score':labeledTweets['scores'],
          'results':polarityvals,
          "count":APIcallDB.count(),
          "mostRetweeted":str(APIcallDB.most_retweeted),
          "rts":[item[0] for item in rt_paired_freq.values()],
           "freq":[item[1] for item in rt_paired_freq.values()],
           "words": rt_paired_freq,
           "max_followers":str(max_faved),
           "total_no_rtweets":APIcallDB.total_no_retweets,
           "total_no_tweets":30,
           "timeline":APIcallDB.timelineTimestamps,
           "no_hashtags":len(APIcallDB.hashtags_pairing_id.keys()),
           "all_followers":APIcallDB.all_followers,
           "most_used_hashtag":str(APIcallDB.most_used_hashtag),
           'word_sentiment_positive':word_pairings['word_sentiment_positive'],
           "word_sentiment_negative":word_pairings['word_sentiment_negative'],
           "polarity":word_pairings['added_polarity'],
           "bubble_chart_data":word_pairings['bubble_chart_data'],
   }
   return data


def pairingWordsWithRetCountAndPolarity(tweets,rt_paired_freq):
  word_sentiment_negative=[]
  word_sentiment_positive=[]
  bubble_chart_data=[];
  added_polarity={};
  for tweet in tweets:
       words=tweet.split()
       for word in words:
            polarity=0
            for word_frq in rt_paired_freq.keys():
                if word.lower()==word_frq.lower():
                 polarity=tweets[tweet]
                 if word_frq in added_polarity:
                    added_polarity[word]=polarity+added_polarity[word_frq]
                 else:
                    added_polarity[word]=polarity
            added_polarity[word]=polarity/rt_paired_freq[word_frq][1]
  for word in rt_paired_freq.keys():
       if rt_paired_freq[word][1]>=2:
            # if word not in spam_words:
                if rt_paired_freq[word][0]>=2:
                    bubble_chart_data.append([word,added_polarity[word],rt_paired_freq[word][1],rt_paired_freq[word][0]])
                if added_polarity[word]<0.5:
                     word_sentiment_positive.append([word,rt_paired_freq[word][1],'stroke-color: #703593; opacity:0.7; fill-color: #703593'])
                else:
                     word_sentiment_negative.append([word,rt_paired_freq[word][1],'stroke-color: #703593; opacity:0.7; fill-color: #703593'])
  word_pairings={'word_sentiment_negative':word_sentiment_negative,
    'word_sentiment_positive':word_sentiment_positive,
    'bubble_chart_data':bubble_chart_data,
    'added_polarity':added_polarity}
  return word_pairings

def pairRetCountWithWords(wordlist,rt_count):
    freqdict={}
    sorteddict=[]
    rt_paired_freq={}
    freqdict=APIcall.wordListToFreqDict(wordlist)
    sorteddict=APIcall.sortFreqDict(freqdict)
    for value in rt_count:
     totalRTS=0
     words=value.split()
     for word in words:
       for word_rt in sorteddict:
         word_freq=word_rt[1]
         if word==word_freq:
           totalRTS=totalRTS+int(rt_count[value])
           rt_paired_freq[word]=[totalRTS,word_rt[0]]
    return rt_paired_freq
    
def createTweetsList(tweets):
    allTweets=''
    for tweet in tweets:
        allTweets+=tweet
    return allTweets

def createWordsListFromTweets(wordlist,allTweets):
   wordfreq=[]
   for w in wordlist:
      wordfreq.append(wordlist.count(w))
      wordPairs=str(list(zip(wordlist, wordfreq)))
   return wordPairs 