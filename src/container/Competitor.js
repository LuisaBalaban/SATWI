import React from 'react';
import { withRouter } from 'react-router-dom';
import '../index.css';
import Chart from "react-google-charts";
import TweetEmbed from 'react-tweet-embed'

class Competitor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            competitor: this.props.location.state.competitor,
            word_sentiment_negative_competitor: this.props.location.state.word_sentiment_negative_competitor,
            word_sentiment_positive_competitor: this.props.location.state.word_sentiment_positive_competitor,
            countPozCompetitor: this.props.location.state.countPozCompetitor,
            countNegCompetitor: this.props.location.state.countNegCompetitor,
            timelineCompetitor:this.props.location.state.timelineCompetitor,

        }
    }
    render() {
        return (
            <div className="vertical">


                <section>
                    <div id="box-competitor" className="box">
                        <div className="vertical">
                            <h1>{this.state.competitor}</h1>
                            <div className="inline-charts"> <section>
                                <Chart
                                    width={'500px'}
                                    height={'500px'}
                                    chartType="BarChart"
                                    loader={<div>Loading Chart</div>}
                                    data={[
                                        ['Word', 'No.apperances', { role: 'style' }],
                                        ...this.state.word_sentiment_negative_competitor
                                    ]}
                                    options={{
                                        title: 'Most recurrent negative words',
                                        legend: { position: "none" },
                                        backgroundColor: '#dddbf3',
                                        color: 'red',

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
                                    width={'500px'}
                                    height={'500px'}
                                    chartType="BarChart"
                                    loader={<div>Loading Chart</div>}
                                    data={[
                                        ['Word', 'No.apperances', { role: 'style' }],
                                        ...this.state.word_sentiment_positive_competitor
                                    ]}
                                    options={{
                                        title: 'Most recurrent positive words',
                                        legend: { position: "none" },
                                        backgroundColor: '#dddbf3',
                                        color: 'red',

                                        hAxis: {
                                            title: 'No appereances',
                                            minValue: 0,
                                        },
                                        vAxis: {
                                            title: 'words',
                                        },
                                    }}

                                    rootProps={{ 'data-testid': '1' }}
                                />
                                <Chart
                                    width={'250px'}
                                    height={'300px'}
                                    chartType="PieChart"
                                    loader={<div>Loading Chart</div>}
                                    data={[
                                        ['Sentiment', 'no. of tweets'],
                                        ['Positive', this.state.countPozCompetitor],
                                        ['Negative', this.state.countNegCompetitor],
                                    ]}
                                    options={{
                                        title: 'Sentiment partition',
                                        backgroundColor: {
                                            fill: '#dddbf3',
                                            fillOpacity: 0.8,
                                        },
                                        fontName: 'Reem kufi',

                                        fontSize: 20,
                                        legend: 'none', slices: {
                                            0: { color: '#9888b5' },
                                            1: { color: 'purple' }
                                        }
                                    }}
                                    rootProps={{ 'data-testid': '1' }}
                                />
                                <Chart
                                    width={'600px'}
                                    height={'400px'}
                                    chartType="LineChart"
                                    loader={<div>Loading Chart</div>}

                                    data={[
                                        ['date', 'count'],
                                        ...this.state.timelineCompetitor
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
                                
                            </section>
                            </div>
                        </div>
                    </div>
                </section>
            </div>);
    }
}
export default withRouter(Competitor)