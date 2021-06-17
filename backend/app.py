from flask import Flask, jsonify, render_template
import json 
import string
import time
from threading import Thread
from flask_socketio import SocketIO, emit, join_room, leave_room, \
    close_room, rooms, disconnect
from flask import request
import environ
from API import APIcall
from datetime import datetime
from flask import jsonify
import csv
from API import Preprocess
from API import APIcallBrand
from API import APIcallDB
from API import SA 
from API import SADB
from API import SAtriggers
from API import ComputingData
import json
import random
from flask_cors import CORS, cross_origin
from flask_mysqldb import MySQL
import yaml
import pandas as pd
thread = None
app = Flask(__name__, template_folder="components")
app.config['CORS_HEADERS'] = 'Content-Type'
cors = CORS(app)
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] =  'pass'
app.config['MYSQL_DB'] = 'satwidb'
mysql=MySQL(app)
async_mode = None

from tweepy.streaming import StreamListener
from tweepy import Stream
import tweepy
if async_mode is None:
    try:
        import eventlet
        async_mode = 'eventlet'
    except ImportError:
        pass
    if async_mode is None:
        try:
            from gevent import monkey
            async_mode = 'gevent'
        except ImportError:
            pass
    if async_mode is None:
        async_mode = 'threading'
    print('async_mode is ' + async_mode)

socketio = SocketIO(app, async_mode=async_mode,cors_allowed_origins="*")

class StdOutListener(StreamListener):
    def __init__(self):
        pass
    def on_data(self, data):
        try: 
            tweet = json.loads(data)
            print(tweet)
            text = tweet
            socketio.emit('board',
                  {'data': text, 'time': tweet[u'timestamp_ms']}, namespace='/board')
        except: 
            pass 
    def on_error(self, status):
        print('Error status code'+ status)
        exit()

def background_thread():
    stream = Stream(APIcall.auth, l)
    _keywords = [':-)', ':-(']
    stream.filter(track=_keywords) 
    
@socketio.on('client-server')
@cross_origin()
def handle_client_msg(msg):
  print("\n" + str(msg))  
    
@app.route('/result', methods = ['POST'])
@cross_origin()
def result():
  keyword = request.json['keyword']
  newSet=APIcall.creatingTestSet(keyword)
  preprocessedSearchedTweets=Preprocess.processTweets(newSet)
  print(preprocessedSearchedTweets)
  labeledTweets=SA.loadModel(preprocessedSearchedTweets)
  print(type(labeledTweets))
  labeledTweets=jsonify(labeledTweets)
  return labeledTweets

@app.route('/profileBoard', methods = ['POST'])
@cross_origin()
def profileBoard():
  conn = mysql.connect
  cursor = conn.cursor()
  profile = request.json['profile']
  providedUserId=profile['googleId']
  name=profile['name']
  email=profile['email']
  firstName=profile['givenName']
  lastName=profile['familyName']
  cursor.execute("SELECT Name, Email from USERS WHERE ProvidedUserId LIKE %s", [providedUserId])
  conn.commit()
  data = list(cursor.fetchall())
  print(data)
  type(data)
  headers = {
    "Content-Type": "application/octet-stream",
    "Content-Disposition": "attachment; filename=foobar.json"}
  if data:
     cursor.execute("SELECT BoardId, TwitterHandle, Competitor from Boards WHERE ProvidedUserId LIKE %s", [providedUserId])
     conn.commit()
     data1 = list(cursor.fetchall())
     print(data1)
     type(data1)
     data1.append(data)
     cursor.execute("SELECT ProjectName, Feature, TriggerFeature, Date, ProjectId from Projects WHERE BoardId LIKE %s", [data1[0][0]])
     conn.commit()
     data2 = list(cursor.fetchall())
     data1.append(data2)
     print("------------------------------------")
     print(data1)
     return jsonify({"body": data1}), 200, headers
  else:
     return  jsonify({"msg": "no user with that id in database"}), 404 



