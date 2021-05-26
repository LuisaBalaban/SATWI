import React from 'react';
import { withRouter } from 'react-router-dom';
import '../index.css';
import Chart from "react-google-charts";
import TweetEmbed from 'react-tweet-embed'

class ProjectMenu3 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
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
            mostRetweetedTrigger3: this.props.location.state.mostRetweetedTrigger3,
            projectName3: this.props.location.state.projectName3,
            feature3: this.props.location.state.feature3
        }
    }
    render() {
        console.log(this.state.bubble_chart_data3)
        console.log(this.state.mostRetweetedTrigger3)
        return (
            <div >



                <div className="box">

                    <div className="vertical">

                        <h1>{this.state.projectName3}</h1>
                        <hr class="rounded"></hr>
                        <h2 id="feature">Researched feature: {this.state.feature3}</h2>
                        <div className="hidden-proj_board1">

                            <TweetEmbed options={{ width: 250 }} id={this.state.max_followers3} />
                            <div className="vertical">
                                <div className="inline-charts">
                                    <Chart
                                        width={'150px'}
                                        height={'200px'}
                                        chartType="PieChart"
                                        loader={<div>Loading Chart</div>}
                                        data={[
                                            ['Tweet', 'type'],
                                            ['Text tweet', this.state.count_tweets3],
                                            ['Re-tweet', this.state.count_retweets3]
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
                                            ['Positive', this.state.countPoz3],
                                            ['Negative', this.state.countNeg3],
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
                                            ...this.state.polarityValues3
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
                                            ...this.state.bubble_chart_data3

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
                                                <h3 id="trigger-text">Trigger: {this.state.trigger3}</h3>
                                                <Chart
                                                    width={'500px'}
                                                    height={'350px'}
                                                    chartType="LineChart"
                                                    loader={<div>Loading Chart</div>}

                                                    data={[
                                                        ['date', 'count'],
                                                        ...this.state.timeline3
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
                                                    <h4>{this.state.avgPolarityTrigger3}</h4>
                                                </div>

                                                <div className="vertical">
                                                    <p id="info">Reached users:</p>
                                                    <h4>{this.state.impactedFollowersTrigger3}</h4>
                                                </div>
                                                <div className="vertical">
                                                    <p id="info">Associated hashtags:</p>
                                                    <h4>{this.state.hashtagTrigger3}</h4>

                                                </div>

                                            </div>

                                        </div>
                                        <TweetEmbed options={{ width: 250 }} id={this.state.mostRetweetedTrigger3} />
                                    </div>
                                </div>
                            </div>
                        </div>



                    </div>

                </div>

            </div>);
    }
}
export default withRouter(ProjectMenu3)