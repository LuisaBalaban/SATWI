from flask import Flask, jsonify, render_template
from threading import Thread
from flask import request
from API import APIcall
from datetime import datetime
from flask import jsonify
from API import Preprocess
from API import SA 
from API import ComputingData
import json
from API import Connect
import random
from flask_cors import CORS, cross_origin
from flask_mysqldb import MySQL
import pandas as pd
import sys

thread = None
SatwiEmail=Connect.SatwiEmail
SatwiPassword=Connect.SatwiPassword
app = Flask(__name__, template_folder="components")
app.config['CORS_HEADERS'] = 'Content-Type'
cors = CORS(app)
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] =  'pass'
app.config['MYSQL_DB'] = 'satwidb'
mysql=MySQL(app)
from flask_mail import Mail, Message

app.debug = True
   
@app.route('/result', methods = ['POST'])
@cross_origin()
def result():
  keyword = request.json['keyword']
  newSet=APIcall.creatingTestSet(keyword)
  preprocessedSearchedTweets=Preprocess.processTweets(newSet)
  # print(preprocessedSearchedTweets)
  labeledTweets=SA.loadModel(preprocessedSearchedTweets)
  # print(type(labeledTweets))
  labeledTweets=jsonify(labeledTweets)
  return labeledTweets

@app.route('/profileBoard', methods = ['POST'])
@cross_origin()
def profileBoard():
  conn = mysql.connect
  cursor = conn.cursor()
  profile = request.json['profile']
  providedUserId=profile['googleId']
  # name=profile['name']
  # email=profile['email']
  # firstName=profile['givenName']
  # lastName=profile['familyName']
  cursor.execute("SELECT Name, Email from USERS WHERE ProvidedUserId LIKE %s", [providedUserId])
  conn.commit()
  data = list(cursor.fetchall())
  # print(data)
  headers = {
    "Content-Type": "application/octet-stream",
    "Content-Disposition": "attachment; filename=foobar.json"}
  if data:
     cursor.execute("SELECT BoardId, TwitterHandle, Competitor, Timelineid from Boards WHERE ProvidedUserId LIKE %s", [providedUserId])
     conn.commit()
     data1 = list(cursor.fetchall())
    #  print(data1)
     cursor.execute("SELECT ProjectName, Feature, TriggerFeature, Date, ProjectId from Projects WHERE BoardId LIKE %s", [data1[0][0]])
     conn.commit()
     data2 = list(cursor.fetchall())
     result={
       "name":data[0][0],
       "email":data[0][1],
       "boardId":data1[0][0],
       "timelineId":data1[0][3],
       "twitterHandle":data1[0][1],
       "competitor":data1[0][2],
       "projects":data2
     }
     return jsonify({"body": result}), 200, headers
  else:
     return  jsonify({"msg": "no user with that id in database"}), 404 


@app.route('/register', methods = ['POST'])
@cross_origin()
def register():
  conn = mysql.connect
  cursor = conn.cursor()
  profile=request.json['profile']
  print(profile)
  userName=profile['name']
  firstName=profile['givenName']
  lastName=profile['familyName']
  email=profile['email']
  googleId=profile['googleId']
  phone=request.json["phone"]
  profile=profile['imageUrl']
  valuesUser=(googleId, email, userName, phone, profile,firstName,lastName)
  cursor.execute( "INSERT INTO Users (ProvidedUserId, Email, Username, Phone, profilePic, firstname, lastname) VALUES  (%s,%s,%s,%s,%s,%s,%s)", valuesUser)
  conn.commit()
  featuresInfo=[]
  featuresInfo.append(userName)
  featuresInfo.append(googleId)
  featuresInfo.append(email)
  return jsonify({"body": featuresInfo}), 200
  
  

