import React from 'react';
import { withRouter } from 'react-router-dom';
import '../index.css';
import Modal from './Modal.js';
import leftArrowSmall from '../images/left-arrow.png'
import { jsPDF } from "jspdf";
import "jspdf-autotable";

class UserProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: this.props.location.state.username,
            userId: this.props.location.state.userId,
            name: this.props.location.state.name,
            imageUrl: this.props.location.state.profile,
            email: this.props.location.state.email,
            noProjects: this.props.location.state.noProjects,
            boardsId: this.props.location.state.boardsId,
            feature1: this.props.location.state.feature1,
            feature2: this.props.location.state.feature2,
            feature3: this.props.location.state.feature3,
            projectName1: this.props.location.state.projectName1,
            projectName2: this.props.location.state.projectName2,
            projectName3: this.props.location.state.projectName3,
            trigger1: this.props.location.state.trigger1,
            trigger2: this.props.location.state.trigger2,
            trigger3: this.props.location.state.trigger3,
            competitor: this.props.location.state.competitor,
            projId1: this.props.location.state.projId1,
            projId2: this.props.location.state.projId2,
            projId3: this.props.location.state.projId3,
            profilePic: "",
            ReceiveRecommendations: 0,
            ReceiveMonthlyReport: 0,
            ReceiveEmails: 0,
            projects: {},
            createdAt: '',
            TwitterHandle: this.props.location.state.TwitterHandle,
            show: false,
            avgPolarityTrigger1: 0,
            bubble_chart_data1: [],
            hashtagTrigger1: [],
            polarityValues1: [],
            word_sentiment_negative_competitor: [],
            word_sentiment_positive_competitor: [],
            countPoz1: 0,
            countNeg1: 0,
            count_retweets1: 0,
            count_tweets1: 0,
            impactedFollowersTrigger1: 0,
            max_followers1: 0,
            mostRetweetedTrigger1: '',
            timeline1: [],
      

        }
        this.exportProject1 = this.exportProject1.bind(this)
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.goBack = this.goBack.bind(this)
        this.handleChangeMonthlyReport = this.handleChangeMonthlyReport.bind(this)
        this.handleChangePersonalizedRecommandations = this.handleChangePersonalizedRecommandations.bind(this)
        this.handleChangeReceiveEmails = this.handleChangeReceiveEmails.bind(this)
    }
    fetchUsers() {
        fetch("http://127.0.0.1:5000/userInfo", {
            method: "POST",
            body: JSON.stringify({
                userId: this.state.userId
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
                    username: json.body["username"],
                    phone: json.body["phone"],
                    email: json.body["email"],
                    createdAt: json.body["createdAt"],
                    profilePic: json.body["profilePic"],
                    ReceiveRecommendations: json.body["ReceiveRecommendations"],
                    ReceiveEmails: json.body["ReceiveEmails"],
                    ReceiveMonthlyReport: json.body["ReceiveMonthlyReport"],
                    competitor: json.body["competitor"],
                    boardid: json.body["boardid"],
                    projects: json.body["projects"],
                    projectName1: json.body["projects"][0][1],
                    feature1: json.body["projects"][0][2],
                    trigger: json.body["projects"][0][3],
                    TwitterHandle: json.body["TwitterHandle"],
                    projId1: json.body["projects"][0][0],
                    projId2: json.body["projects"][1] ? json.body["projects"][1][0] : '',
                    projId3: json.body["projects"][2] ? json.body["projects"][2][0] : '',
                    projectName2: json.body["projects"][1] ? json.body["projects"][1][1] : '',
                    projectName3: json.body["projects"][2] ? json.body["projects"][2][1] : '',
                    feature2: json.body["projects"][1] ? json.body["projects"][1][2] : '',
                    feature3: json.body["projects"][2] ? json.body["projects"][2][2] : '',
                    trigger2: json.body["projects"][1] ? json.body["projects"][1][3] : '',
                    trigger3: json.body["projects"][2] ? json.body["projects"][2][3] : '',
                   
                })
            })
    }


    showModal = () => {
        this.setState({ show: true });
        console.log(this.state.show)
    };

    hideModal = () => {
        this.setState({ show: false });
        console.log(this.state.show)
    };

    componentDidMount() {
        this.fetchUsers();
    }
    goBack() {
        this.props.history.push({
            pathname: '/board',
            state: {
                name: this.state.name,
                userId: this.state.userId,
                email: this.state.email,
                name: this.state.name,
                isLogin: this.state.isLogin,
                profilePic: this.state.profile,
                email: this.state.email,
                noProjects: this.state.noProjects,
                noProjects: this.state.noProjects,
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
                projId1: this.state.projId1,
                projId2: this.state.projId2,
                projId3: this.state.projId3,
                username: this.state.TwitterHandle,

            }
        })
    }
    handleChangeMonthlyReport() {
        this.setState({ ReceiveMonthlyReport: !this.state.ReceiveMonthlyReport });
    }
    handleChangePersonalizedRecommandations() {
        this.setState({ ReceiveRecommendations: !this.state.ReceiveRecommendations });
    }
    handleChangeReceiveEmails() {
        this.setState({ ReceiveEmails: !this.state.ReceiveEmails });
    }
    exportProject1 = () => {
        console.log("making db request")
        console.log(this.state.projId1)
        fetch("http://127.0.0.1:5000/boardStats", {
            method: "POST",
            body: JSON.stringify({
                projId1: this.state.projId1,
                noProjects: this.state.noProjects,
                boardsId: this.state.boardsId,
                feature1: this.state.feature1,
                trigger1: this.state.trigger1,
                competitor: this.state.competitor,
                projectName1: this.state.projectName1,
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
                console.log(json);
                this.setState({
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

                }, function () {
                    const doc = new jsPDF();
                    const tableColumnFeature1 = ["Info", "Value"];
                    const tableRowsFeature1 = [["Data collected since ", this.state.date1], ["Tweets of type: retweet", this.state.count_retweets1], ["Tweets of type: text", this.state.count_tweets1], ["Negative Tweets count", this.state.countNeg1], ["Positive tweets count", this.state.countPoz1]]
                    const tableColumnTrigger1 = ["Info", "Value"];
                    const tableRowsTrigger1 = [["Data collected since ", this.state.date1], ["Average polarity", this.state.avgPolarityTrigger1], ["Reached users", this.state.impactedFollowersTrigger1], ["Associated hastags", this.state.hashtagTrigger1]]
                    const date = Date().split(" ");
                    const dateStr = date[0] + date[1] + date[2] + date[3] + date[4];
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

                    doc.save(`report_${dateStr}.pdf`);
                }
                )
            })


    }
    // componentDidUpdate(prevProps, prevState) {
    //     if (this.state.loadedData > prevState.loadedData) {
    //         if (this.state.exportPdf == true) {
    //             //   this.generatePDF();  
    //         }
    //     }
    // }
    render() {
        console.log(this.state.userId)
        console.log(this.state.projId1)
        console.log(this.state.bubble_chart_data1)
        console.log(this.state.loadedData)
        return (
            <div>
                <h1 id="small-title">{this.state.username}'s account</h1>


                <section>
                    <div className="vertical" id="container-projects">
                        <Modal show={this.state.show} handleClose={this.hideModal} projectName1={this.state.projectName1}
                            feature1={this.state.feature1}
                            trigger1={this.state.trigger1}
                            projId1={this.state.projId1}
                            userId={this.state.userId}
                            TwitterHandle={this.state.TwitterHandle}>
                            <p>Modal</p>
                        </Modal>
                        <div id="display-project"  ></div>
                        <h3>Competitor:<i> {this.state.competitor}</i></h3>

                        <h3>Notifications</h3>
                        <div class="containerCheckBoxes">
                            <ul class="ks-cboxtags">
                                <li><input type="checkbox" id="checkboxTwo" value="ReceiveEmails" checked={this.state.ReceiveEmails} onChange={this.handleChangeReceiveEmails} /><label for="checkboxTwo"></label><p>  Receive emails</p></li>
                                <li><input type="checkbox" id="checkboxThree" value="monthlyReport" checked={this.state.monthlyReport} onChange={this.ReceiveMonthlyReport} /><label for="checkboxThree"></label><p>  Autogenerated monthly report</p></li>
                            </ul>
                            <button class="buttonSpecial" onClick={this.goBack}><img id="left-arrow" src={leftArrowSmall} /></button>
                        </div>
                    </div>

                    <div classname="vertical" id="container-profile">
                        <div id="display-project"  >
                            <div id="project-left">
                                <h3>1. <i>{this.state.projectName1}</i></h3>
                                <p>Feature: <b><i>{this.state.feature1}</i></b></p>
                                <p>Trigger: <b><i>{this.state.trigger1}</i></b></p>
                            </div>
                            <button className="profile-button" type="button" onClick={this.showModal}>
                                Modify project
                            </button>
                            <button className="profile-button" onClick={this.exportProject1}>Export report</button>
                        </div>
                        {this.state.noProjects >= 5 ?
                            <div id="container-profile">
                                <div id="display-project" >
                                <div id="project-left">
                                    <h3>2. {this.state.projectName2}</h3>
                                    <p>Feature: <b>{this.state.feature2}</b></p>
                                    <p>Trigger: <b>{this.state.trigger2}</b></p>
                                    </div>
                                    <button className="profile-button" type="button" onClick={this.showModal}>
                                    Modify project
                                </button>
                                <button className="profile-button" onClick={this.exportProject2}>Export report</button>
                                </div>
                               
                            </div>
                            : ""}
                       {this.state.noProjects == 3 ?
                            <div id="container-profile">
                                <div id="display-project" >
                                <div id="project-left">
                                    <h3>3. {this.state.projectName3}</h3>
                                    <p>Feature: <b>{this.state.feature3}</b></p>
                                    <p>Trigger: <b>{this.state.trigger3}</b></p>
                                    </div>
                                    <button className="profile-button" type="button" onClick={this.showModal}>
                                    Modify project
                                </button>
                                <button className="profile-button" onClick={this.exportProject3}>Export report</button>
                                </div>
                               
                            </div>
                            : ""}

                    </div>
                    <div className="vertical" id="container-profile">

                        <div className="display-profile" >
                            <div className="centered-profile">
                                <img id="profile-pic" src={this.state.profilePic} alt="profile pic" />
                                <h3>{this.state.username}</h3>
                            </div>
                            <h5>Email: {this.state.email}</h5>
                            <h5>phone number: {this.state.phoneNo}</h5>
                            <h5>Twitter Handle: @{this.state.TwitterHandle}</h5>
                            <h5>Account created: {this.state.createdAt}</h5>
                            <div className="centered-profile">
                                <button className="profile-button" >Delete Account</button>
                            </div>
                        </div>
                    </div>


                </section>
            </div>)
    }
}
export default withRouter(UserProfile)