from flask import Flask, jsonify, render_template
from flask import request
from API import APIcall
from flask import jsonify
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
  feature1 = request.json['feature1']
  feature2 = request.json['feature2']
  trigger1 = request.json['trigger1']
  trigger2 = request.json['trigger2']
  username = request.json['username']
  print(feature1)
  date1 = request.json['date1']
  date2 = request.json['date2']
  jsonfeatures={}
  if not feature2:
    features=[feature1]
    triggers=[trigger1]
    dates=[date1]
  else:
   features=[feature1,feature2]
   triggers=[trigger1, trigger2]
   dates=[date1,date2]
  for feature in features:
    query=feature+' '+username
    print(query)
    newSet=APIcall.creatingTestSet(query)
    preprocessedSearchedTweets=Preprocess.processTweets(newSet)
    labeledTweets=SA.loadModel(preprocessedSearchedTweets)
    jsonfeatures[feature]=labeledTweets
    print(jsonfeatures[feature])
  for trigger in triggers:
    query=trigger+' '+username
    newSet=APIcallBrand.creatingTestSet(query)
    preprocessedSearchedTweets=Preprocess.processTweets(newSet)
    labeledTweets=SAtriggers.loadModel(preprocessedSearchedTweets)
    jsonfeatures[trigger]=labeledTweets
    print(jsonfeatures[trigger])
  print(type(jsonfeatures))
  jsonfeatures=jsonify(jsonfeatures)
  # print(type(jsonfeatures))
  return jsonfeatures