@app.route('/userInfo', methods = ['POST'])
@cross_origin()
def getUserInfo():
  project={}
  userInfo={}
  data=[]
  data1=[]
  data2=[]
  conn = mysql.connect
  cursor = conn.cursor()
  ProvidedUserId=request.json['userId']
  # print(ProvidedUserId)
  cursor.execute( "select Username,phone,email,name,createdat, profilepic from users where ProvidedUserId like %s", [ProvidedUserId])
  conn.commit()
  data = list(cursor.fetchall())
  print(data)
  cursor.execute( "select noprojects, ReceiveRecommendations, ReceiveEmails, ReceiveMonthlyReport, competitor, boardId,TwitterHandle from boards where ProvidedUserId like %s", [ProvidedUserId])
  conn.commit()
  data1=list(cursor.fetchall())
  print(data1)
  boardId=data1[0][5]
  noProjects=data1[0][0]
  cursor.execute( "select projectId, projectname, feature, triggerfeature from  projects where boardId like %s", [boardId])
  conn.commit()
  data2=list(cursor.fetchall())
  print(data2)
  for i in range(noProjects):
    project[i]=[data2[i][0], data2[i][1], data2[i][2], data2[i][3]]
  userInfo={
    "username":data[0][0],
    "phone":data[0][1],
    "email":data[0][2],
    "name":data[0][3],
    "createdAt":data[0][4],
    "profilePic":data[0][5],
    "ReceiveRecommendations":data1[0][0],
    "ReceiveEmails":data1[0][1],
    "ReceiveMonthlyReport":data1[0][2],
    "competitor":data1[0][4],
    "boardid":data1[0][5],
    "TwitterHandle":data1[0][6],
    "projects":project
  }
  print(userInfo)
  return jsonify({"body": userInfo}), 200

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
  twitterHandle=request.json['username']
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
  # print(features)
  # print(dates)
  # print(triggers)
  i=0
  BoardId=random.getrandbits(28)
  timelineId=random.getrandbits(28)
  valuesUserBoard=(timelineId,BoardId, ProvidedUserId, competitor, username, ReceiveRecommendations, ReceiveEmails, ReceiveMonthlyReport, len(features))
  cursor1.execute( "INSERT INTO Boards (timelineId, BoardId, ProvidedUserId, Competitor, TwitterHandle, ReceiveRecommendations,ReceiveEmails,ReceiveMonthlyReport,  noprojects) VALUES  (%s,%s,%s,%s,%s,%s,%s,%s, %s)", valuesUserBoard)
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
          # print(valuesTweet)
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
        #  print(valuesTweetTrigger)
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
  jsonfeatures['timelineId']=timelineId  
  if twitterHandle:
    jsonfeatures[twitterHandle]=ComputingData.extractingDataForFeatures(username,'',dates[i],jsonfeatures)
    x=0
    for tweet in dict(jsonfeatures[twitterHandle]['labeledTweets']).keys():
        valuestwitterHandle=(projectIds[0], 
                       twitterHandle, 
                       tweet.encode('unicode_escape'), 
                       dict(jsonfeatures[twitterHandle]['labeledTweetsDETAILED']).get(tweet), 
                       dict(jsonfeatures[twitterHandle]['labeledTweets']).get(tweet),
                       round(dict(jsonfeatures[twitterHandle]['labeledTweetsDETAILED']).get(tweet),2),
                       jsonfeatures[twitterHandle]['retweet_count_list'][x],
                       jsonfeatures[twitterHandle]['followers_count_list'][x], 
                       jsonfeatures[twitterHandle]['hashtags'][x],
                       jsonfeatures[twitterHandle]['timeline'][x],
                       False, 
                       jsonfeatures[twitterHandle]['ids'][x],
                       jsonfeatures[twitterHandle]['tweet_type'][x],
                       jsonfeatures[twitterHandle]['users'][x])
        cursor.execute( "insert into FeaturesTweets (ProjectID, Feature, Tweet, DetailedScore, Label, Score, RetweetCount, Followers, Hashtags, CreatedAt, triggerState, TweetId,TweetType,User) values (%s,%s,%s,%s,%s,%s,%s, %s,%s,%s,%s,%s,%s,%s)", valuestwitterHandle)
        conn.commit()
        x=x+1

  jsonfeatures=jsonify(jsonfeatures)
  return jsonfeatures



