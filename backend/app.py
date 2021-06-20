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
  featuresInfo=[]
  featuresInfo.append(userName)
  featuresInfo.append(googleId)
  featuresInfo.append(email)
  return jsonify({"body": featuresInfo}), 200
  
  

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
      j=0
      for tweet in dict(jsonfeatures[feature]['labeledTweets']).keys():
          valuesTweet=(projectIds[i], 
                       feature, 
                       tweet.encode('unicode_escape'), 
                       dict(jsonfeatures[feature]['labeledTweetsDETAILED']).get(tweet), 
                       dict(jsonfeatures[feature]['labeledTweets']).get(tweet),
                       round(dict(jsonfeatures[feature]['labeledTweetsDETAILED']).get(tweet),2),
                       jsonfeatures[feature]['retweet_count_list'][j],
                       jsonfeatures[feature]['followers_count_list'][j], 
                       jsonfeatures[feature]['hashtags'][j],
                       jsonfeatures[feature]['timeline'][j],
                       False, 
                       jsonfeatures[feature]['ids'][j],
                       jsonfeatures[feature]['tweet_type'][j])
          print(valuesTweet)
          cursor.execute( "insert into FeaturesTweets (ProjectID, Feature, Tweet, DetailedScore, Label, Score, RetweetCount, Followers, Hashtags, CreatedAt, TriggerState, TweetId, TweetType) values (%s,%s,%s,%s,%s,%s,%s,%s,%s, %s, %s,%s, %s)", valuesTweet)
          conn.commit()
          j=j+1
  for i in range(len(projectIds)):
      trigger=triggers[i]
      feature=features[i]
      jsonfeatures[trigger]=ComputingData.extractingDataForTriggers(username,trigger,jsonfeatures)
      k=0
      print("TRiGGERS")
      for tweet in dict(jsonfeatures[trigger]['labeledTweets']).keys():
         valuesTweetTrigger=(projectIds[i], 
                             dict(jsonfeatures[trigger]['labeledTweetsDETAILED']).get(tweet),
                             trigger, 
                             tweet.encode('unicode_escape'), 
                             dict(jsonfeatures[trigger]['labeledTweets']).get(tweet),
                             round(dict(jsonfeatures[trigger]['labeledTweetsDETAILED']).get(tweet),2),
                             jsonfeatures[trigger]['retweet_count_list'][k], 
                             jsonfeatures[trigger]['followers_count_list'][k],
                             jsonfeatures[trigger]['hashtags'][k],
                             jsonfeatures[trigger]['timeline'][k],
                             True,
                             jsonfeatures[trigger]['ids'][k], 
                             jsonfeatures[trigger]['tweet_type'][k])
         print(valuesTweetTrigger)
         cursor.execute( "insert into FeaturesTweets (ProjectID, DetailedScore, Feature, Tweet, Label, Score, RetweetCount, Followers, Hashtags, CreatedAt, TriggerState,TweetId, TweetType) values (%s,%s,%s,%s,%s,%s,%s,%s,%s, %s, %s,%s, %s)", valuesTweetTrigger)
         conn.commit()
         k=k+1;
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
  jsonfeatures['BoardId']=BoardId;
  jsonfeatures=jsonify(jsonfeatures)
  return jsonfeatures