@app.route('/board')
@cross_origin()
def index():
    global thread
    if thread is None: 
        thread = Thread(target=background_thread)
        thread.daemon = True
        thread.start()
    return render_template('Board.js')

@app.route('/register', methods = ['POST'])
@cross_origin()
def register():
  conn = mysql.connect
  cursor = conn.cursor()
  profile=request.json['profile']
  print(profile)
  userName=profile['name']
  email=profile['email']
  googleId=profile['googleId']
  valuesUser=(googleId, email, userName,"+401288381")
  cursor.execute( "INSERT INTO Users (ProvidedUserId, Email, Username, Phone) VALUES  (%s,%s,%s,%s)", valuesUser)
  conn.commit()
  info=[]
  info.append(userName)
  info.append(googleId)
  info.append(email)
  return jsonify({"body": info}), 200
  
  

@app.route('/board-config', methods = ['POST'])
@cross_origin()
def board():
  conn1 = mysql.connect
  cursor1 = conn1.cursor()
  jsonfeatures={}
  features=[]
  triggers=[]
  dates=[]
  projectNames=[]
  projectIds=[]
  ProvidedUserId=request.json['userId']
  noProjects=request.json['noProjects']
  if noProjects >= 1:
   feature1 = request.json['feature1']
   trigger1 = request.json['trigger1']
   date1 = request.json['date1']
   projectName1 = request.json['projectName1']
   features.append(feature1)
   triggers.append(trigger1)
   projectNames.append(projectName1)
   dates=[date1]
   projectIds.append(random.getrandbits(28))
   if noProjects >= 2:
    feature2 = request.json['feature2']
    trigger2 = request.json['trigger2']
    date2 = request.json['date2']
    projectName2 = request.json['projectName2']
    features.append(feature2)
    triggers.append(trigger2)
    dates.append(date2)
    projectNames.append(projectName2)
    projectIds.append(random.getrandbits(28))
    if noProjects==3:
      feature3=request.json['feature3']
      trigger3=request.json['trigger3']
      date3 = request.json['date3']
      projectName3 = request.json['projectName3']
      features.append(feature3)
      triggers.append(trigger3)
      dates.append(date3)
      projectNames.append(projectName3)
      projectIds.append(random.getrandbits(28))
  username = request.json['username']
  competitor=request.json['competitor']
  ReceiveRecommendations=request.json['ReceiveRecommendations']
  ReceiveEmails=request.json['ReceiveEmails']
  ReceiveMonthlyReport=request.json['ReceiveMonthlyReport']
  print(features)
  print(dates)
  print(triggers)
  i=0
  BoardId=random.getrandbits(28)
  valuesUserBoard=(BoardId, ProvidedUserId, competitor, username, ReceiveRecommendations, ReceiveEmails, ReceiveMonthlyReport)
  cursor1.execute( "INSERT INTO Boards (BoardId, ProvidedUserId, Competitor, TwitterHandle, ReceiveRecommendations,ReceiveEmails,ReceiveMonthlyReport) VALUES  (%s,%s,%s,%s,%s,%s,%s)", valuesUserBoard)
  conn1.commit()
  conn = mysql.connect
  cursor = conn.cursor()
  for i in range(len(projectIds)):
      feature=features[i]
      valuesProject=(BoardId, projectIds[i], projectNames[i] ,features[i], triggers[i], dates[i])
      cursor.execute( "INSERT INTO Projects (BoardId, ProjectId, ProjectName, Feature, TriggerFeature, Date) VALUES (%s,%s,%s,%s,%s,%s)", valuesProject)
      conn.commit()
      jsonfeatures[feature]=ComputingData.extractingDataForFeatures(username,feature,dates[i],jsonfeatures)
      j=0;
      print("FEATURES")
      print(jsonfeatures[feature]['timeline'][0])
      print(dict(jsonfeatures[feature]['labeledTweets']).keys())
      for tweet in dict(jsonfeatures[feature]['labeledTweets']).keys():
          print(dict(jsonfeatures[feature]['labeledTweetsDETAILED']).get(tweet))
          print( dict(jsonfeatures[feature]['labeledTweets']).get(tweet))
          print(round(dict(jsonfeatures[feature]['labeledTweetsDETAILED']).get(tweet),2))
          valuesTweet=(projectIds[i], feature, tweet.encode('unicode_escape'), dict(jsonfeatures[feature]['labeledTweetsDETAILED']).get(tweet), dict(jsonfeatures[feature]['labeledTweets']).get(tweet),round(dict(jsonfeatures[feature]['labeledTweetsDETAILED']).get(tweet),2),APIcallDB.retweet_count_list[j], APIcallDB.followers_count_list[i],APIcallDB.hashtags_count_list[i],jsonfeatures[feature]['timeline'][0][j], False,  APIcallDB.ids[j], APIcallDB.tweetType[j])
          cursor.execute( "insert into FeaturesTweets (ProjectID, Feature, Tweet, DetailedScore, Label, Score, RetweetCount, Followers, Hashtags, CreatedAt, TriggerState, TweetId, TweetType) values (%s,%s,%s,%s,%s,%s,%s,%s,%s, %s, %s,%s, %s)", valuesTweet)
          conn.commit()
          j=j+1
  for i in range(len(projectIds)):
      trigger=triggers[i]
      jsonfeatures[trigger]=ComputingData.extractingDataForTriggers(username,trigger,jsonfeatures)
      k=0
      x=0
      print("&&&&&&&&&&&&&******************&&&&&&&&")
      print(j)
      print("TRGGERS")
      print(dict(jsonfeatures[trigger]['labeledTweets']).keys())
      for tweet in dict(jsonfeatures[trigger]['labeledTweets']).keys():
        if x==j:
         valuesTweetTrigger=(projectIds[i], dict(jsonfeatures[trigger]['labeledTweetsDETAILED']).get(tweet), trigger, tweet.encode('unicode_escape'), dict(jsonfeatures[trigger]['labeledTweets']).get(tweet),round(dict(jsonfeatures[trigger]['labeledTweetsDETAILED']).get(tweet),2),APIcallDB.retweet_count_list[j], APIcallDB.followers_count_list[j],APIcallDB.hashtags_count_list[j],jsonfeatures[trigger]['timeline'][1][k], True, APIcallDB.ids[j], APIcallDB.tweetType[j])
         cursor.execute( "insert into FeaturesTweets (ProjectID, DetailedScore, Feature, Tweet, Label, Score, RetweetCount, Followers, Hashtags, CreatedAt, TriggerState,TweetId, TweetType) values (%s,%s,%s,%s,%s,%s,%s,%s,%s, %s, %s,%s, %s)", valuesTweetTrigger)
         conn.commit()
         k=k+1;
        else:
         x=x+1
  if competitor:
      set3=APIcall.creatingTestSet(competitor)
      preprocessedSearchedTweets3=Preprocess.processTweets(set3)
      labeledTweets3=SA.loadModel(preprocessedSearchedTweets3)
      jsonfeatures[competitor]=labeledTweets3
      m=0
      for tweet in dict(jsonfeatures[competitor]['labeledTweets'][0]).keys():
        valuesCompetitor=(projectIds[0], dict(jsonfeatures[competitor]['labeledTweetsDETAILED']).get(tweet), competitor, tweet.encode('unicode_escape'), dict(jsonfeatures[competitor]['labeledTweets'][0]).get(tweet),jsonfeatures[competitor]['scores'][m],jsonfeatures[competitor]['timeline'][0][m],jsonfeatures[competitor]['retweet_count_list'][m])
        cursor.execute( "insert into FeaturesTweets (ProjectID, DetailedScore, Feature, Tweet, Label, Score, CreatedAt, RetweetCount) values (%s,%s,%s,%s,%s,%s,%s, %s)", valuesCompetitor)
        conn.commit()
        m=m+1
  
  jsonfeatures['ids']=projectIds;
  jsonfeatures=jsonify(jsonfeatures)
  return jsonfeatures

