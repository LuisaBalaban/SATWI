import React from 'react';
import { withRouter } from 'react-router-dom';
import '../index.css';
import Chart from "react-google-charts";
import TweetEmbed from 'react-tweet-embed'

class ProjectMenu2 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            //project 2
            countPoz2: this.props.location.state.countPoz2,
            countNeg2: this.props.location.state.countNeg2,
            count_retweets2: this.props.location.state.count_retweets2,
            count_tweets2: this.props.location.state.count_tweets2,
            polarityValues2: this.props.location.state.polarityValues2? this.props.location.state.polarityValues2:[],
            max_followers2: this.props.location.state.max_followers2,
            all_followers2: this.props.location.state.all_followers2,
            most_used_hashtag2: this.props.location.state.most_used_hashtag2,
            resultedTweets2: [],
            bubble_chart_data2: this.props.location.state.bubble_chart_data2? this.props.location.state.bubble_chart_data2:[],
            trigger2: this.props.location.state.trigger2,
            avgPolarityTrigger2: this.props.location.state.avgPolarityTrigger2,
            impactedFollowersTrigger2: this.props.location.state.impactedFollowersTrigger2,
            hashtagTrigger2: this.props.location.state.hashtagTrigger2,
            mostFollowedTrigger2: this.props.location.state.mostFollowedTrigger2,
            projectName2: this.props.location.state.projectName2,
            feature2: this.props.location.state.feature2,
            trigger2: this.props.location.state.trigger2,
            date2: this.props.location.state.date2,
            timeline2: this.props.location.state.timeline2? this.props.location.state.timeline2:[],
            mostRetweetedTrigger2: this.props.location.state.mostRetweetedTrigger2,
        }
    }
    componentWillReceiveProps(nextProps) {
        this.setState({polarityValues2: nextProps.polarityValues2,
            countPoz2: nextProps.countPoz2,
            countNeg2: nextProps.countNeg2,
            count_retweets2: nextProps.count_retweets2,
            count_tweets2: nextProps.count_tweets2,
            polarityValues2:nextProps.polarityValues2,
            max_followers2: nextProps.max_followers2,
            all_followers2: nextProps.all_followers2,
            most_used_hashtag2: nextProps.most_used_hashtag2,
            bubble_chart_data2: nextProps.bubble_chart_data2,
            trigger2: nextProps.trigger2,
            avgPolarityTrigger2: nextProps.avgPolarityTrigger2,
            impactedFollowersTrigger2: nextProps.impactedFollowersTrigger2,
            hashtagTrigger2: nextProps.hashtagTrigger2,
            mostFollowedTrigger2: nextProps.mostFollowedTrigger2,
            projectName2:nextProps.projectName2,
            feature2: nextProps.feature2,
            trigger2: nextProps.trigger2,
            date2: nextProps.date2,
            timeline2: nextProps.timeline2,
            mostRetweetedTrigger2: nextProps.mostRetweetedTrigger2
})
      }
    render() {
        console.log(this.state.timeline2)
        console.log(this.state.projectName2)
        console.log(this.state.count_tweets2)
        console.log(this.state.count_retweets2)
        console.log(this.state.mostRetweetedTrigger2)
        return (
            <div >


                <div className="box">

                    <div className="vertical">

                        <h1>{this.state.projectName2}</h1>
                        <hr class="rounded"></hr>
                        <h2 id="feature">Researched feature: {this.state.feature2}</h2>
                        <div className="hidden-proj_board1">
                            <TweetEmbed options={{ width: 250 }} id={this.state.max_followers2} />
                            <div className="vertical">
                                <div className="inline-charts">
                                    <Chart
                                        width={'150px'}
                                        height={'200px'}
                                        chartType="PieChart"
                                        loader={<div>Loading Chart</div>}
                                        data={[
                                            ['Tweet', 'type'],
                                            ['Text tweet', this.state.count_tweets2],
                                            ['Re-tweet', this.state.count_retweets2]
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
                                            ['Positive', this.state.countPoz2],
                                            ['Negative', this.state.countNeg2],
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
                                        data={[
                                            ['tweet', 'sentiment'],
                                            ...this.state.polarityValues2
                                        ]}
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
                                            ...this.state.bubble_chart_data2

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
                                                <h3 id="trigger-text">Trigger: {this.state.trigger2}</h3>
                                                <Chart
                                                    width={'500px'}
                                                    height={'350px'}
                                                    chartType="LineChart"
                                                    loader={<div>Loading Chart</div>}

                                                    data={[
                                                        ['date', 'count'],
                                                        ...this.state.timeline2
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
                                                    <h4>{this.state.avgPolarityTrigger2}</h4>
                                                </div>

                                                <div className="vertical">
                                                    <p id="info">Reached users:</p>
                                                    <h4>{this.state.impactedFollowersTrigger2}</h4>
                                                </div>
                                                <div className="vertical">
                                                    <p id="info">Associated hashtags:</p>
                                                    <h4>{this.state.hashtagTrigger2}</h4>

                                                </div>

                                            </div>

                                        </div>
                                        <TweetEmbed options={{ width: 250 }} id={this.state.mostRetweetedTrigger2} />
                                        
                                    </div>
                                </div>
                            </div>
                        </div>



                    </div>

                </div>
            </div>);
    }
}
export default withRouter(ProjectMenu2)