@app.route('/boardStats', methods = ['POST'])
@cross_origin()
def boardStats():
  results={}
  result={}
  features=[]
  projectNames=[]
  triggers=[]
  noProjects=request.json['noProjects']
  boardsId=request.json['boardsId']
  feature1=request.json['feature1']
  trigger1=request.json['trigger1']
  projectName1=request.json['projectName1']
  competitor=request.json['competitor']
  projectIds=[]
  if noProjects >= 1:
   projId1 = request.json['projId1']
   projectIds.append(projId1)
   projectNames.append(projectName1)
   features.append(feature1)
   triggers.append(trigger1)
   if noProjects >= 2:
        projId2 = request.json['projId2']
        feature2=request.json['feature2']
        projectName2=request.json['projectName2']
        trigger2=request.json['trigger2']
        projectIds.append(projId2)
        triggers.append(trigger2)
        features.append(feature2)
        projectNames.append(projectName2)
        if noProjects==3:
            projId3 = request.json['projId3']
            feature3=request.json['feature3']
            trigger3=request.json['trigger3']
            projectName3=request.json['projectName3']
            triggers.append(trigger3)
            features.append(feature3)
            projectIds.append(projId3)
            projectNames.append(projectName3)
  conn = mysql.connect
  cursor = conn.cursor()
  featuresInfo={}
  triggersInfo=[]
  i=0
  for projectId in projectIds:
    values=(projectId, features[i])
    cursor.execute( "SELECT * FROM FeaturesTweets WHERE ProjectId LIKE %s and feature like %s",values)
    conn.commit()
    data = list(cursor.fetchall())
    featuresInfo[projectId]=data
    tweetScore={}
    polarityVals=[]
    featureTweets=[]
    countPoz=0
    tweetType=[]
    countNeg=0
    retweetCount={}
    mostRetweetedTweetFeature=0
    maxRet=0
    timelineCount=[]
    # cursor.execute("SELECT boards.competitor FROM boards as br INNER join projects as projs on projects.boardid=boards.boardid where projs.projectid like %s",[projectId])
    # conn.commit()
    # boardCompetitor = list(cursor.fetchall())
    # print("*********")
    # print(boardCompetitor[0][0])
    # print("********")
    # print(boardCompetitor)
    for tweet in featuresInfo[projectId]:
      print("&&&&&&")
      print(tweet)
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
      # date_time_obj = datetime.strptime(tweet[8], '%Y-%m-%d %H:%M:%S')
      # timeline.append(date_time_obj)
      print("-----MAX RET----")
      print(maxRet)
    allTweets=ComputingData.createTweetsList(featureTweets)
    wordlist=allTweets.split()
    rt_paired_freq=ComputingData.pairRetCountWithWords(wordlist, retweetCount)
    word_pairings = ComputingData.pairingWordsWithRetCountAndPolarity(tweetScore,rt_paired_freq)
    
    result[features[i]]={
       'polarityVals':polarityVals,
        'projectName':projectNames[i],
       'countPoz':countPoz,
       'tweetType':tweetType,
        'countNeg':countNeg,
      'word_pairings':word_pairings,
      'rt_paired_freq':rt_paired_freq, 
      'word_sentiment_positive':word_pairings['word_sentiment_positive'],
      "word_sentiment_negative":word_pairings['word_sentiment_negative'],
      "polarity":word_pairings['added_polarity'],
      "bubble_chart_data":word_pairings['bubble_chart_data'],
      "mostRetweetedTweetFeature":str(mostRetweetedTweetFeature),
    }
    i=i+1
  print("&&&&&&&&&&&  resuts &&&&&&&&&&&&&&&&&&&")
  print(results)
  i=0
  for projectId in projectIds:
    values=(projectId, triggers[i])
    print("***")
    print(values)
    cursor.execute( "SELECT * FROM FeaturesTweets WHERE ProjectId LIKE %s and feature like %s",values)
    conn.commit()
    data2 = list(cursor.fetchall())
    triggersInfo=data2
    triggerTweets=[]
    timeline=[]
    averageTriggerPolarity=0
    mostPopularUserTrigger=0
    hashtagsTrigger=''
    allFollowersTrigger=0
    triggerData=[]
    maxFollowers=0
    for tweet in triggersInfo:
          print(tweet)
          triggerTweets.append(tweet[2])
          allFollowersTrigger+=tweet[6]
          timeline.append(tweet[8])
          if tweet[7]!='NaN':
           hashtagsTrigger=hashtagsTrigger+' '+tweet[7]
          averageTriggerPolarity=averageTriggerPolarity+tweet[11]
          if(maxFollowers<tweet[6]):
            mostPopularUserTrigger=tweet[12]
            maxFollowers=tweet[6]
          print("-----MAX RET----")
          print(maxFollowers)
    print("TIMELINE TRIGGER")
    print(timeline)
    dataframe_Timeline_trigger=pd.DataFrame(timeline, columns=['date'])
    dataframe_Timeline_trigger['date']= pd.to_datetime(dataframe_Timeline_trigger['date'])
    dataframe_Timeline_trigger['day/month/year/hh'] = dataframe_Timeline_trigger['date'].apply(lambda x: "%d-%d-%d %d" % (x.month, x.day, x.year, x.hour))
    dataframe_Timeline_trigger= dataframe_Timeline_trigger.groupby(['day/month/year/hh']).size().to_frame('count').reset_index()
    timelineCount=dataframe_Timeline_trigger.to_numpy()
    timelineCount=timelineCount.tolist()
    print('PRINTING AVERAGE POALRITY')
    print(averageTriggerPolarity)
    averageTriggerPolarity=averageTriggerPolarity/len(triggerTweets)*100;
    print(averageTriggerPolarity)
    result[triggers[i]]={
        'projectName':projectNames[i],
        'averageTriggerPolarity':averageTriggerPolarity,
        'hashtagsTrigger':hashtagsTrigger,
        'timeline':timelineCount,
        'allFollowersTrigger':allFollowersTrigger,
        'mostPopularUserTrigger':str(mostPopularUserTrigger)
        
    }
    i=i+1
  competitorInfo=[]
  values=[competitor]
  print("VALUES !!!")
  print(values)
  cursor.execute( "SELECT * FROM FeaturesTweets WHERE feature like %s",values)
  conn.commit()
  data3=list(cursor.fetchall())
  competitorInfo=data3
  print(competitorInfo)
  createdAtCompetitor=[]
  countPozCompetitor=0;
  countNegCompetitor=0;
  retweetCountCompetitor={}
  polarityValsCompetitor=[]
  timelineCompetitor=[]
  timelineCountCompetitor=[]
  competitorTweets=[]
  competitorScore={}
  for tweet in competitorInfo:
   competitorTweets.append(tweet[2])
   competitorScore[tweet[2]]=tweet[11]
   createdAtCompetitor.append(tweet[8])
   if tweet[4]==0:
      countPozCompetitor+=1
   if tweet[4]==1:
      countNegCompetitor+=1
   retweetCountCompetitor[tweet[2]]=tweet[5]
     # date_time_obj = datetime.strptime(tweet[8], '%Y-%m-%d %H:%M:%S')
  # timelineCompetitor.append(date_time_obj)
  # polarityValsCompetitor.append([tweet[2], tweet[11]])
  print("---------------------TIMELINE COMPETITOR-----------------------")
  print(createdAtCompetitor)
  dataframe_Timeline_competitor=pd.DataFrame(createdAtCompetitor, columns=['date'])
  dataframe_Timeline_competitor['date']= pd.to_datetime(dataframe_Timeline_competitor['date'])
  dataframe_Timeline_competitor['day/month/year/hh'] = dataframe_Timeline_competitor['date'].apply(lambda x: "%d-%d-%d %d" % (x.month, x.day, x.year, x.hour))
  dataframe_Timeline_competitor= dataframe_Timeline_competitor.groupby(['day/month/year/hh']).size().to_frame('count').reset_index()  
  timelineCountCompetitor=dataframe_Timeline_competitor.to_numpy()
  timelineCountCompetitor=timelineCountCompetitor.tolist()
  allCompetitorTweets=ComputingData.createTweetsList(competitorTweets)
  wordlistCompetitor=allCompetitorTweets.split()
  print("********&&&&&&&&&&&*********")
  print(retweetCountCompetitor)
  rt_paired_freq_Competitor=ComputingData.pairRetCountWithWords(wordlistCompetitor, retweetCountCompetitor)
  word_pairings_competitor = ComputingData.pairingWordsWithRetCountAndPolarity(competitorScore,rt_paired_freq_Competitor)
  result[competitor]={
        'countPozCompetitor':countPozCompetitor,
        'countNegCompetitor':countNegCompetitor,
       "timelineCountCompetitor": timelineCountCompetitor,
       "word_pairings_Competitor_Pos":word_pairings_competitor['word_sentiment_positive'],
       "word_pairings_Competitor_Neg":word_pairings_competitor['word_sentiment_negative']
    }
  for i in range(len(projectIds)):
    results[projectIds[i]]={features[i]:result[features[i]],
                            triggers[i]:result[triggers[i]],
                            competitor:result[competitor]}
  print(results)
  return jsonify({"body": results}), 200

l = StdOutListener()
if __name__ == '__main__':
    socketio.run(app, debug=True, host='127.0.0.1')