@app.route('/boardStats', methods = ['POST'])
@cross_origin()
def boardStats():
  results={}
  noProjects=request.json['noProjects']
  projectIds=[]
  if noProjects >= 1:
   projId1 = request.json['projId1']
   projectIds.append(projId1)
   if noProjects >= 2:
        projId2 = request.json['projId2']
        projectIds.append(projId2)
        if noProjects==3:
            projId3 = request.json['projId3']
            projectIds.append(projId3)
  conn = mysql.connect
  cursor = conn.cursor()
  info={}
  for projectId in projectIds:
    cursor.execute( "SELECT * FROM FeaturesTweets WHERE ProjectId LIKE %s",[projectId])
    conn.commit()
    data = list(cursor.fetchall())
    info[projectId]=data
    tweetScore={}
    triggerTweets=[]
    polarityVals=[]
    triggerData=[]
    featureTweets=[]
    countPoz=0
    allFollowersTrigger=0
    countNeg=0
    hashtagsTrigger=''
    retweetCount={}
    timeline=[]
    averageTriggerPolarity=0
    mostPopularUserTrigger=0
    mostRetweetedTweetFeature=0
    maxRet=0
    timelineCount=[]
    maxFollowers=0
    tweetType=[]
    countPozCompetitor=0;
    countNegCompetitor=0;
    retweetCountCompetitor={}
    polarityValsCompetitor=[]
    timelineCompetitor=[]
    timelineCountCompetitor=[]
    competitorTweets=[]
    competitorScore={}
    cursor.execute( "SELECT boards.competitor FROM boards INNER join projects on projects.boardid=boards.boardid")
    conn.commit()
    boardCompetitor = list(cursor.fetchall())
    print("*********")
    print(boardCompetitor[0][0])
    for tweet in info[projectId]:
      if tweet[1]!=boardCompetitor[0][0]:
        if tweet[10]==1:
          print(tweet)
          triggerTweets.append(tweet[2])
          polarityVals.append([tweet[2], tweet[11]])
          allFollowersTrigger+=tweet[6]
          timeline.append(tweet[8])
          hashtagsTrigger=hashtagsTrigger+tweet[7][0]
          averageTriggerPolarity=averageTriggerPolarity+tweet[4]
          if(maxFollowers<tweet[6]):
            mostPopularUserTrigger=tweet[12]
            maxFollowers=tweet[6]
        else:
          featureTweets.append(tweet[2])
          tweetScore[tweet[2]]=tweet[11]
          if tweet[4]==0:
            countPoz+=1
          if tweet[4]==1:
            countNeg+=1;
          polarityVals.append([tweet[2], tweet[11]])
          retweetCount[tweet[2]]=tweet[5]
          if(maxRet<tweet[5]):
            mostRetweetedTweetFeature=tweet[12]
            maxRet=tweet[5]
          tweetType.append(tweet[13])
          date_time_obj = datetime.strptime(tweet[8], '%Y-%m-%d %H:%M:%S')
          timeline.append(date_time_obj)
      else:
        #competitor
        competitorTweets.append(tweet[2])
        competitorScore[tweet[2]]=tweet[11]
        if tweet[4]==0:
          countPozCompetitor+=1
        if tweet[4]==1:
          countNegCompetitor+=1
        date_time_obj = datetime.strptime(tweet[8], '%Y-%m-%d %H:%M:%S')
        timelineCompetitor.append(date_time_obj)
        polarityValsCompetitor.append([tweet[2], tweet[11]])
        retweetCountCompetitor[tweet[2]]=tweet[5]
        
    dataframe_Timeline_trigger=pd.DataFrame(timeline, columns=['date'])
    dataframe_Timeline_trigger['day/month/year/hh'] = dataframe_Timeline_trigger['date'].apply(lambda x: "%d-%d-%d %d" % (x.month, x.day, x.year, x.hour))
    dataframe_Timeline_trigger= dataframe_Timeline_trigger.groupby(['day/month/year/hh']).size().to_frame('count').reset_index()
    timelineCount=dataframe_Timeline_trigger.to_numpy()
    timelineCount=timelineCount.tolist()
      
      #competitor
    dataframe_Timeline_competitor=pd.DataFrame(timelineCompetitor, columns=['date'])
    dataframe_Timeline_competitor['day/month/year/hh'] = dataframe_Timeline_competitor['date'].apply(lambda x: "%d-%d-%d %d" % (x.month, x.day, x.year, x.hour))
    dataframe_Timeline_competitor= dataframe_Timeline_competitor.groupby(['day/month/year/hh']).size().to_frame('count').reset_index()
    timelineCountCompetitor=dataframe_Timeline_competitor.to_numpy()
    timelineCountCompetitor=timelineCountCompetitor.tolist()
    cursor.execute( "SELECT TriggerFeature, ProjectName, Feature from Projects WHERE ProjectId LIKE %s",[projectId])
    conn.commit()
    projectInfo = list(cursor.fetchall())
    #feature
    allTweets=ComputingData.createTweetsList(featureTweets)
    wordlist=allTweets.split()
    rt_paired_freq=ComputingData.pairRetCountWithWords(wordlist, retweetCount)
    word_pairings = ComputingData.pairingWordsWithRetCountAndPolarity(tweetScore,rt_paired_freq)
    averageTriggerPolarity=averageTriggerPolarity/len(triggerTweets)*100;
      
      #competitor 
    allCompetitorTweets=ComputingData.createTweetsList(competitorTweets)
    wordlistCompetitor=allCompetitorTweets.split()
    print("********&&&&&&&&&&&*********")
    print(retweetCountCompetitor)
    rt_paired_freq_Competitor=ComputingData.pairRetCountWithWords(wordlistCompetitor, retweetCountCompetitor)
    word_pairings_competitor = ComputingData.pairingWordsWithRetCountAndPolarity(competitorScore,rt_paired_freq_Competitor)
    results[projectId]={
       'polarityVals':polarityVals,
        'triggerFeature':projectInfo[0][0],
        'feature':projectInfo[0][2],
        'projectName':projectInfo[0][1],
        'countPozCompetitor':countPozCompetitor,
        'countNegCompetitor':countNegCompetitor,
       "timelineCountCompetitor": [timelineCountCompetitor],
       "word_pairings_Competitor_Pos":word_pairings_competitor['word_sentiment_positive'],
        "word_pairings_Competitor_Neg":word_pairings_competitor['word_sentiment_negative'],
        'added_polarity_Competitor':word_pairings_competitor['added_polarity'],
       'countPoz':countPoz,
       'tweetType':tweetType,
        'countNeg':countNeg,
        'averageTriggerPolarity':averageTriggerPolarity,
        'hashtagsTrigger':hashtagsTrigger,
        'timeline':timelineCount,
        'allFollowersTrigger':allFollowersTrigger,
      'word_pairings':word_pairings,
      'rt_paired_freq':rt_paired_freq, 
      'word_sentiment_positive':word_pairings['word_sentiment_positive'],
      "word_sentiment_negative":word_pairings['word_sentiment_negative'],
      "polarity":word_pairings['added_polarity'],
      "bubble_chart_data":word_pairings['bubble_chart_data'],
      # "rts":[item[0] for item in rt_paired_freq.values()],
      # "freq":[item[1] for item in rt_paired_freq.values()],
      # "words": rt_paired_freq,
      "mostRetweetedTweetFeature":str(mostRetweetedTweetFeature),
      'mostPopularUserTrigger':str(mostPopularUserTrigger)
        }
  return jsonify({"body": results}), 200

l = StdOutListener()
if __name__ == '__main__':
    socketio.run(app, debug=True, host='127.0.0.1')