import React from 'react';
import { withRouter } from 'react-router-dom';
import phone from '../images/phone.json'
import twitter_logo from '../images/twitter_logo.png'
import hashtag_logo from '../images/hashtag_logo.png'
import retweet_logo from '../images/Retweet.png'
import user_logo from '../images/user_logo.png'
import Lottie from '../Lottie.js'
import '../index.css';
import Loader from 'react-loader-spinner';
import Chart from "react-google-charts";
import TweetEmbed from 'react-tweet-embed'

class UserInterface extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            scrollEnd: '',
            labeledTweets: '',
            keyword: '',
            tweets: [],
            labels: '',
            countPoz: 0,
            countNeg: 0,
            polarityValues: [],
            json: '',
            resultedTweets: [],
            messagesEnd: '',
            flag: false,
            count_retweets:0,
            count_tweets:0,
            popular_rt:'1386625378895138816',
            FREQ_freq_RTS:[],
            RTS_freq_RTS:[],
            WORDS_freq_RTS:[],
            polarity_assoc:[],
            bubble_chart_data:[['abc',0.7,5,2],['dsa',0.4,33,9]],
            max_followers:'1386625378895138816',
            total_no_tweets:0,
            total_no_rtweets:0,
            no_hashtags:0,
            all_followers:0,
            loaded:1,
            word_sentiment_negative:[[0,0],[0,0],[0,0],[0,0],[0,0]],
            word_sentiment_positive:[[0,0],[0,0],[0,0],[0,0],[0,0]],
            search_query:''
        }
        this.handleChange = this.handleChange.bind(this);
        this.search = this.search.bind(this)
        this.performGoogleSerach=this.performGoogleSerach.bind(this);


    }
    handleChange(event) {
        const { name, value } = event.target
        this.setState({ [name]: value })
    }
    search(e) {
        this.setState({
            flag: true,
            loaded:0
        })
        e.preventDefault()
        console.log("making request")
        console.log(this.state.keyword)
        fetch("http://127.0.0.1:5000/result", {
            method: "POST",
            body: JSON.stringify({ keyword: this.state.keyword }),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
        }
        ).then(response => {
            console.log(response)
            return response.json()
        })
            .then(json => {
                console.log(Object.values(json.labeledTweets[0]))
                this.setState({
                    json: json,
                    labeledTweets: json.labeledTweets[0],
                    tweets: Object.keys(json.labeledTweets[0]),
                    labels: Object.values(json.labeledTweets[0]),
                    countPoz: (JSON.stringify(Object.values(json.labeledTweets)).match(/Positive/g) || []).length,
                    countNeg: (JSON.stringify(Object.values(json.labeledTweets)).match(/Negative/g) || []).length,
                    polarityValues: Object.values(json.results[0]),
                    flag: false,
                    count_retweets:json.count[0],
                    count_tweets:json.count[1],
                    popular_rt:json.mostRetweeted,
                    FREQ_freq_RTS:json.freq,
                    RTS_freq_RTS:json.rts,
                    WORDS_freq_RTS:Object.keys(json.words),
                    polarity_assoc:Object.values(json.polarity),
                    bubble_chart_data:json.bubble_chart_data,
                    max_followers:json.max_followers,
                    total_no_tweets:json.total_no_tweets,
                    total_no_rtweets:json.total_no_rtweets,
                    no_hashtags:json.no_hashtags,
                    all_followers:json.all_followers,
                    most_used_hashtag:json.most_used_hashtag,
                    loaded:1,
                    word_sentiment_negative:json.word_sentiment_negative,
                    word_sentiment_positive:json.word_sentiment_positive

                })
                this.scrollToBottom();
                console.log(this.state.count_retweets)
                console.log(this.state.max_followers)
                console.log(this.state.popular_rt)

            })
    }
    performGoogleSerach = e => {
      const buttonValue = e.target.value;
      console.log(buttonValue);
      this.setState(
        {
        search_query:'https://www.google.com/search?q='+[this.state.keyword]+'+'+[buttonValue]
        }
      )
      console.log(this.state.search_query);
      window.location.href = this.state.search_query;
}

    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });


      }


    render() {
        this.state.resultedTweets = this.state.tweets.map(s => ([s]))
        console.log(this.state.resultedTweets)
       console.log(this.state.popular_rt)
       console.log(this.state.FREQ_freq_RTS) 
       console.log(this.state.RTS_freq_RTS)     
       console.log(this.state.WORDS_freq_RTS) 
       console.log(this.state.polarity_assoc) 
       console.log(this.state.max_followers)
       console.log(this.state.no_hashtags)
       console.log(this.state.word_sentiment_positive)
       console.log([this.state.word_sentiment_positive[1]][0][0])

          Object.keys(this.state.labeledTweets).map((key, index) => (
          key=this.state.labeledTweets[key]))
        
        return (<div>

            <section>
                <Lottie lotti={phone} height={690} width={400} />


                <div id="cover">
                    <form>
                        <div className="tb">
                            <div className="td"><input type="text" name="keyword" placeholder="Search a company" value={this.state.keyword} onChange={this.handleChange} /></div>
                            <div className="td" id="s-cover">
                                <button onClick={this.search}>
                                    <div id="s-circle"></div>
                                    <span></span>
                                </button>
                            </div>
                        </div>
                
                    </form>
                    <div style={{
                        width: "100%",
                        height: "100",
                        display: "flex", justifyContent: "center", alignItems: "center"
                    }}    >{this.state.flag ? <Loader type="ThreeDots" color="#FFFFFF" height="200" width="200" /> : ''}

                    </div>
                </div>
            </section>
            <div className={this.state.loaded ? '' :'display-info'}>
         
              
                
                   {/* {this.state.popular_rt.map((e)=>{
      console.log(e);
      return( <TweetEmbed id={e}/>
     );})} */}
      
  
   
     <h3 id="title-one">Stats about <i>{this.state.keyword}</i></h3>
   <section>
     <div className="box">
         <div className="vertical">
         <div  className="child">
         <img src={twitter_logo} width={80} height={80}/>
         <p>{this.state.total_no_tweets}</p></div>
         <div  className="child">
         <img src={user_logo} width={100} height={100}/>
         <p>{this.state.all_followers}</p></div>      
         </div>
         <div className="vertical">
         <div  className="child">
         <img src={retweet_logo} width={100} height={70}/><p>{this.state.total_no_rtweets}</p></div>
         <div  className="child">
         <img src={hashtag_logo} width={100} height={100}/><p>{this.state.no_hashtags}</p></div>
         </div>
        
     </div>
     <div className="vertical">
         <h3>Most used #</h3>
         <TweetEmbed id={this.state.most_used_hashtag}/>
         </div><div className="vertical">
          <h3>Most retweeted</h3>
          <TweetEmbed id={this.state.popular_rt}/> 
          </div>     
          <div className="vertical">
          <h3>Most popular user talking about {this.state.keyword}</h3>
          <TweetEmbed id={this.state.max_followers}/>
          </div>
          <div style={{ float: "left", clear: "both" }}
                    ref={(el) => { this.messagesEnd = el; }}></div>
                </section>
                <h3 id="title-one">Sentiment analysis</h3>
                <section>
                
                   <Chart
  width={'600px'}
  height={'550px'}
  chartType="BubbleChart"
  loader={<div>Loading Chart</div>}
  data={[
    ['Word', 'Polarity', 'Word frequency', 'No. retweets'],
    ...this.state.bubble_chart_data
   
  ]}
  options={{
    title:
      'Correlation between Polarity, Popularity ' +
      'of a tweet and the number of appearances of that word',
      backgroundColor: '#dddbf3',
      fontName: 'Reem Kufi',
                        fontSize: 15,
      animation:{
          startup:true,
          easing:'inAndOut'
        },
        bubble:{
            opacity:0.5,
            auraColor: 'none'
        },
    hAxis: { title: 'Polarity',ticks: [-1, 2] },
    vAxis: { title: 'Popularity' },
    bubble: { textStyle: { fontSize: 11 } },
    sortBubblesBySize:true,
    explorer: {axis: 'vertical',keepInBounds: true},
    colorAxis: { colors: ['#9888b5', 'purple'] }
    
  }}
  rootProps={{ 'data-testid': '1' }}
/>
                <Chart
                    width={'500px'}
                    height={'550px'}
                    chartType="Histogram"
                    loader={<div>Loading Chart</div>}
                    data={[
                        ['tweet', 'sentiment'],
                        ...this.state.polarityValues
                    ]}
                    options={{
                        title: 'Sentiment polarity distribution',
                        legend: { position: "none" },
                        backgroundColor: '#dddbf3',
                        colors: ['#703593'],
                       
                        style:{
                            color:'purple'
                        },

                        fontName: 'Reem Kufi',
                        fontSize: 20,
                        hAxis: {
                            title: 'Positive <--------------> Negative',

                        }
                    }}
                    rootProps={{ 'data-testid': '1' }}
                />
               <div className='vertical'><Chart
  width={'250px'}
  height={'300px'}
  chartType="PieChart"
  loader={<div>Loading Chart</div>}
  data={[
    ['Tweet', 'type'],
    ['Text tweet',  this.state.count_tweets],
    ['Re-tweet',  this.state.count_retweets]
  ]}
  options={{
    title: 'Tweet type',
    backgroundColor: '#dddbf3',
    fontSize: 20,
    fontName: 'Reem Kufi',
    legend: 'none',
    pieHole: 0.4,
    slices: {
        0: { color: '#9888b5' },
        1: { color: 'purple' }
      }
  }}
  rootProps={{ 'data-testid': '3' }}
/>

<Chart
                    width={'250px'}
                    height={'300px'}
                    chartType="PieChart"
                    loader={<div>Loading Chart</div>}
                    data={[
                        ['Sentiment', 'no. of tweets'],
                        ['Positive', this.state.countPoz],
                        ['Negative', this.state.countNeg],
                    ]}
                    options={{
                        title: 'Sentiment partition',
                        backgroundColor: {
                            fill: '#dddbf3',
                            fillOpacity: 0.8,
                        },
                        fontName: 'Reem kufi',
                     
                        fontSize: 20,
                        legend: 'none',  slices: {
                            0: { color: '#9888b5' },
                            1: { color: 'purple' }
                          }
                    }}
                    rootProps={{ 'data-testid': '1' }}
                />
                <div style={{ float: "left", clear: "both" }}
                    ref={(el) => { this.messagesEnd = el; }}></div>
                    </div> 
                </section>
                <section>
 <h3 id="title-one">Features to pay attention to </h3> 
<div className="vertical">
<button value={[this.state.word_sentiment_positive[0]][0][0]} onClick={this.performGoogleSerach} class="myButton">{[this.state.word_sentiment_positive[0]][0][0] }</button>
<button value={[this.state.word_sentiment_positive[1]][0][0]} onClick={this.performGoogleSerach}  class="myButton">{[this.state.word_sentiment_positive[1]][0][0] }</button>
<button value={[this.state.word_sentiment_negative[0]][0][0]} onClick={this.performGoogleSerach} class="myButton">{[this.state.word_sentiment_negative[0]][0][0] }</button>
<button value={[this.state.word_sentiment_negative[1]][0][0]} onClick={this.performGoogleSerach}  class="myButton">{[this.state.word_sentiment_negative[1]][0][0] }</button>

</div>
                </section>
                <section>
                <Chart
  width={'600px'}
  height={'600px'}
  chartType="BarChart"
  loader={<div>Loading Chart</div>}
  data={[
    ['Word', 'No.apperances' ,{ role: 'style' }],
   ...this.state.word_sentiment_negative
  ]}
  options={{
    title: 'Most recurrent negative words',
      legend: { position: "none" },
    backgroundColor: '#dddbf3',
    color:'red',

    hAxis: {
      title: 'No appereances',
      minValue: 0,
    },
    vAxis: {
      title: 'words',
    },
  }}
  // For tests
  rootProps={{ 'data-testid': '1' }}
/>
<Chart
  width={'600px'}
  height={'600px'}
  chartType="BarChart"
  loader={<div>Loading Chart</div>}
  data={[
    ['Word', 'No.apperances' ,{ role: 'style' }],
   ...this.state.word_sentiment_positive
  ]}
  options={{
    title: 'Most recurrent positive words',
      legend: { position: "none" },
    backgroundColor: '#dddbf3',
    color:'red',

    hAxis: {
      title: 'No appereances',
      minValue: 0,
    },
    vAxis: {
      title: 'words',
    },
  }}
  // For tests
  rootProps={{ 'data-testid': '1' }}
/>
</section>

            </div>
        </div>);
    }
}
export default withRouter(UserInterface)