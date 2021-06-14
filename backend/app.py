from flask import Flask, jsonify, render_template
import json 
import time
from threading import Thread
from flask_socketio import SocketIO, emit, join_room, leave_room, \
    close_room, rooms, disconnect
from flask import request
import environ
from API import APIcall
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
thread = None
app = Flask(__name__, template_folder="components")
app.config['CORS_HEADERS'] = 'Content-Type'
cors = CORS(app)
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

# @app.route('/board2', methods = ['POST'])
# @cross_origin()
# def brand():
#   features=[]
#   triggers=[]
#   dates=[]
#   noProjects=request.json['noProjects']
#   if noProjects >= 1:
#    feature1 = request.json['feature1']
#    trigger1 = request.json['trigger1']
#    date1 = request.json['date1']
#    date1 = request.json['date1']
#    features.append(feature1)
#    triggers.append(trigger1)
#    dates=[date1]
#    if noProjects >= 2:
#     feature2 = request.json['feature2']
#     trigger2 = request.json['trigger2']
#     date2 = request.json['date2']
#     features.append(feature2)
#     triggers.append(trigger2)
#     dates.append(date2)
#     if noProjects==3:
#       feature3=request.json['feature3']
#       trigger3=request.json['trigger3']
#       date3 = request.json['date3']
#       features.append(feature3)
#       triggers.append(trigger3)
#       dates.append(date3)
#   username = request.json['username']
#   competitor=request.json['competitor']
#   print(features)
#   print(dates)
#   print(triggers)
#   jsonfeatures={}
#   i=0
#   for feature in features:
#     query1=feature+' '+username+' since:'+dates[i]
#     print(query1)
#     set1=APIcall.creatingTestSet(query1)
#     preprocessedSearchedTweets1=Preprocess.processTweets(set1)
#     labeledTweets1=SA.loadModel(preprocessedSearchedTweets1)
#     jsonfeatures[feature]=labeledTweets1
#     print(jsonfeatures[feature])
#     i=i+1;
#   for trigger in triggers:
#     query2=trigger+' '+username
#     set2=APIcallBrand.creatingTestSet(query2)
#     preprocessedSearchedTweets2=Preprocess.processTweets(set2)
#     labeledTweets2=SAtriggers.loadModel(preprocessedSearchedTweets2)
#     jsonfeatures[trigger]=labeledTweets2
#     print(jsonfeatures[trigger])
#   set3=APIcall.creatingTestSet(competitor)
#   preprocessedSearchedTweets3=Preprocess.processTweets(set3)
#   labeledTweets3=SA.loadModel(preprocessedSearchedTweets3)
#   jsonfeatures[competitor]=labeledTweets3
#   print(type(jsonfeatures))
#   jsonfeatures=jsonify(jsonfeatures)
#   # print(type(jsonfeatures))
#   return jsonfeatures

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
 #   import MySQLdb

#   db = MySQLdb.connect(host=host, user=user, passwd=passwd, db=dbname)
#   cursor2 = db.cursor()
#   cursor2.execute("ALTER DATABASE `%s` CHARACTER SET 'utf8' COLLATE 'utf8_unicode_ci'" % dbname)
#   sql = "SELECT DISTINCT(table_name) FROM information_schema.columns WHERE table_schema = '%s'" % dbname
#   cursor2.execute(sql)
#   results = cursor2.fetchall()
#   for row in results:
#     sql = "ALTER TABLE `%s` convert to character set DEFAULT COLLATE DEFAULT" % (row[0])
#     cursor2.execute(sql)
#   db.commit()
#   db.close()
  conn = mysql.connect
  cursor = conn.cursor()
  for feature in features:
     valuesProject=(BoardId, projectIds[i], projectNames[i] ,feature, triggers[i], dates[i])
     cursor.execute( "INSERT INTO Projects (BoardId, ProjectId, ProjectName, Feature, TriggerFeature, Date) VALUES  (%s,%s,%s,%s,%s,%s)", valuesProject)
     conn.commit()
     jsonfeatures[feature]=ComputingData.extractingDataForFeatures(username,feature,dates[i],jsonfeatures)
     for tweet in dict(jsonfeatures[feature]['labeledTweets']).keys():
         valuesTweet=(projectIds[i], feature, tweet.encode('unicode_escape'), dict(jsonfeatures[feature]['labeledTweetsDETAILED']).get(tweet), dict(jsonfeatures[feature]['labeledTweets']).get(tweet),dict(jsonfeatures[feature]['results']).get(tweet),APIcallDB.retweet_count_list[i], APIcallDB.followers_count_list[i],APIcallDB.hashtags_count_list[i],APIcallDB.created_at[i], False)
         cursor.execute( "insert into FeaturesTweets (ProjectID, Feature, Tweet, DetailedScore, Label, Score, RetweetCount, Followers, Hashtags, CreatedAt, TriggerState) values (%s,%s,%s,%s,%s,%s,%s,%s,%s, %s, %s)", valuesTweet)
         conn.commit()
     i=i+1
  for trigger in triggers:
     jsonfeatures[trigger]=ComputingData.extractingDataForTriggers(username,trigger,jsonfeatures)
     i=0;
     j=0
     for tweet in jsonfeatures[trigger]['labeledTweets'][0].keys():
         valuesTweet=(projectIds[i], dict(jsonfeatures[trigger]['labeledTweetsDETAILED']).get(tweet), feature, tweet.encode('unicode_escape'), dict(jsonfeatures[trigger]['labeledTweets'][0]).get(tweet),dict(jsonfeatures[trigger]['results'][0]).get(tweet),APIcallDB.retweet_count_list[i], APIcallDB.followers_count_list[i],APIcallDB.hashtags_count_list[i],APIcallDB.created_at[i], True)
         cursor.execute( "insert into FeaturesTweets (ProjectID, DetailedScore, Feature, Tweet, Label, Score, RetweetCount, Followers, Hashtags, CreatedAt, TriggerState) values (%s,%s,%s,%s,%s,%s,%s,%s,%s, %s, %s)", valuesTweet)
         conn.commit()
         j=j+1
     i=i+1
  if competitor:
    set3=APIcall.creatingTestSet(competitor)
    preprocessedSearchedTweets3=Preprocess.processTweets(set3)
    labeledTweets3=SA.loadModel(preprocessedSearchedTweets3)
    jsonfeatures[competitor]=labeledTweets3
  jsonfeatures['ids']=projectIds;
  jsonfeatures=jsonify(jsonfeatures)
  return jsonfeatures

@app.route('/boardStats', methods = ['POST'])
@cross_origin()
def boardStats():
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
   print(data)
   info[projectId]=data
  # length = len(info)
   triggerTweets=[]
   featureTweets=[]
   polarityVals=[]
   countPoz=0;
   countPozTrigger=0;
   countNegTrigger=0;
   countNeg=0;
   for tweet in info[projectId]:
     print("&&&&&&&&&&&&&&&")
     print(tweet)
     if tweet[10]==1:
       triggerTweets.append(tweet)
       if tweet[4]==0:
         countPozTrigger+=1
       else:
         countNegTrigger+=1;
       polarityVals.append([tweet[2], tweet[11]])
     else:
       featureTweets.append(tweet)
       if tweet[4]==0:
         countPoz+=1
       else:
         countNeg+=1;
       polarityVals.append([tweet[2], tweet[11]])
  print(polarityVals)
  print(info)
  return jsonify({"body": info}), 200

l = StdOutListener()
if __name__ == '__main__':
    socketio.run(app, debug=True, host='127.0.0.1')