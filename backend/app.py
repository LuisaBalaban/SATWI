from flask import Flask, jsonify, render_template
from flask import request
from API import APIcall
from API import Preprocess
from API import SA 
from flask_cors import CORS, cross_origin
app = Flask(__name__, template_folder="components")

app.config['CORS_HEADERS'] = 'Content-Type'
cors = CORS(app)

  
@app.route('/result', methods = ['POST'])
@cross_origin()
def result():
  keyword = request.json['keyword']
  print(keyword)
  newSet=APIcall.creatingTestSet(keyword)
  print(newSet)
  preprocessedSearchedTweets=Preprocess.processTweets(newSet)
  print(preprocessedSearchedTweets)
  labeledTweets=SA.loadModel(preprocessedSearchedTweets)
  return labeledTweets