@app.route('/boardStats', methods = ['POST'])
@cross_origin()
def boardStats():
  print("PRINTING REQUEST BODY")
  print(request.json)
  results={}
  result={}
  features=[]
  projectNames=[]
  triggers=[]
  twitterHandle=request.json['username']
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
    for tweet in featuresInfo[projectId]:
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
  i=0
  for projectId in projectIds:
    values=(projectId, triggers[i])
    cursor.execute( "SELECT * FROM FeaturesTweets WHERE ProjectId LIKE %s and feature like %s",values)
    conn.commit()
    data2 = list(cursor.fetchall())
    triggersInfo=data2
    triggerTweets=[]
    timeline=[]
    averageTriggerPolarity=0
    mostPopularUserTrigger=0
    hashtagsTrigger=[]
    allFollowersTrigger=0
    maxFollowers=0
    for tweet in triggersInfo:
          triggerTweets.append(tweet[2])
          allFollowersTrigger+=tweet[6]
          timeline.append(tweet[8])
          print(tweet[7])
          if tweet[7]!="NULL":
            if tweet[7]!="NaN":
             hashtagsTrigger.append(" "+tweet[7]+ ", ")
          averageTriggerPolarity=averageTriggerPolarity+tweet[11]
          if(maxFollowers<tweet[6]):
            mostPopularUserTrigger=tweet[12]
            maxFollowers=tweet[6]
    dataframe_Timeline_trigger=pd.DataFrame(timeline, columns=['date'])
    dataframe_Timeline_trigger['date']= pd.to_datetime(dataframe_Timeline_trigger['date'])
    dataframe_Timeline_trigger['day/month/year/hh'] = dataframe_Timeline_trigger['date'].apply(lambda x: "%d-%d-%d %d" % (x.month, x.day, x.year, x.hour))
    dataframe_Timeline_trigger= dataframe_Timeline_trigger.groupby(['day/month/year/hh']).size().to_frame('count').reset_index()
    timelineCount=dataframe_Timeline_trigger.to_numpy()
    timelineCount=timelineCount.tolist()
    averageTriggerPolarity=averageTriggerPolarity/len(triggerTweets)*100;
    print("HASHTAGS")
    print(hashtagsTrigger)
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
  cursor.execute( "SELECT * FROM FeaturesTweets WHERE feature like %s",values)
  conn.commit()
  data3=list(cursor.fetchall())
  competitorInfo=data3
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
  dataframe_Timeline_competitor=pd.DataFrame(createdAtCompetitor, columns=['date'])
  dataframe_Timeline_competitor['date']= pd.to_datetime(dataframe_Timeline_competitor['date'])
  dataframe_Timeline_competitor['day/month/year/hh'] = dataframe_Timeline_competitor['date'].apply(lambda x: "%d-%d-%d %d" % (x.month, x.day, x.year, x.hour))
  dataframe_Timeline_competitor= dataframe_Timeline_competitor.groupby(['day/month/year/hh']).size().to_frame('count').reset_index()  
  timelineCountCompetitor=dataframe_Timeline_competitor.to_numpy()
  timelineCountCompetitor=timelineCountCompetitor.tolist()
  allCompetitorTweets=ComputingData.createTweetsList(competitorTweets)
  wordlistCompetitor=allCompetitorTweets.split()
  rt_paired_freq_Competitor=ComputingData.pairRetCountWithWords(wordlistCompetitor, retweetCountCompetitor)
  word_pairings_competitor = ComputingData.pairingWordsWithRetCountAndPolarity(competitorScore,rt_paired_freq_Competitor)
  result[competitor]={
        'countPozCompetitor':countPozCompetitor,
        'countNegCompetitor':countNegCompetitor,
       "timelineCountCompetitor": timelineCountCompetitor,
       "word_pairings_Competitor_Pos":word_pairings_competitor['word_sentiment_positive'],
       "word_pairings_Competitor_Neg":word_pairings_competitor['word_sentiment_negative']
    }
  countPozAcc=0
  countNegAcc=0
  if twitterHandle:
    cursor.execute("select * from featurestweets where feature like %s", [twitterHandle])
    conn.commit()
    data5=list(cursor.fetchall())
    accountTweets=data5
    followerPerAccount={}
    negativeTweets={}
    mostFollwedAccounts=[]
    hashtagsListAccount=[]
    mostNegativeTweets=[]
    for tweet in accountTweets:
      if tweet[4]==0:
       countPozAcc+=1
      if tweet[4]==1:
       countNegAcc+=1
       negativeTweets[str(tweet[12])]=tweet[11]
      if tweet[14]:
       followerPerAccount[tweet[14]]=tweet[6]
      print(tweet[7])
      if tweet[7]!='NaN':
        if tweet[7]!='NULL':
          if tweet[7]!="b''":
            hashtagsListAccount.append(tweet[7])
    print(followerPerAccount)
    mostFollwedAccounts = sorted(followerPerAccount, key=followerPerAccount.get, reverse=True)[:5]
    mostNegativeTweets = sorted(negativeTweets, key=negativeTweets.get, reverse=True)[:5]
    result[twitterHandle]={
      'mostFollwedAccounts':mostFollwedAccounts,
      'followerPerAccount':followerPerAccount,
      'hashtagsListAccount':hashtagsListAccount,
      'negativeTweets':negativeTweets,
      'mostNegativeTweets':mostNegativeTweets,
      'countPozAcc':countPozAcc,
      'countNegAcc':countNegAcc
    }
  for i in range(len(projectIds)):
    results[projectIds[i]]={features[i]:result[features[i]],
                            triggers[i]:result[triggers[i]],
                            competitor:result[competitor],
                            twitterHandle:result[twitterHandle]}
  return jsonify({"body": results}), 200



