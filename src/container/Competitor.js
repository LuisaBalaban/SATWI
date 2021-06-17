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
            word_sentiment_negative_competitor: this.props.location.state.word_sentiment_negative_competitor ? this.props.location.state.word_sentiment_negative_competitor : [],
            word_sentiment_positive_competitor: this.props.location.state.word_sentiment_positive_competitor ?this.props.location.state.word_sentiment_positive_competitor :[],
            countPozCompetitor: this.props.location.state.countPozCompetitor ?  this.props.location.state.countPozCompetitor: 0,
            countNegCompetitor: this.props.location.state.countNegCompetitor?  this.props.location.state.countNegCompetitor: 0,
            timelineCompetitor: this.props.location.state.timelineCompetitor?  this.props.location.state.timelineCompetitor: [],

        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({timelineCompetitor: nextProps.timelineCompetitor,
        countNegCompetitor:nextProps.countNegCompetitor,
         countPozCompetitor:nextProps.countPozCompetitor,
        word_sentiment_negative_competitor:nextProps.word_sentiment_negative_competitor,
        word_sentiment_positive_competitor:nextProps.word_sentiment_positive_competitor,
})
      }
    
    render() {
        console.log(this.state.countPozCompetitor)
        console.log(this.state.word_sentiment_negative_competitor)
        return (
            <div className="vertical">


                <section>
                    <div id="box-competitor" className="box">
                        <div className="vertical">
                        <h1>Competitor analysis - {this.state.competitor}</h1>
                        <hr class="rounded"></hr>
                            <div className="inline-charts"> 
                                <Chart
                                    width={'500px'}
                                    height={'200px'}
                                    chartType="BarChart"
                                    loader={<div>Loading Chart</div>}
                                    data={this.state.word_sentiment_negative_competitor?[
                                        ['Word', 'No.apperances', { role: 'style' }],
                                        ...this.state.word_sentiment_negative_competitor
                                    ]:[]}
                                    options={{
                                        title: 'Most recurrent negative words',
                                        legend: { position: "none" },
                                        backgroundColor: '#ddddd',
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
                                    height={'200px'}
                                    chartType="BarChart"
                                    loader={<div>Loading Chart</div>}
                                    data={this.state.word_sentiment_positive_competitor?[
                                        ['Word', 'No.apperances', { role: 'style' }],
                                        ...this.state.word_sentiment_positive_competitor
                                    ]:[]}
                                    options={{
                                        title: 'Most recurrent positive words',
                                        legend: { position: "none" },
                                        backgroundColor: '#ddddd',
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
                                
                                </div><div className="vertical">
                                <div className="inline-charts"> 
                                <Chart
                                    width={'250px'}
                                    height={'200px'}
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
                                            fill: '#ddddd',
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
                                    height={'200px'}
                                    chartType="LineChart"
                                    loader={<div>Loading Chart</div>}

                                    data={this.state.timelineCompetitor?[
                                        ['date', 'count'],
                                         ...this.state.timelineCompetitor
                                    ]:[]
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
                            </div>
                        </div>
                    </div>
                </section>
            </div>);
    }
}
export default withRouter(Competitor)