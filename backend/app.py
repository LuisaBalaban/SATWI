from flask import Flask, jsonify, render_template
from flask import request
from API import APIcall
from flask import jsonify
import csv
from API import Preprocess
from API import APIcallBrand
from API import SA 
from API import SAtriggers
import json
from flask_cors import CORS, cross_origin
app = Flask(__name__, template_folder="components")

app.config['CORS_HEADERS'] = 'Content-Type'
cors = CORS(app)

  
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
@app.route('/board', methods = ['POST'])
@cross_origin()
def brand():
  features=[]
  triggers=[]
  dates=[]
  noProjects=request.json['noProjects']
  if noProjects >= 1:
   feature1 = request.json['feature1']
   trigger1 = request.json['trigger1']
   date1 = request.json['date1']
   date1 = request.json['date1']
   features.append(feature1)
   triggers.append(trigger1)
   dates=[date1]
   if noProjects >= 2:
    feature2 = request.json['feature2']
    trigger2 = request.json['trigger2']
    date2 = request.json['date2']
    features.append(feature2)
    triggers.append(trigger2)
    dates.append(date2)
    if noProjects==3:
      feature3=request.json['feature3']
      trigger3=request.json['trigger3']
      date3 = request.json['date3']
      features.append(feature3)
      triggers.append(trigger3)
      dates.append(date3)
  username = request.json['username']
  competitor=request.json['competitor']
  print(features)
  print(dates)
  print(triggers)
  jsonfeatures={}
  i=0
  for feature in features:
    query1=feature+' '+username+' since:'+dates[i]
    print(query1)
    set1=APIcall.creatingTestSet(query1)
    preprocessedSearchedTweets1=Preprocess.processTweets(set1)
    labeledTweets1=SA.loadModel(preprocessedSearchedTweets1)
    jsonfeatures[feature]=labeledTweets1
    print(jsonfeatures[feature])
    i=i+1;
  for trigger in triggers:
    query2=trigger+' '+username
    set2=APIcallBrand.creatingTestSet(query2)
    preprocessedSearchedTweets2=Preprocess.processTweets(set2)
    labeledTweets2=SAtriggers.loadModel(preprocessedSearchedTweets2)
    jsonfeatures[trigger]=labeledTweets2
    print(jsonfeatures[trigger])
  set3=APIcall.creatingTestSet(competitor)
  preprocessedSearchedTweets3=Preprocess.processTweets(set3)
  labeledTweets3=SA.loadModel(preprocessedSearchedTweets3)
  jsonfeatures[competitor]=labeledTweets3
  print(type(jsonfeatures))
  jsonfeatures=jsonify(jsonfeatures)
  # print(type(jsonfeatures))
  return jsonfeatures

