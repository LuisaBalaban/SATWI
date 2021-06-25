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
import { jsPDF } from "jspdf";
import google from 'google-charts'
import "jspdf-autotable";

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            exportpdf: false,
            fetchedData: false,
            userId: this.props.location.state.userId,
            isLogin: this.props.location.state.isLogin,
            username: this.props.location.state.username,
            name: this.props.location.state.name,
            profilePic: this.props.location.state.profile,
            email: this.props.location.state.email,
            noProjects: this.props.location.state.noProjects,
            boardsId: this.props.location.state.boardsId,
            feature1: this.props.location.state.feature1,
            feature2: this.props.location.state.feature2,
            feature3: this.props.location.state.feature3,
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
            countPoz1: this.props.location.state.isLogin ? 0 : this.props.location.state.countPoz1,
            countNeg1: this.props.location.state.isLogin ? 0 : this.props.location.state.countNeg1,
            count_retweets1: this.props.location.state.isLogin ? '' : this.props.location.state.count_retweets1,
            count_tweets1: this.props.location.state.isLogin ? '' : this.props.location.state.count_tweets1,
            polarityValues1: this.props.location.state.isLoginn ? [] : this.props.location.state.polarityValues1,
            max_followers1: this.props.location.state.isLogin ? '' : this.props.location.state.max_followers1,
            all_followers1: this.props.location.state.isLogin ? '' : this.props.location.state.all_followers1,
            most_used_hashtag1: this.props.location.state.isLogin ? '' : this.props.location.state.most_used_hashtag1,
            resultedTweets1: [],
            tweets1: this.props.location.state.isLogin ? '' : this.props.location.state.tweets1,
            bubble_chart_data1: this.props.location.state.isLogin ? [] : [],
            trigger1: this.props.location.state.trigger1,
            avgPolarityTrigger1: this.props.location.state.isLogin ? '' : this.props.location.state.avgPolarityTrigger1,
            impactedFollowersTrigger1: this.props.location.state.isLogin ? '' : this.props.location.state.impactedFollowersTrigger1,
            hashtagTrigger1: this.props.location.state.isLogin ? 'No associated hashtags' : this.props.location.state.hashtagTrigger1,
            mostFollowedTrigger1: this.props.location.state.isLogin ? '' : this.props.location.state.mostFollowedTrigger1,
            timeline1: this.props.location.state.isLogin ? [] : [],
            mostRetweetedTrigger1: this.props.location.state.isLogin ? '' : this.props.location.state.mostRetweetedTrigger1,
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
            hashtagTrigger2: this.props.location.state.hashtagTrigger2 ? this.props.location.state.hashtagTrigger2 : 'No associated hashtags',
            mostFollowedTrigger2: this.props.location.state.mostFollowedTrigger2,
            timeline2: this.props.location.state.timeline2,

            //project 3
            projectName3: this.props.location.state.projectName3,
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
            hashtagTrigger3: this.props.location.state.hashtagTrigger3 ? this.props.location.state.hashtagTrigger3 : "No associated hashtag",
            mostFollowedTrigger3: this.props.location.state.mostFollowedTrigger3,
            timeline3: this.props.location.state.timeline3,

            //competitor
            word_sentiment_negative_competitor: this.props.location.state.word_sentiment_negative_competitor ? this.props.location.state.word_sentiment_negative_competitor : [],
            word_sentiment_positive_competitor: this.props.location.state.word_sentiment_positive_competitor ? this.props.location.state.word_sentiment_positive_competitor : [],
            countPozCompetitor: this.props.location.state.countPozCompetitor ? this.props.location.state.countPozCompetitor : 0,
            countNegCompetitor: this.props.location.state.countNegCompetitor ? this.props.location.state.countNegCompetitor : 0,
            timelineCompetitor: this.props.location.state.timelineCompetitor ? this.props.location.state.timelineCompetitor[0] : [],

            //ids
            projId2: this.props.location.state.projId2,
            projId1: this.props.location.state.projId1,
            projId3: this.props.location.state.projId3,

            featureTweets: [],
            triggerTweets: [],

            projects: []
        }
        this.goToProfile = this.goToProfile.bind(this);
    }

    fetchUsers() {

        console.log("making db request")

        fetch("http://127.0.0.1:5000/boardStats", {
            method: "POST",
            body: JSON.stringify({
                projId1: this.state.projId1,
                projId2: this.state.projId2,
                projId3: this.state.projId3,
                noProjects: this.state.noProjects,
                boardsId: this.state.boardsId,
                feature1: this.state.feature1,
                feature2: this.state.feature2,
                feature3: this.state.feature3,
                trigger1: this.state.trigger1,
                trigger2: this.state.trigger2,
                trigger3: this.state.trigger3,
                competitor: this.state.competitor,
                projectName1: this.state.projectName1,
                projectName2: this.state.projectName2,
                projectName3: this.state.projectName3

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
                this.setState({
                    fetchedData: true,
                    avgPolarityTrigger1: json.body[this.state.projId1][this.state.trigger1].averageTriggerPolarity,
                    bubble_chart_data1: json.body[this.state.projId1][this.state.feature1].bubble_chart_data,
                    hashtagTrigger1: json.body[this.state.projId1][this.state.trigger1].hashtagsTrigger,
                    polarityValues1: json.body[this.state.projId1][this.state.feature1].polarityVals,
                    word_sentiment_negative_competitor: json.body[this.state.projId1].word_sentiment_negative,
                    word_sentiment_positive_competitor: json.body[this.state.projId1].word_sentiment_positive,
                    countPoz1: json.body[this.state.projId1][this.state.feature1].countPoz,
                    countNeg1: json.body[this.state.projId1][this.state.feature1].countNeg,
                    count_retweets1: (JSON.stringify(json.body[this.state.projId1][this.state.feature1].tweetType).match(/retweet/g) || []).length,
                    count_tweets1: (JSON.stringify(json.body[this.state.projId1][this.state.feature1].tweetType).match(/text/g) || []).length,
                    impactedFollowersTrigger1: json.body[this.state.projId1][this.state.trigger1].allFollowersTrigger,
                    max_followers1: (json.body[this.state.projId1][this.state.trigger1].mostPopularUserTrigger).toString(),
                    mostRetweetedTrigger1: (json.body[this.state.projId1][this.state.trigger1].mostPopularUserTrigger).toString(),
                    timeline1: json.body[this.state.projId1][this.state.trigger1].timeline,


                    avgPolarityTrigger2: json.body[this.state.projId2] ? json.body[this.state.projId2][this.state.trigger2].averageTriggerPolarity : 0,
                    bubble_chart_data2: json.body[this.state.projId2] ? json.body[this.state.projId2][this.state.feature2].bubble_chart_data : 0,
                    hashtagTrigger2: json.body[this.state.projId2] ? json.body[this.state.projId2][this.state.trigger2].hashtagsTrigger : 0,
                    polarityValues2: json.body[this.state.projId2] ? json.body[this.state.projId2][this.state.feature2].polarityVals : [],
                    countPoz2: json.body[this.state.projId2] ? json.body[this.state.projId2][this.state.feature2].countPoz : 0,
                    countNeg2: json.body[this.state.projId2] ? json.body[this.state.projId2][this.state.feature2].countNeg : 0,
                    count_retweets2: json.body[this.state.projId2] ? (JSON.stringify(json.body[this.state.projId2][this.state.feature2].tweetType).match(/retweet/g) || []).length : 0,
                    count_tweets2: json.body[this.state.projId2] ? (JSON.stringify(json.body[this.state.projId2][this.state.feature2].tweetType).match(/text/g) || []).length : 0,
                    impactedFollowersTrigger2: json.body[this.state.projId2] ? json.body[this.state.projId2][this.state.trigger2].allFollowersTrigger : 0,
                    max_followers2: json.body[this.state.projId2] ? (json.body[this.state.projId2][this.state.trigger2].mostPopularUserTrigger).toString() : 0,
                    mostRetweetedTrigger2: json.body[this.state.projId2] ? (json.body[this.state.projId2][this.state.trigger2].mostPopularUserTrigger).toString() : 0,
                    timeline2: json.body[this.state.projId2] ? json.body[this.state.projId2][this.state.trigger2].timeline : [],

                    avgPolarityTrigger3: json.body[this.state.projId3] ? json.body[this.state.projId3][this.state.trigger3].averageTriggerPolarity : 0,
                    bubble_chart_data3: json.body[this.state.projId3] ? json.body[this.state.projId3][this.state.feature3].bubble_chart_data : 0,
                    hashtagTrigger2: json.body[this.state.projId3] ? json.body[this.state.projId3][this.state.trigger3].hashtagsTrigger : 0,
                    polarityValues3: json.body[this.state.projId3] ? json.body[this.state.projId3][this.state.feature3].polarityVals : [],
                    countPoz3: json.body[this.state.projId3] ? json.body[this.state.projId3][this.state.feature3].countPoz : 0,
                    countNeg3: json.body[this.state.projId3] ? json.body[this.state.projId3][this.state.feature3].countNeg : 0,
                    count_retweets3: json.body[this.state.projId3] ? (JSON.stringify(json.body[this.state.projId3][this.state.feature3].tweetType).match(/retweet/g) || []).length : 0,
                    count_tweets3: json.body[this.state.projId3] ? (JSON.stringify(json.body[this.state.projId3][this.state.feature3].tweetType).match(/text/g) || []).length : 0,
                    impactedFollowersTrigger3: json.body[this.state.projId3] ? json.body[this.state.projId3][this.state.trigger3].allFollowersTrigger : 0,
                    max_followers3: json.body[this.state.projId3] ? (json.body[this.state.projId3][this.state.trigger3].mostPopularUserTrigger).toString() : 0,
                    mostRetweetedTrigger3: json.body[this.state.projId3] ? (json.body[this.state.projId3][this.state.trigger3].mostPopularUserTrigger).toString() : 0,
                    timeline3: json.body[this.state.projId3] ? json.body[this.state.projId3][this.state.trigger3].timeline : 0,


                    //competitor
                    timelineCompetitor: json.body[this.state.projId1][this.state.competitor].timelineCountCompetitor,
                    word_sentiment_negative_competitor: json.body[this.state.projId1][this.state.competitor].word_pairings_Competitor_Neg,
                    word_sentiment_positive_competitor: json.body[this.state.projId1][this.state.competitor].word_pairings_Competitor_Pos,
                    countPozCompetitor: json.body[this.state.projId1][this.state.competitor].countPozCompetitor,
                    countNegCompetitor: json.body[this.state.projId1][this.state.competitor].countNegCompetitor,


                })
                console.log(this.state.word_sentiment_negative_competitor)
                console.log(this.state.timeline1)
                console.log(json.body[this.state.projId1].timelineCountCompetitor)

            })
    }


    componentDidMount() {
        this.fetchUsers();
        this.timer = setInterval(() => this.fetchUsers(), 30000);
        //console.log(this.state.projId1)
    }


    componentWillUnmount() {
        clearInterval(this.timer);
    }
    goToProfile() {
        this.props.history.push({
            pathname: '/profile',
            state: {
                username: this.state.username,
                userId: this.state.userId,
                email: this.state.email,
                name: this.state.name,
                isLogin: this.state.isLogin,
                profilePic: this.state.profile,
                email: this.state.email,
                noProjects: this.state.noProjects,
                projId1: this.state.projId1,
                projId2: this.state.projId2,
                projId3: this.state.projId3,
                boardsId: this.state.boardsId,
                feature1: this.state.feature1,
                feature2: this.state.feature2,
                feature3: this.state.feature3,
                projectName1: this.state.projectName1,
                projectName2: this.state.projectName2,
                projectName3: this.state.projectName3,
                trigger1: this.state.trigger1,
                trigger2: this.state.trigger2,
                trigger3: this.state.trigger3,
                competitor: this.state.competitor,
                userId: this.state.userId,
                TwitterHandle: this.state.username
            }
        })
    }


    generatePDF(pdfs) {
        console.log(pdfs)
        console.log(pdfs.date1)
        const doc = new jsPDF();
        let pageHeight = doc.internal.pageSize.height;
        const tableColumnFeature1 = ["Info", "Value"];
        const tableRowsFeature1 = [["Data collected since ", this.state.date1], ["Tweets of type: retweet", this.state.count_retweets1], ["Tweets of type: text", this.state.count_tweets1], ["Negative Tweets count", this.state.countNeg1], ["Positive tweets count", this.state.countPoz1]]
        const tableColumnTrigger1 = ["Info", "Value"];
        const tableRowsTrigger1 = [["Data collected since ", this.state.date1], ["Average polarity", this.state.avgPolarityTrigger1], ["Reached users", this.state.impactedFollowersTrigger1], ["Associated hastags", this.state.hashtagTrigger1]]
        const date = Date().split(" ");
        const dateStr = date[0] + date[1] + date[2] + date[3] + date[4];
        // ticket title. and margin-top + margin-left
        doc.text("General report", 14, 15);
        doc.text("Project 1. " + this.state.projectName1, 20, 25);
        doc.text("Feature " + this.state.feature1, 20, 35);
        doc.autoTable(tableColumnFeature1, tableRowsFeature1, { startY: 40 });
        doc.setFont("helvetica");
        doc.setFontSize(9);
        doc.text("Most poplar users mentioning the feature:" + " ", 20, 100)
        const tableColumnBubbleChart1 = ["Word", "Average polarity"]
        const tableRowsBubbleChart1 = []
        this.state.bubble_chart_data1.map(item => {
            if (item[1] > 0, 7 || item[1] < 0, 3)
                tableRowsBubbleChart1.push(item)
        })
        doc.text("Most notable words associated with the feature ", 20, 105);
        doc.autoTable(tableColumnBubbleChart1, tableRowsBubbleChart1, {
            startY: 110,
            tableWidth: 100
        })
        doc.text("Trigger: " + this.state.trigger1, 20, 210);
        doc.autoTable(tableColumnTrigger1, tableRowsTrigger1, { startY: 215 });
        const tableRowsCompetitorPositive = []
        const tableColumnCompetitorPositive = ["Word", "No. of appereances"]
        
        let y=350
        if (y >= pageHeight) {
            doc.addPage();
            y = 30
        }
        doc.text("Competitor: " + this.state.competitor, 20, y);
        if (this.state.word_sentiment_positive_competitor != []) {
            doc.text("Most frequent positive associated words with the competitor: " + this.state.competitor, 20, y+10);
            this.state.word_sentiment_positive_competitor.map(item => {
                if (item[1] > 5)
                    tableRowsCompetitorPositive.push(item)
            })
            doc.autoTable(tableColumnCompetitorPositive, tableRowsCompetitorPositive, {
                startY: y+20,
                tableWidth: 50
            });
        }
        else {
            doc.text("Not enough data. ", 20, y+10);
        }

        if (this.state.word_sentiment_negative_competitor != []) {
            const tableRowsCompetitorNegative = []
            this.state.word_sentiment_negative_competitor.map(item => {
                if (item[1] > 3)
                    tableRowsCompetitorNegative.push(item)
            })
            doc.text("Most frequent negative associated words with the competitor: " + this.state.competitor, 20, y+110);
            doc.autoTable(tableColumnCompetitorPositive, tableRowsCompetitorNegative, {
                startY: y+120,
                tableWidth: 50
            });
        }
        else {
            doc.text("Not enough data. ", 20, y+110);
        }
        doc.text("Sentiment partition of competitor tweets", 20, y+150);
        const tableColumnCompetitorPoz = ["Info", "Value"];
        const tableRowsCompetitorPoz = [["Count positive", this.state.countPozCompetitor], ["Count negative", this.state.countNegCompetitor]]
        doc.autoTable(tableColumnCompetitorPoz, tableRowsCompetitorPoz, {
            startY: y+160,
            tableWidth: 50
        });
        
        if(this.state.noProjects>=2)
        { let y=350
            if (y >= pageHeight) {
                doc.addPage();
                y = 30
            }
            console.log(pdfs)
            console.log(pdfs.date2)
           
            const tableColumnFeature1 = ["Info", "Value"];
            const tableRowsFeature1 = [["Data collected since ", this.state.date2], ["Tweets of type: retweet", this.state.count_retweets2], ["Tweets of type: text", this.state.count_tweets2], ["Negative Tweets count", this.state.countNeg2], ["Positive tweets count", this.state.countPoz2]]
            const tableColumnTrigger1 = ["Info", "Value"];
            const tableRowsTrigger1 = [["Data collected since ", this.state.date2], ["Average polarity", this.state.avgPolarityTrigger2], ["Reached users", this.state.impactedFollowersTrigger2], ["Associated hastags", this.state.hashtagTrigger2]]
            // ticket title. and margin-top + margin-left
            doc.text("General report", 14, 15);
            doc.text("Project 1. " + this.state.projectName2, 20, 25);
            doc.text("Feature " + this.state.feature2, 20, 35);
            doc.autoTable(tableColumnFeature1, tableRowsFeature1, { startY: 40 });
            doc.setFont("helvetica");
            doc.setFontSize(9);
            doc.text("Most poplar users mentioning the feature:" + " ", 20, 100)
            const tableColumnBubbleChart1 = ["Word", "Average polarity"]
            const tableRowsBubbleChart1 = []
            this.state.bubble_chart_data2.map(item => {
                if (item[1] > 0, 7 || item[1] < 0, 3)
                    tableRowsBubbleChart1.push(item)
            })
            doc.text("Most notable words associated with the feature ", 20, 105);
            doc.autoTable(tableColumnBubbleChart1, tableRowsBubbleChart1, {
                startY: 110,
                tableWidth: 100
            })
            doc.text("Trigger: " + this.state.trigger2, 20, 210);
            doc.autoTable(tableColumnTrigger1, tableRowsTrigger1, { startY: 215 });
        }
        if(this.state.noProjects===3)
        {
            let y=350
            if (y >= pageHeight) {
                doc.addPage();
                y = 30
            }
            console.log(pdfs)
            console.log(pdfs.date3)
           
            
            const tableColumnFeature1 = ["Info", "Value"];
            const tableRowsFeature1 = [["Data collected since ", this.state.date3], ["Tweets of type: retweet", this.state.count_retweets3], ["Tweets of type: text", this.state.count_tweets3], ["Negative Tweets count", this.state.countNeg3], ["Positive tweets count", this.state.countPoz3]]
            const tableColumnTrigger1 = ["Info", "Value"];
            const tableRowsTrigger1 = [["Data collected since ", this.state.date3], ["Average polarity", this.state.avgPolarityTrigger3], ["Reached users", this.state.impactedFollowersTrigger3], ["Associated hastags", this.state.hashtagTrigger3]]
            doc.text("General report", 14, 15);
            doc.text("Project 1. " + this.state.projectName3, 20, 25);
            doc.text("Feature " + this.state.feature3, 20, 35);
            doc.autoTable(tableColumnFeature1, tableRowsFeature1, { startY: 40 });
            doc.setFont("helvetica");
            doc.setFontSize(9);
            doc.text("Most poplar users mentioning the feature:" + " ", 20, 100)
            const tableColumnBubbleChart1 = ["Word", "Average polarity"]
            const tableRowsBubbleChart1 = []
            this.state.bubble_chart_data3.map(item => {
                if (item[1] > 0, 7 || item[1] < 0, 3)
                    tableRowsBubbleChart1.push(item)
            })
            doc.text("Most notable words associated with the feature ", 20, 105);
            doc.autoTable(tableColumnBubbleChart1, tableRowsBubbleChart1, {
                startY: 110,
                tableWidth: 100
            })
            doc.text("Trigger: " + this.state.trigger3, 20, 210);
            doc.autoTable(tableColumnTrigger1, tableRowsTrigger1, { startY: 215 });
            
          
        }
        doc.save(`report_${dateStr}.pdf`);
    };



    render() {
        console.log("RECEIVED ATTRIBUTES")
        console.log(this.state.projId1)

        //  this.state.resultedTweets = this.state.tweets1.map(s => ([s]))
        return (
            <div>
                <nav>
                    <p id="welcome-message">Welcome back to your board {this.state.name}!</p>
                    <ul id="navbar">

                        <li id="listElem"><a onClick={() => this.generatePDF(this.state)}>Export general report</a></li>

                        <li id="listElem"><a onClick={this.goToProfile}>Profile</a></li>

                    </ul>
                </nav>
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
                                                data={this.state.polarityValues1 ? [
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


                                            {this.state.bubble_chart_data1[0] ? <Chart
                                                id="chart-bubble"
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
                                                rootProps={{ 'data-testid': '1' }} /> : "Not enough data"}
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



                        <div>{this.state.noProjects >= 2 ? <ProjectMenu2
                            countPoz2={this.state.countPoz2}
                            countNeg2={this.state.countNeg2}
                            count_retweets2={this.state.count_retweets2}
                            count_tweets2={this.state.count_tweets2}
                            polarityValues2={this.state.polarityValues2}
                            max_followers2={this.state.max_followers2}
                            all_followers2={this.state.all_followers2}
                            most_used_hashtag2={this.state.most_used_hashtag2}
                            bubble_chart_data2={this.state.bubble_chart_data2}
                            trigger2={this.state.trigger2}
                            avgPolarityTrigger2={this.state.avgPolarityTrigger2}
                            impactedFollowersTrigger2={this.state.impactedFollowersTrigger2}
                            hashtagTrigger2={this.state.hashtagTrigger2}
                            mostFollowedTrigger2={this.state.mostFollowedTrigger2}
                            projectName2={this.state.projectName2}
                            feature2={this.state.feature2}
                            date2={this.state.date2}
                            timeline2={this.state.timeline2}
                            mostRetweetedTrigger2={this.state.mostRetweetedTrigger2} /> : ''}</div>
                        <div>{this.state.noProjects == 3 ? <ProjectMenu3 countPoz3={this.state.countPoz3}
                            countNeg3={this.state.countNeg3}
                            count_retweets3={this.state.count_retweets3}
                            count_tweets3={this.state.count_tweets3}
                            polarityValues3={this.state.polarityValues3}
                            max_followers3={this.state.max_followers3}
                            all_followers3={this.state.all_followers3}
                            most_used_hashtag3={this.state.most_used_hashtag3}
                            bubble_chart_data3={this.state.bubble_chart_data3}
                            trigger3={this.state.trigger3}
                            avgPolarityTrigger3={this.state.avgPolarityTrigger3}
                            impactedFollowersTrigger3={this.state.impactedFollowersTrigger3}
                            hashtagTrigger3={this.state.hashtagTrigger3}
                            mostFollowedTrigger3={this.state.mostFollowedTrigger3}
                            projectName3={this.state.projectName3}
                            feature3={this.state.feature3}
                            date3={this.state.date3}
                            timeline3={this.state.timeline3}
                            mostRetweetedTrigger3={this.state.mostRetweetedTrigger3} /> : ''}</div>
                        <div>{this.state.competitor ? <Competitor word_sentiment_positive_competitor={this.state.word_sentiment_positive_competitor} word_sentiment_negative_competitor={this.state.word_sentiment_negative_competitor} countPozCompetitor={this.state.countPozCompetitor} countNegCompetitor={this.state.countNegCompetitor}
                            timelineCompetitor={this.state.timelineCompetitor} /> : ''}</div>
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