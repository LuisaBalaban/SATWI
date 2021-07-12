import React from 'react';
import { withRouter } from 'react-router-dom';
import '../index.css';
import TweetEmbed from 'react-tweet-embed'
import Chart from "react-google-charts";
import "jspdf-autotable";
import { TwitterMentionButton, TwitterHashtagButton } from 'react-twitter-embed';

class Account extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

            mostFollwedAccounts: this.props.location.state.mostFollwedAccounts,
            hashtagsListAccount: this.props.location.state.hashtagsListAccount,
            negativeTweets: this.props.location.state.negativeTweets,
            countPozAcc: this.props.location.state.countPozAcc,
            countNegAcc: this.props.location.state.countNegAcc,
            mostNegativeTweets: this.props.location.state.mostNegativeTweets,
            timelineAccount: this.props.location.state.timelineAccount,
            userId: this.props.location.state.userId

        }
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            mostFollwedAccounts: nextProps.mostFollwedAccounts,
            hashtagsListAccount: nextProps.hashtagsListAccount,
            negativeTweets: nextProps.negativeTweets,
            countPozAcc: nextProps.countPozAcc,
            countNegAcc: nextProps.countNegAcc,
            mostNegativeTweets: nextProps.mostNegativeTweets,
            username: nextProps.username,
            timelineAccount: nextProps.timelineAccount,
            userId: nextProps.userId
        })
    }

    render() {
        console.log(this.state.timelineAccount)
        return (
            <div className="vertical" id="board-vertical">
                <div className="box">
                    <div className="vertical" id="vertical-profile">
                        <h1>{this.state.username}'s Twitter account stats</h1>
                        <div className="hidden-proj_board1">
                            <div className="vertical" id="board-vertical">
                                <p>Popular hashtags: </p>
                                {this.state.hashtagsListAccount ? <div className="inline-elems">{this.state.hashtagsListAccount.map(hashtag => hashtag != "['']" ? hashtag != "" ? <TwitterHashtagButton
                                    tag={hashtag}
                                /> : '' : '')}</div> : ''}</div>
                            <div className="vertical" id="board-vertical">
                                <p>Most popular users mentioning @{this.state.username}</p>
                                {this.state.mostFollwedAccounts ? <div>{this.state.mostFollwedAccounts.map(id => <TwitterMentionButton
                                    screenName={id}
                                />)}</div> : ''}</div> <div className="vertical" id="tweets-group">
                                <p>Most negative tweets</p>
                                <div className="inline-charts">
                                    {this.state.mostNegativeTweets ? this.state.mostNegativeTweets.slice(0, 2).map(s => <TweetEmbed options={{ cards: 'hidden' }} id={s} />) : ''}</div></div>
                        </div>
                        <div className="hidden-proj_board1">

                            {this.state.countPozAcc ?
                                <Chart
                                    width={'150px'}
                                    height={'200px'}
                                    chartType="PieChart"
                                    loader={<div>Loading Chart</div>}
                                    data={[
                                        ['Tweet', 'Sentiment'],
                                        ['Negative', this.state.countNegAcc],
                                        ['Positive', this.state.countPozAcc]
                                    ]}
                                    options={{
                                        title: 'Sentiment partition',
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
                            : ''}
                            {this.state.timelineAccount? this.state.timelineAccount.length > 0 ? <Chart id="timeline-account"
                                width={'480px'}
                                height={'350px'}
                                chartType="LineChart"
                                loader={<div>Loading Chart</div>}

                                data={[
                                    ['date', 'count positive tweets', 'count negative tweets'],
                                    ...this.state.timelineAccount
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
                            /> : "Not enough data" : ""}
                            {this.state.mostNegativeTweets ? this.state.mostNegativeTweets.slice(2, 4).map(s => <TweetEmbed options={{ cards: 'hidden' }} id={s} />) : ''}
                        </div>
                    </div>
                </div></div>
        )
    }
}
export default withRouter(Account)