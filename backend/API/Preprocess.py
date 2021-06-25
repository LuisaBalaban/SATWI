import re
from nltk.tokenize import word_tokenize
from string import punctuation
from nltk.corpus import stopwords

_stopWords = set(stopwords.words('english') + list(punctuation) + ['AT_USER', 'URL'])
def _processTweet(tweet):
 if isinstance(tweet,list):
            newTweet = ""
            for element in tweet:
                newTweet+=element
 else:
        newTweet=tweet
        newTweet=newTweet.lower()
        newTweet = newTweet.replace(".", "")
        newTweet = newTweet.replace(",", "")
        newTweet = newTweet.replace("&", "")
        newTweet = re.sub(r'@[^\s]+', '', newTweet)  # remove username
        newTweet = re.sub(r'#([^\s]+)', r'\1', newTweet)  # remove the # in the #hastags
        newTweet = re.sub('((www\.[^\s]+)|(https?://[^\s]+))', '', newTweet)  # remove URLs
        newTweet=re.sub(r'^rt[\s]+', '', newTweet)
        newTweet = re.sub(r"n\'t", " not", newTweet)
        newTweet = re.sub(r"\'re", " are", newTweet)
        newTweet = re.sub(r"\'s", " is", newTweet)
        newTweet = re.sub(r"\'d", " would", newTweet)
        newTweet = re.sub(r"\'ll", " will", newTweet)
        newTweet = re.sub(r"\'t", " not", newTweet)
        newTweet = re.sub(r"\'ve", " have", newTweet)
        newTweet = re.sub(r"\'m", " am", newTweet)
        newTweet = ' '.join([word for word in newTweet.split() if word not in (_stopWords)])
        return newTweet

def processTweets(list_of_tweets):
        processedTweets=[]
        for tweet in list_of_tweets:
               processedTweets.append(_processTweet(tweet))
        return processedTweets