@app.route('/modifyProject', methods = ['POST'])
@cross_origin()
def modifyProject():
  jsonfeatures={}
  conn = mysql.connect
  cursor = conn.cursor()
  userId=request.json['userId']
  projectid=request.json['projId1']
  projectName1=request.json['projectName1']
  feature1=request.json['feature1']
  trigger1=request.json['trigger1']
  TwitterHandle=request.json['TwitterHandle']
  cursor.execute( "SELECT projectname, feature, triggerfeature FROM projects WHERE ProjectId LIKE %s",[projectid])
  conn.commit()
  data = list(cursor.fetchall())
  if data[0][0]!=projectName1:
    values1=(projectName1, projectid)
    cursor.execute("UPDATE projects SET projectname = %s WHERE projectid = %s",values1)
    conn.commit()
  print(data[0][1])
  print(feature1)
  if data[0][1]!=feature1:
    values2=(feature1, projectid)
    cursor.execute("UPDATE projects SET feature = %s WHERE projectid = %s",values2)
    conn.commit()
    values3=(projectid,feature1)
    cursor.execute( "delete from featurestweets WHERE ProjectId LIKE %s and feature like %s",values3)
    conn.commit()
    jsonfeatures[feature1]=ComputingData.extractingDataForFeatures(TwitterHandle,feature1," ",jsonfeatures)
    j=0
    for tweet in dict(jsonfeatures[feature1]['labeledTweets']).keys():
          valuesTweet=(projectid, 
                       feature1, 
                       tweet.encode('unicode_escape'), 
                       dict(jsonfeatures[feature1]['labeledTweetsDETAILED']).get(tweet), 
                       dict(jsonfeatures[feature1]['labeledTweets']).get(tweet),
                       round(dict(jsonfeatures[feature1]['labeledTweetsDETAILED']).get(tweet),2),
                       jsonfeatures[feature1]['retweet_count_list'][j],
                       jsonfeatures[feature1]['followers_count_list'][j], 
                       jsonfeatures[feature1]['hashtags'][j],
                       jsonfeatures[feature1]['timeline'][j],
                       False, 
                       jsonfeatures[feature1]['ids'][j],
                       jsonfeatures[feature1]['tweet_type'][j])
          cursor.execute( "insert into FeaturesTweets (ProjectID, Feature, Tweet, DetailedScore, Label, Score, RetweetCount, Followers, Hashtags, CreatedAt, TriggerState, TweetId, TweetType) values (%s,%s,%s,%s,%s,%s,%s,%s,%s, %s, %s,%s, %s)", valuesTweet)
          conn.commit()
          j=j+1
  print("PRINTING TRIGGER")
  print(data[0][2])
  print(trigger1)
  if data[0][2]!=trigger1:  
     values4=(trigger1, projectid)
     cursor.execute("UPDATE projects SET triggerfeature = %s WHERE projectid = %s",values4)
     conn.commit()
     values5=(projectid,trigger1)
     cursor.execute( "delete from featurestweets WHERE ProjectId LIKE %s and feature like %s",values5)
     conn.commit()
     jsonfeatures[trigger1]=ComputingData.extractingDataForTriggers(TwitterHandle,trigger1,jsonfeatures)
     k=0
     for tweet in dict(jsonfeatures[trigger1]['labeledTweets']).keys():
         valuesTweetTrigger=(projectid, 
                             dict(jsonfeatures[trigger1]['labeledTweetsDETAILED']).get(tweet),
                             trigger1, 
                             tweet.encode('unicode_escape'), 
                             dict(jsonfeatures[trigger1]['labeledTweets']).get(tweet),
                             round(dict(jsonfeatures[trigger1]['labeledTweetsDETAILED']).get(tweet),2),
                             jsonfeatures[trigger1]['retweet_count_list'][k], 
                             jsonfeatures[trigger1]['followers_count_list'][k],
                             jsonfeatures[trigger1]['hashtags'][k],
                             jsonfeatures[trigger1]['timeline'][k],
                             True,
                             jsonfeatures[trigger1]['ids'][k], 
                             jsonfeatures[trigger1]['tweet_type'][k])
         cursor.execute( "insert into FeaturesTweets (ProjectID, DetailedScore, Feature, Tweet, Label, Score, RetweetCount, Followers, Hashtags, CreatedAt, TriggerState,TweetId, TweetType) values (%s,%s,%s,%s,%s,%s,%s,%s,%s, %s, %s,%s, %s)", valuesTweetTrigger)
         conn.commit()
         k=k+1;    
  return jsonify({"body": jsonfeatures}), 200

