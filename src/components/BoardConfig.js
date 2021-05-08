import React from 'react';
import { withRouter } from 'react-router-dom';
import '../index.css';
import Lottie from '../Lottie.js'
import board from '../images/config-board.json'

class BoardConfig extends React.Component {
    constructor() {
        super();
        this.state={
            username:'',
            features_string:'',
            triggers_string:'',
            competitor:'',
            count_retweets:0,
            countPoz: 0,
            countNeg: 0,
            count_tweets:0,
            max_followers:0,
            most_used_hashtag:0,
            resultedTweets:[],
            tweets: [],

        }
        this.handleChange = this.handleChange.bind(this)
        this.handleInput=this.handleInput.bind(this);
    }
  
    handleChange(event) {
        const {name, value} = event.target

        this.setState({
            [name]: value
        }) 
    }
    handleInput= e => {
       e.preventDefault();
       this.setState({
           features:this.state.features_string.split(','),
           triggers:this.state.triggers_string.split(',')
       })
       console.log("making request")
       console.log(this.state.username)
       console.log(this.state.features)
       fetch("http://127.0.0.1:5000/board", {
           method: "POST",
           body: JSON.stringify({ features: this.state.features_string,triggers:this.state.triggers_string, username:this.state.username}),
           headers: {
               'Content-Type': 'application/json',
               'Accept': 'application/json'
           },
       }
       ).then(response =>{
           console.log(response)
           return response.json()
       })
           .then(json => {      
               console.log(json)
               console.log(Object.keys(json).toString())
        console.log(json[Object.keys(json).toString()])
          
        this.setState({
            count_retweets:json[Object.keys(json).toString()].count[0],
            countPoz: (JSON.stringify(Object.values(json[Object.keys(json).toString()].labeledTweets)).match(/Positive/g) || []).length,
            countNeg: (JSON.stringify(Object.values(json[Object.keys(json).toString()].labeledTweets)).match(/Negative/g) || []).length,
            count_tweets:json[Object.keys(json).toString()].count[1],
            polarityValues:Object.values(json[Object.keys(json).toString()].results[0]),
            most_used_hashtag:json[Object.keys(json).toString()].most_used_hashtag,
            tweets: Object.keys(json[Object.keys(json).toString()].labeledTweets[0]),
      
          
        })
       let path = `/board`;
       console.log(this.state.countNeg)
       console.log(this.state.countPoz)
       this.props.history.push({
            pathname: path,
            state: {
                competitor: this.state.competitor,
                username: this.state.username,
                features:this.state.features_string,
                triggers:this.state.features_string,
                count_retweets:json[Object.keys(json).toString()].count[0],
                countPoz: (JSON.stringify(Object.values(json[Object.keys(json).toString()].labeledTweets)).match(/Positive/g) || []).length,
                countNeg: (JSON.stringify(Object.values(json[Object.keys(json).toString()].labeledTweets)).match(/Negative/g) || []).length,
                count_tweets:json[Object.keys(json).toString()].count[1],
                polarityValues:Object.values(json[Object.keys(json).toString()].results[0]),
                max_followers:json[Object.keys(json).toString()].max_followers,
                all_followers:json[Object.keys(json).toString()].all_followers,most_used_hashtag:json[Object.keys(json).toString()].most_used_hashtag,
                tweets: Object.keys(json[Object.keys(json).toString()].labeledTweets[0]),
               
            }
        });
    })
      };
    

    render() {
      
        return(<div>
           
             <h1 id="small-title">Personalize your board</h1>
          
            <section>
            <form className="form-board">
                <div className="vertical">
                <input type='text' name="username" value={this.state.username} onChange={this.handleChange} placeholder='Twitter username' className="input-board">
                </input>
                <input  type='text'  name="features_string" value={this.state.features_string} onChange={this.handleChange} placeholder='Features to follow' className="input-board">
                </input>
                <input  type='text' name="triggers_string" value={this.state.triggers_string} onChange={this.handleChange} placeholder='Urgent triggers' className="input-board">
                </input>
                <input  type='text' name="competitor" value={this.state.competitor} onChange={this.handleChange} placeholder='Competitor to analyze' className="input-board">
                </input>
                <button onClick={this.handleInput} className="btn-user">Generate board</button>
                </div>
               
            </form>
            <Lottie lotti={board} height={600} width={600} />
            </section>
        </div>)
    }
}
export default withRouter(BoardConfig)
