import React from 'react';
import { withRouter } from 'react-router-dom';
import '../index.css';
//import '../elements.css';
import TweetEmbed from 'react-tweet-embed'
import Lottie from '../Lottie.js'
import { TwitterTimelineEmbed } from 'react-twitter-embed';
import Chart from "react-google-charts";
import ProjectMenu2 from '../container/ProjectMenu2';
import ProjectMenu3 from '../container/ProjectMenu3';
import Competitor from '../container/Competitor';
import io from 'socket.io-client';


class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLogin:this.props.location.state.isLogin,
            username:  this.props.location.state.username,
            noProjects: this.props.location.state.noProjects,
            // project 1
            projectName1: this.props.location.state.projectName1,
            feature1: this.props.location.state.feature1,
            date1: this.props.location.state.date1,
            // project 2
            projectName2: this.props.location.state.projectName2,
            feature2: this.props.location.state.feature2,
            trigger2: this.props.location.state.trigger2,
            date2: this.props.location.state.date2,
            competitor: this.props.location.state.competitor,
            //project1
            countPoz1: this.props.location.state.isLogin ? 0: this.props.location.state.countPoz1,
            countNeg1: this.props.location.state.isLogin ? 0: this.props.location.state.countNeg1,
            count_retweets1: this.props.location.state.isLogin ? '': this.props.location.state.count_retweets1,
            count_tweets1: this.props.location.state.isLogin ? '': this.props.location.state.count_tweets1,
            polarityValues1:this.props.location.state.isLoginn ?[]:  this.props.location.state.polarityValues1,
            max_followers1:this.props.location.state.isLogin ? '': this.props.location.state.max_followers1,
            all_followers1: this.props.location.state.isLogin ? '': this.props.location.state.all_followers1,
            most_used_hashtag1:this.props.location.state.isLogin ? '':  this.props.location.state.most_used_hashtag1,
            resultedTweets1: [],
            tweets1: this.props.location.state.isLogin ? '': this.props.location.state.tweets1,
            bubble_chart_data1: this.props.location.state.isLogin ? '': this.props.location.state.bubble_chart_data1,
            trigger1: this.props.location.state.isLogin? '': this.props.location.state.trigger1,
            avgPolarityTrigger1: this.props.location.state.isLogin ? '': this.props.location.state.avgPolarityTrigger1,
            impactedFollowersTrigger1:this.props.location.state.isLogin ? '':  this.props.location.state.impactedFollowersTrigger1,
            hashtagTrigger1: this.props.location.state.isLogin? '': this.props.location.state.hashtagTrigger1,
            mostFollowedTrigger1: this.props.location.state.isLogin ? '': this.props.location.state.mostFollowedTrigger1,
            timeline1:this.props.location.state.isLogin? '':  this.props.location.state.timeline1,
            mostRetweetedTrigger1:this.props.location.state.isLogin ? '':  this.props.location.state.mostRetweetedTrigger1,
            //project 2
            countPoz2: this.props.location.state.countPoz2,
            countNeg2: this.props.location.state.countNeg2,
            count_retweets2: this.props.location.state.count_retweets2,
            count_tweets2: this.props.location.state.count_tweets2,
            polarityValues2: this.props.location.state.polarityValues2,
            max_followers2: this.props.location.state.max_followers2,
            all_followers2: this.props.location.state.all_followers2,
            most_used_hashtag2: this.props.location.state.most_used_hashtag2,
            resultedTweets2: [],
            tweets2: this.props.location.state.tweets2,
            bubble_chart_data2: this.props.location.state.bubble_chart_data2,
            trigger2: this.props.location.state.trigger2,
            avgPolarityTrigger2: this.props.location.state.avgPolarityTrigger2,
            impactedFollowersTrigger2: this.props.location.state.impactedFollowersTrigger2,
            hashtagTrigger2: this.props.location.state.hashtagTrigger2,
            mostFollowedTrigger2: this.props.location.state.mostFollowedTrigger2,
            timeline2: this.props.location.state.timeline2,

            //project 3
            countPoz3: this.props.location.state.countPoz3,
            countNeg3: this.props.location.state.countNeg3,
            count_retweets3: this.props.location.state.count_retweets3,
            count_tweets3: this.props.location.state.count_tweets3,
            polarityValues3: this.props.location.state.polarityValues3,
            max_followers3: this.props.location.state.max_followers3,
            all_followers3: this.props.location.state.all_followers3,
            most_used_hashtag3: this.props.location.state.most_used_hashtag3,
            resultedTweets3: [],
            tweets3: this.props.location.state.tweets3,
            bubble_chart_data3: this.props.location.state.bubble_chart_data3,
            trigger3: this.props.location.state.trigger3,
            avgPolarityTrigger3: this.props.location.state.avgPolarityTrigger3,
            impactedFollowersTrigger3: this.props.location.state.impactedFollowersTrigger3,
            hashtagTrigger3: this.props.location.state.hashtagTrigger3,
            mostFollowedTrigger3: this.props.location.state.mostFollowedTrigger3,
            timeline3: this.props.location.state.timeline3,

            //competitor
            word_sentiment_negative_competitor: this.props.location.state.word_sentiment_negative_competitor,
            word_sentiment_positive_competitor: this.props.location.state.word_sentiment_positive_competitor,
            countPozCompetitor: this.props.location.state.countPozCompetitor,
            countNegCompetitor: this.props.location.state.countNegCompetitor,
            timelineCompetitor: this.props.location.state.timelineCompetitor,

            //ids
            projId2: this.props.location.state.projId2,
            projId1: this.props.location.state.projId1,
            projId3: this.props.location.state.projId3,

            featureTweets: [],
            triggerTweets:[]
        }

    }
    fetchUsers() {

        console.log("making db request")

        fetch("http://127.0.0.1:5000/boardStats", {
            method: "POST",
            body: JSON.stringify({
                projId1: this.state.projId1,
                projId2: this.state.projId2,
                projId3: this.state.projId3,
                noProjects: this.state.noProjects
            }),
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
                

                console.log(json)
                // const length1 = json.body[this.state.projId1].length;
                // console.log(length1)
                // var j=0;
                // var k=0;
                // for(var i=0;i<length1;i++)
                // {
                //     if(json.body[this.state.projId1][i][10]===1)
                //     {
                //         this.state.triggerTweets[j]=json.body[this.state.projId1][i];
                        
                //         j=j+1;
                //     }
                //     else{
                        
                //         this.state.featureTweets[k]=json.body[this.state.projId1][i];
                //         if(this.state.featureTweets[k][4]===0)
                //         {
                //             this.setState({countPoz1:this.state.countPoz1+1})
                //         }
                //         else{
                //             this.setState({countNeg1:this.state.countNeg1+1})
                //         }
                //         var polarityValues=[]
                //         polarityValues[k]=Object.freeze({tweet:this.state.featureTweets[k][2], value:this.state.featureTweets[k][11]})
                //         this.setState({
                //             polarityValues1:this.state.polarityValues1+polarityValues[k]
                //         })
                //         k=k+1;
                //     }
                //}
                this.setState({
                    avgPolarityTrigger1:json.body[this.state.projId1].averageTriggerPolarity,
                    bubble_chart_data1:json.body[this.state.projId1].bubble_chart_data,
                    all_followers1:json.body[this.state.projId1].allFollowersFeature,
                    polarityValues1:json.body[this.state.projId1].polarityVals,
                    word_sentiment_negative_competitor:json.body[this.state.projId1].word_sentiment_negative,
                    word_sentiment_positive_competitor:json.body[this.state.projId1].word_sentiment_positive,
                    countPoz1:json.body[this.state.projId1].countPoz,
                    countNeg1:json.body[this.state.projId1].countNeg,
                    count_retweets1:(JSON.stringify(json.body[this.state.projId1].tweetType).match(/retweet/g) || []).length,
                    count_tweets1:(JSON.stringify(json.body[this.state.projId1].tweetType).match(/text/g) || []).length,
                    impactedFollowersTrigger1:json.body[this.state.projId1].allFollowersTrigger,
                    max_followers1:(json.body[this.state.projId1].mostPopularUserTrigger).toString(),
                    mostRetweetedTrigger1:(json.body[this.state.projId1].mostRetweetedTweetFeature).toString(),
                    timeline1:json.body[this.state.projId1].timeline,
                    trigger1:json.body[this.state.projId1].triggerFeature


                })
                console.log(this.state.featureTweets)
                console.log(this.state.triggerTweets)
                console.log(this.state.countNeg1)
                console.log(this.state.countPoz1)
                console.log(this.state.max_followers1) 

            })
    }
    // subscribeToEvents = () => {

    //     var socket = io.connect('http://127.0.0.1:5000/board')
    //     socket.on('board', function (msg) {
    //         console.log(msg.data)
    //         socket.emit('client-server', 'Client: Message received!');
    //     });
    // };

    componentDidMount() {
        this.fetchUsers();
     //   this.subscribeToEvents();
       // this.timer = setInterval(() => this.fetchUsers(), 30000);
        //console.log(this.state.projId1)
    }


    componentWillUnmount() {
        clearInterval(this.timer);
    }
    render() {
        console.log("RECEIVED ATTRIBUTES")
        // console.log(this.state.projId1)
        // console.log(this.state.avgPolarityTrigger1)
        // console.log(this.state.username)
        console.log(this.state.countPoz1)
        console.log(this.state.countNeg1)
        // console.log(this.state.tweets1)
        // console.log(this.state.feature1)
        // console.log(this.state.projectName1)
        // console.log(this.state.timeline2)
        // console.log(this.state.noProjects)
        // console.log(this.state.countPozCompetitor)
        // console.log(this.state.max_followers1)
        // console.log(this.state.polarityValues1)
        //console.log(this.state.countPoz1)
        //  this.state.resultedTweets = this.state.tweets1.map(s => ([s]))
        return (
                    <div>
                        <div className="inline-charts">


                            <div className="vertical">



                                <div className="box">

                                    <div className="vertical">

                                        <h1>{this.state.projectName1}</h1>
                                        <hr class="rounded"></hr>
                                        <h2 id="feature">Researched feature: {this.state.feature1}</h2>
                                        <div className="hidden-proj_board1">

                                            <TweetEmbed options={{ width: 250 }} id={this.state.max_followers1} />
                                            <div className="vertical">
                                                <div className="inline-charts">
                                                    <Chart
                                                        width={'150px'}
                                                        height={'200px'}
                                                        chartType="PieChart"
                                                        loader={<div>Loading Chart</div>}
                                                        data={[
                                                            ['Tweet', 'type'],
                                                            ['Text tweet', this.state.count_tweets1],
                                                            ['Re-tweet', this.state.count_retweets1]
                                                        ]}
                                                        options={{
                                                            title: 'Tweet type',
                                                            backgroundColor: {
                                                                fill: '#dddbf3',
                                                                fillOpacity: 0.0,
                                                            }, titleTextStyle: {
                                                                color: '#645c68'
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
                                                            ['Positive', this.state.countPoz1],
                                                            ['Negative', this.state.countNeg1],
                                                        ]}
                                                        options={{
                                                            title: 'Sentiment partition',
                                                            backgroundColor: {
                                                                fill: '#dddbf3',
                                                                fillOpacity: 0.0,
                                                            },
                                                            fontName: 'Reem kufi',
                                                            titleTextStyle: {
                                                                color: '#645c68'
                                                            },
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
                                                        height={'250px'}
                                                        chartType="Histogram"
                                                        loader={<div>Loading Chart</div>}
                                                        data={this.state.polarityValues1 ?[
                                                            ['tweet', 'sentiment'],
                                                            ...this.state.polarityValues1
                                                        ] : ''}
                                                        options={{
                                                            title: 'Sentiment polarity distribution',
                                                            legend: { position: "none" },
                                                            backgroundColor: {
                                                                fill: '#dddbf3',
                                                                fillOpacity: 0.0,
                                                            },
                                                            colors: ['#703593'],
                                                            titleTextStyle: {
                                                                color: '#645c68'
                                                            },
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


                                                    <Chart
                                                        width={'350px'}
                                                        height={'250px'}
                                                        chartType="BubbleChart"
                                                        loader={<div>Loading Chart</div>}
                                                        data={[
                                                            ['Word', 'Polarity', 'Word frequency', 'No. retweets'],
                                                            ...this.state.bubble_chart_data1

                                                        ]}
                                                        options={{
                                                            title:
                                                                'Correlation between Polarity, Popularity ' +
                                                                'of a tweet and the number of appearances of that word',
                                                            backgroundColor: {
                                                                fill: '#dddbf3',
                                                                fillOpacity: 0.0,
                                                            },
                                                            fontName: 'Reem Kufi',
                                                            fontSize: 12, titleTextStyle: {
                                                                color: '#645c68'
                                                            },
                                                            animation: {
                                                                startup: true,
                                                                easing: 'inAndOut'
                                                            },
                                                            bubble: {
                                                                opacity: 0.5,
                                                                auraColor: 'none'
                                                            },
                                                            hAxis: { title: 'Polarity', ticks: [-1, 2] },
                                                            vAxis: { title: 'Popularity' },
                                                            bubble: { textStyle: { fontSize: 11 } },
                                                            sortBubblesBySize: true,
                                                            explorer: { axis: 'vertical', keepInBounds: true },
                                                            colorAxis: { colors: ['#9888b5', 'purple'] }

                                                        }}
                                                        rootProps={{ 'data-testid': '1' }} />
                                                </div>

                                                <div className="inner-bottom">
                                                    <div className="inline-charts">
                                                        <div className="vertical">
                                                            <div className="inline-charts">
                                                                <h3 id="trigger-text">Trigger: {this.state.trigger1}</h3>
                                                                <Chart
                                                                    width={'500px'}
                                                                    height={'350px'}
                                                                    chartType="LineChart"
                                                                    loader={<div>Loading Chart</div>}

                                                                    data={[
                                                                        ['date', 'count'],
                                                                        ...this.state.timeline1
                                                                    ]
                                                                    }

                                                                    options={{
                                                                        hAxis: {
                                                                            title: 'Date',
                                                                        },
                                                                        vAxis: {
                                                                            title: 'No of Tweets',
                                                                        }, legend: 'none',
                                                                        series: {
                                                                            0: { color: '#9888b5' }
                                                                        }
                                                                    }}
                                                                    rootProps={{ 'data-testid': '1' }}
                                                                />
                                                            </div>

                                                            <div className="inline-charts">
                                                                <div className="vertical">
                                                                    <p id="info">Average polarity:</p>
                                                                    <h4>{this.state.avgPolarityTrigger1}</h4>
                                                                </div>

                                                                <div className="vertical">
                                                                    <p id="info">Reached users:</p>
                                                                    <h4>{this.state.impactedFollowersTrigger1}</h4>
                                                                </div>
                                                                <div className="vertical">
                                                                    <p id="info">Associated hashtags:</p>
                                                                    <h4>{this.state.hashtagTrigger1}</h4>

                                                                </div>

                                                            </div>

                                                        </div>
                                                        <TweetEmbed options={{ width: 250 }} id={this.state.mostRetweetedTrigger1} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>



                                    </div>

                                </div>



                                <div>{this.state.noProjects >= 2 ? <ProjectMenu2 /> : ''}</div>
                                <div>{this.state.noProjects == 3 ? <ProjectMenu3 /> : ''}</div>
                                <div>{this.state.competitor ? <Competitor /> : ''}</div>
                            </div>
                            <div className="tweet-Timeline">
                            <TwitterTimelineEmbed
                                sourceType="profile"
                                screenName={this.state.username}
                                options={{ height: 50, width: 250, tweetLimit: 10 }}
                            />
                            </div>
                        </div>


                    </div>



          
        )
    }
}

export default withRouter(Board)