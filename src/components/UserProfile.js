import React from 'react';
import { withRouter } from 'react-router-dom';
import '../index.css';
import Modal from './Modal.js';
import leftArrowSmall from '../images/left-arrow.png'
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

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
            timelineId:this.props.location.state.timelineId,
            profilePic: "",
            ReceiveNotifications: 0,
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
            projectNo: 0


        }
        this.exportProject = this.exportProject.bind(this)
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.goBack = this.goBack.bind(this)
        this.handleChangeMonthlyReport = this.handleChangeMonthlyReport.bind(this)
        this.handleChangeNotifications = this.handleChangeNotifications.bind(this)
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
                    ReceiveNotifications: json.body["ReceiveRecommendations"]==1? true : false,
                    ReceiveEmails: json.body["ReceiveEmails"]==1? true : false,
                    ReceiveMonthlyReport: json.body["ReceiveMonthlyReport"],
                    competitor: json.body["competitor"],
                    boardsId: json.body["boardid"],
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


    showModal = (e) => {
        this.setState({
            show: true,
            projectNo: e.target.value
        });
        console.log(this.state.projectNo)
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
    handleChangeNotifications() {
       
        fetch("http://127.0.0.1:5000/userNotifications", {
            method: "POST",
            body: JSON.stringify({
                type:"notifications",
                userId:this.state.userId,
                ReceiveNotifications: !this.state.ReceiveNotifications
            }),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
        }
        ).then(response => {
            console.log(response)
        
        })
        this.setState({ ReceiveNotifications: !this.state.ReceiveNotifications });
    }
    handleChangeReceiveEmails() {
       
        fetch("http://127.0.0.1:5000/userNotifications", {
            method: "POST",
            body: JSON.stringify({
                type:"emails",
                userId:this.state.userId,
                ReceiveEmails:!this.state.ReceiveEmails
            }),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
        }
        ).then(response => {
            console.log(response)
        
        })
        this.setState({ ReceiveEmails: !this.state.ReceiveEmails });
    }
    exportProject = (e) => {
        console.log(e.target.value)
        console.log(this.state.timelineId)
        const proj = e.target.value
        console.log("making db request")
        console.log(this.state.projId1)
        fetch("http://127.0.0.1:5000/boardStats", {
            method: "POST",
            body: JSON.stringify({
                projId1: e.target.value > 1 ? e.target.value > 2 ? this.state.projId3 : this.state.projId2 : this.state.projId1,
                noProjects: 1,
                boardsId: this.state.boardsId,
                feature1: e.target.value > 1 ? e.target.value > 2 ? this.state.feature3 : this.state.feature2 : this.state.feature1,
                trigger1: e.target.value > 1 ? e.target.value > 2 ? this.state.trigger3 : this.state.trigger2 : this.state.trigger1,
                competitor: this.state.competitor,
                projectName1: e.target.value > 1 ? e.target.value > 2 ? this.state.projectName3 : this.state.projectName2 : this.state.projectName1,
                username:this.state.username,
                timelineId:this.state.timelineId
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
                let projectTrigger;
                let projectId;
                let projFeature;
                let projectName;
                if (proj > 1) {
                    projectId = this.state.projId2
                    projectTrigger = this.state.trigger2
                    projFeature = this.state.feature2
                    projectName = this.state.projectName2
                    if (proj > 2) {
                        projectId = this.state.projId3
                        projectTrigger = this.state.trigger3
                        projFeature = this.state.feature3
                        projectName = this.state.projectName3
                    }
                }
                else {
                    projectId = this.state.projId1
                    projectTrigger = this.state.trigger1
                    projFeature = this.state.feature1
                    projectName = this.state.projectName1
                }
                this.setState({
                    avgPolarityTrigger1: json.body[projectId][projectTrigger].averageTriggerPolarity,
                    bubble_chart_data1: json.body[projectId][projFeature].bubble_chart_data,
                    hashtagTrigger1: json.body[projectId][projectTrigger].hashtagsTrigger,
                    polarityValues1: json.body[projectId][projFeature].polarityVals,
                    word_sentiment_negative_competitor: json.body[projectId].word_sentiment_negative,
                    word_sentiment_positive_competitor: json.body[projectId].word_sentiment_positive,
                    countPoz1: json.body[projectId][projFeature].countPoz,
                    countNeg1: json.body[projectId][projFeature].countNeg,
                    count_retweets1: (JSON.stringify(json.body[projectId][projFeature].tweetType).match(/retweet/g) || []).length,
                    count_tweets1: (JSON.stringify(json.body[projectId][projFeature].tweetType).match(/text/g) || []).length,
                    impactedFollowersTrigger1: json.body[projectId][projectTrigger].allFollowersTrigger,
                    max_followers1: (json.body[projectId][projectTrigger].mostPopularUserTrigger).toString(),
                    mostRetweetedTrigger1: (json.body[projectId][projectTrigger].mostPopularUserTrigger).toString(),
                    timeline1: json.body[projectId][projectTrigger].timeline,

                }, function () {
                    const doc = new jsPDF();
                    const tableColumnFeature1 = ["Info", "Value"];
                    const tableRowsFeature1 = [["Data collected since ", this.state.date1], ["Tweets of type: retweet", this.state.count_retweets1], ["Tweets of type: text", this.state.count_tweets1], ["Negative Tweets count", this.state.countNeg1], ["Positive tweets count", this.state.countPoz1]]
                    const tableColumnTrigger1 = ["Info", "Value"];
                    const tableRowsTrigger1 = [["Data collected since ", this.state.date1], ["Average polarity", this.state.avgPolarityTrigger1], ["Reached users", this.state.impactedFollowersTrigger1], ["Associated hastags", this.state.hashtagTrigger1]]
                    const date = Date().split(" ");
                    const dateStr = date[0] + date[1] + date[2] + date[3] + date[4];
                    doc.text("Individual Project report", 14, 15);
                    doc.setFontSize(15);
                    doc.text("" + projectName, 20, 25);
                    doc.text("Feature " + projFeature, 20, 35);
                    doc.autoTable(tableColumnFeature1, tableRowsFeature1, { startY: 40 });
                    doc.setFont("helvetica");
                    doc.setFontSize(9);
                    doc.text("Most poplar users mentioning the feature:" + " ", 20, 100)
                    const tableColumnBubbleChart1 = ["Word", "Average polarity"]
                    var bubble_chart_1=[]
        bubble_chart_1=this.state.bubble_chart_data1.sort(function(a, b) {
            return b[1] - a[1];
          })
        doc.text("Most notable words associated with the feature ", 20, 105);
        var tableRows1=[]
        var tableRows2=[]
        tableRows1=bubble_chart_1.slice(0,5)
        console.log(tableRows1)
        tableRows2=bubble_chart_1.slice(-5)
        tableRows1.concat(tableRows2)
        console.log(bubble_chart_1)
        doc.autoTable(tableColumnBubbleChart1, tableRows1, {
            startY: 110,
            tableWidth: 100
        })
        doc.setFontSize(15);
                    doc.text("Trigger: " + projectTrigger, 20, 210);
                    doc.setFontSize(9);
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

        console.log(this.state.noProjects)
        console.log("PRINTING NOTIF")
        console.log(this.state.ReceiveEmails)
        console.log(this.state.ReceiveNotifications) 
               return (
            <div classname="body-board">
                <h1 id="small-title">{this.state.username}'s account</h1>


                <section>
                    <div className="vertical" id="container-projects">
                        <div>{this.state.projectNo > 1 ? this.state.projectNo > 2 ? this.state.projectNo == 5 ?
                            <Modal
                                show={this.state.show} handleClose={this.hideModal}
                                competitor={this.state.competitor}
                                boardId={this.state.boardsId}
                                projId={this.state.projId1}
                                TwitterHandle={this.state.TwitterHandle} /> :
                            <Modal
                                projectNo={this.state.projectNo} show={this.state.show} handleClose={this.hideModal}
                                boardId={this.state.boardsId}
                                projectName={this.state.projectName3}
                                feature={this.state.feature3}
                                trigger={this.state.trigger3}
                                userId={this.state.userId}
                                projId={this.state.projId3}
                                TwitterHandle={this.state.TwitterHandle} /> :
                            <Modal projectNo={this.state.projectNo} show={this.state.show} handleClose={this.hideModal}
                                projectName={this.state.projectName2}
                                feature={this.state.feature2}
                                trigger={this.state.trigger2}
                                boardId={this.state.boardsId}
                                userId={this.state.userId}
                                projId={this.state.projId2}
                                TwitterHandle={this.state.TwitterHandle} /> :
                            <Modal projectNo={this.state.projectNo} show={this.state.show} handleClose={this.hideModal}
                                projectName={this.state.projectName1}
                                feature={this.state.feature1}
                                boardId={this.state.boardsId}
                                trigger={this.state.trigger1}
                                userId={this.state.userId}
                                projId={this.state.projId1}
                                TwitterHandle={this.state.TwitterHandle} />}
                        </div>
                        <div id="display-project"  >
                            <h3>Competitor:<i> {this.state.competitor}</i><button className="profile-button" type="button" value="5" id="button-competitor" onClick={this.showModal}>
                                Modify
                            </button></h3>
                        </div>
                        <h3>Notifications</h3>
                        <div id="containerCheckBoxes">   
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={this.state.ReceiveEmails}
                                    onChange={this.handleChangeReceiveEmails}
                                    name="receiveEmails"
                                    color="#af88d3"
                                />
                            }
                            label={<span style={{ fontSize: '1.5rem' ,fontFamily: 'Reem Kufi'}}>Receive emails</span>}
                        />
                         {/* <FormControlLabel
                            control={
                                <Checkbox
                                    checked={this.state.ReceiveMonthlyReport}
                                    onChange={this.handleChangeMonthlyReport}
                                    name="ReceiveMonthlyReport"
                                    color="#af88d3"
                                />
                            }
                            label={<span style={{ fontSize: '1.5rem',fontFamily: 'Reem Kufi' }}>Receive monthly report</span>}
                        /> */}
                             <FormControlLabel
                            control={
                                <Checkbox
                                    checked={this.state.ReceiveNotifications}
                                    onChange={this.handleChangeNotifications}
                                    name="Receive recommendations"
                                    color="#af88d3"
                                />
                            }
                            label={<span style={{ fontSize: '1.5rem' , fontFamily: 'Reem Kufi'}}>Receive notifications</span>}
                        />
                        </div>
                    </div>

                    <div classname="vertical" id="container-profile">
                        <div id="display-project"  >
                            <div id="project-left">
                                <h3>1. <i>{this.state.projectName1}</i></h3>
                                <p>Feature: <b><i>{this.state.feature1}</i></b></p>
                                <p>Trigger: <b><i>{this.state.trigger1}</i></b></p>
                            </div>
                            <button className="profile-button" type="button" value="1" onClick={this.showModal}>
                                Modify project
                            </button>
                            <button className="profile-button" value="1" onClick={this.exportProject}>Export report</button>
                        </div>
                        {this.state.noProjects >= 2 ?
                            <div id="container-profile">
                                <div id="display-project" >
                                    <div id="project-left">
                                        <h3>2. {this.state.projectName2}</h3>
                                        <p>Feature: <b>{this.state.feature2}</b></p>
                                        <p>Trigger: <b>{this.state.trigger2}</b></p>
                                    </div>
                                    <button className="profile-button" type="button" value="2" onClick={this.showModal}>
                                        Modify project
                                    </button>
                                    <button className="profile-button" value="2" onClick={this.exportProject}>Export report</button>
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
                                    <button className="profile-button" type="button" value="3" onClick={this.showModal}>
                                        Modify project
                                    </button>
                                    <button className="profile-button" value="3" onClick={this.exportProject}>Export report</button>
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