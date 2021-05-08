from flask import Flask, jsonify, render_template
from flask import request
from API import APIcall
from flask import jsonify
from API import Preprocess
from API import APIcallBrand
from API import SA 
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
  features = request.json['features']
  username = request.json['username']
  jsonfeatures={}
  features_list = features.split(",")
  for feature in features_list:
    query=feature+' '+username
    print(query)
    newSet=APIcall.creatingTestSet(query)
    preprocessedSearchedTweets=Preprocess.processTweets(newSet)
    labeledTweets=SA.loadModel(preprocessedSearchedTweets)
    jsonfeatures[feature]=labeledTweets
    print(jsonfeatures[feature])
  print(type(jsonfeatures))
  jsonfeatures=jsonify(jsonfeatures)
  # print(type(jsonfeatures))
  return jsonfeatures