@app.route('/modifyCompetitor', methods = ['POST'])
@cross_origin()
def modifyCompetitor():
  jsonfeatures={}
  competitor=request.json['competitor']
  projId=request.json['projId']
  boardId=request.json['boardId']
  conn = mysql.connect
  cursor = conn.cursor()
  cursor.execute("Select competitor from boards where boardid like %s", [boardId])
  conn.commit()
  data = list(cursor.fetchall())
  if data[0][0]!=competitor:
    values=(competitor, boardId)
    cursor.execute("UPDATE boards SET competitor = %s WHERE boardid = %s",values)
    conn.commit()
    values1=(projId,competitor)
    cursor.execute( "delete from featurestweets WHERE projectId LIKE %s and feature like %s",values1)
    conn.commit()
    set3=APIcall.creatingTestSet(competitor)
    preprocessedSearchedTweets3=Preprocess.processTweets(set3)
    labeledTweets3=SA.loadModel(preprocessedSearchedTweets3)
    jsonfeatures[competitor]=labeledTweets3
    m=0
    for tweet in dict(jsonfeatures[competitor]['labeledTweets'][0]).keys():
        valuesCompetitor=(projId, dict(jsonfeatures[competitor]['labeledTweetsDETAILED']).get(tweet), competitor, tweet.encode('unicode_escape'), dict(jsonfeatures[competitor]['labeledTweets'][0]).get(tweet),jsonfeatures[competitor]['scores'][m],jsonfeatures[competitor]['timeline'][0][m],jsonfeatures[competitor]['retweet_count_list'][m])
        cursor.execute( "insert into FeaturesTweets (ProjectID, DetailedScore, Feature, Tweet, Label, Score, CreatedAt, RetweetCount) values (%s,%s,%s,%s,%s,%s,%s, %s)", valuesCompetitor)
        conn.commit()
        m=m+1
  return jsonify({"body": jsonfeatures}), 200

@app.route('/addTimeline', methods = ['POST'])
@cross_origin()
def addTimeline():
  conn = mysql.connect
  cursor = conn.cursor()
  Timestamp=request.json['date']
  countNeg=request.json['countNeg']
  countPoz=request.json['countPoz']
  timelineId=request.json['timelineId']
  values=(countPoz, countNeg, timelineId)
  cursor.execute( "insert into Timeline (countPositive, countNegative,timelineid) values (%s,%s,%s)", values)
  conn.commit()
  cursor.execute("Select Timestamp, countNegative, countPositive from timeline where timelineid like %s", [timelineId])
  conn.commit()
  data = list(cursor.fetchall())
  print(data)
  return jsonify({"body": data}), 200

# app.config['EXPLAIN_TEMPLATE_LOADING'] = True
  
@app.route('/sendWelcomeEmail', methods = ['POST'])
@cross_origin()
def sendWelcomeEmail():
  print("SENDING EMAIL")
  print(request.json)
  username=request.json['name']
  twitterHandle=request.json['twitterHandle']
  email=request.json['email']
  print(email)
  phone=request.json['phone']
  app.config.update(
	DEBUG=True,
	MAIL_SERVER='smtp.gmail.com',
	MAIL_PORT=465,
	MAIL_USE_SSL=True,
	MAIL_USERNAME = SatwiEmail,
	MAIL_PASSWORD = SatwiPassword
	)
  mail = Mail(app)
  try:
    msg = Message("Welcome to SATWI!",
	  sender=SatwiEmail,
	  recipients=[email])
    msg.body = username+"thank you for choosing SATWI!\nThis e-mail has been associated with a SATWI account.Here are your account details:\n Name: " +username+" Phone number: "+phone;
    msg.html =render_template("welcome-message.html", twitterHandle=twitterHandle, username=username, phone=phone)
    mail.send(msg)
    return 'Mail sent!'
  except Exception:
     print("Unexpected error:", sys.exc_info()[0])
     return 'error'