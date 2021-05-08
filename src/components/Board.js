import React from 'react';
import { withRouter } from 'react-router-dom';
import '../index.css';
import TweetEmbed from 'react-tweet-embed'
import Lottie from '../Lottie.js'
import { TwitterTimelineEmbed } from 'react-twitter-embed';
import Chart from "react-google-charts";

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: this.props.location.state.username,
            features_string: '',
            features: this.props.location.state.features,
            triggers_string: '',
            triggers: this.props.location.state.triggers,
            competitor: this.props.location.state.competitor,
            countPoz: this.props.location.state.countPoz,
            countNeg: this.props.location.state.countNeg,
            count_retweets: this.props.location.state.count_retweets,
            count_tweets: this.props.location.state.count_tweets,
            polarityValues: this.props.location.state.polarityValues,
            max_followers: this.props.location.state.max_followers,
            all_followers: this.props.location.state.all_followers,
            most_used_hashtag: this.props.location.state.most_used_hashtag,
            resultedTweets: [],
            tweets:this.props.location.state.tweets

        }

    }
    // componentDidUpdate(previousProps) {
    //     if (previousProps !== this.props) {
    //         this.setState({          
    //             countPoz: this.props.countPoz,
    //             countNeg: this.props.countNeg,
    //             count_retweets:this.data.count_retweets,
    //             count_tweets:this.data.count_retweets,

    //         });
    //     }
    // }
    render() {
        console.log(this.state.username)
        console.log(this.state.features)
        console.log(this.state.count_tweets)
        console.log(this.state.resultedTweets)
        this.state.resultedTweets = this.state.tweets.map(s => ([s]))
        return (
            <div>


                <div className="vertical">
                    <section>
                        <div className="box">
                            <div className="vertical">
                            <h1>{this.state.features}</h1>
                                <div className="child">
                                    <div className="wrapper">
                                        <Chart
                                            width={'150px'}
                                            height={'200px'}
                                            chartType="PieChart"
                                            loader={<div>Loading Chart</div>}
                                            data={[
                                                ['Tweet', 'type'],
                                                ['Text tweet', this.state.count_tweets],
                                                ['Re-tweet', this.state.count_retweets]
                                            ]}
                                            options={{
                                                title: 'Tweet type',
                                                backgroundColor: {
                                                    fill: '#dddbf3',
                                                    fillOpacity: 0.0,
                                                },
                                                fontSize: 12,
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
                                            width={'150px'}
                                            height={'200px'}
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
                                                    fillOpacity: 0.0,
                                                },
                                                fontName: 'Reem kufi',

                                                fontSize: 12,
                                                legend: 'none', slices: {
                                                    0: { color: '#9888b5' },
                                                    1: { color: 'purple' }
                                                }
                                            }}
                                            rootProps={{ 'data-testid': '1' }}
                                        />
                                        <Chart
                                            width={'300px'}
                                            height={'200px'}
                                            chartType="Histogram"
                                            loader={<div>Loading Chart</div>}
                                            data={[
                                                ['tweet', 'sentiment'],
                                                ...this.state.polarityValues
                                            ]}
                                            options={{
                                                title: 'Sentiment polarity distribution',
                                                legend: { position: "none" },
                                                backgroundColor: {
                                                    fill: '#dddbf3',
                                                    fillOpacity: 0.0,
                                                },
                                                colors: ['#703593'],

                                                style: {
                                                    color: 'purple'
                                                },

                                                fontName: 'Reem Kufi',
                                                fontSize: 12,
                                                hAxis: {
                                                    title: 'Positive <--------------> Negative',

                                                }
                                            }}
                                            rootProps={{ 'data-testid': '1' }}
                                        />
                                        </div>
                                        </div>
                                        <div className="child">
                                            <p>{this.state.all_followers}</p>
                                            {/* <TweetEmbed id={this.state.max_followers} />
                                            <TweetEmbed id={this.state.most_used_hashtag} /> */}
                                            <div className="child">
                                            <Chart
                  width={'600px'}
                  height={'200px'}
                  chartType="WordTree"
                  loader={<div>Loading Chart</div>}
                  data={[
                    ['Tweets'],
                    ...this.state.resultedTweets
                  ]}
                  options={{
                    wordtree: {

                      format: 'implicit',
                      word: this.state.keyword,
                      fontName: 'Reem Kufi',
                      fontSize: 25
                    },
                    backgroundColor: {
                        fill: '#dddbf3',
                        fillOpacity: 0.0,
                    },
                  }}
                  rootProps={{ 'data-testid': '1' }}
                /> 
                                            </div>
                                        </div>
                                    </div>
                              
                        </div>
                        <TwitterTimelineEmbed
                            sourceType="profile"
                            screenName={this.state.username}
                            options={{ height: 50, width: 250, tweetLimit: 10 }}
                        />
                    </section>

                </div>
            </div>


        )
    }
}

export default withRouter(Board)