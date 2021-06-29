import React from 'react';
import { withRouter } from 'react-router-dom';
import '../index.css';
import Lottie from '../Lottie.js'
import board from '../images/config-board.json'
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';


class BoardConfig extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: this.props.location.state.name,
            username: '',
            competitor: '',
            userId: this.props.location.state.userId,
            phone: this.props.location.state.phone,
            profilePic: this.props.location.state.profilePic,
            email: this.props.location.state.email,
            //project 1
            projectName1: 'Project',
            feature1: '',
            trigger1: '',
            date1: '',
            //project 2
            projectName2: 'Project',
            feature2: '',
            trigger2: '',
            date2: '',
            //project 3
            projectName3: 'Project',
            feature3: '',
            trigger3: '',
            date3: '',


            receiveEmails: false,
            personalizedRecommandations: false,
            monthlyReport: false,
            noProjects: '',
            timelineId: 0


        }
        this.handleChange = this.handleChange.bind(this)
        this.handleInput = this.handleInput.bind(this);
        this.showOneProject = this.showOneProject.bind(this);
        this.showTwoProjects = this.showTwoProjects.bind(this);
        this.showThreeProjects = this.showThreeProjects.bind(this);
        this.handleChangeMonthlyReport = this.handleChangeMonthlyReport.bind(this)
        this.handleChangePersonalizedRecommandations = this.handleChangePersonalizedRecommandations.bind(this)
        this.handleChangeReceiveEmails = this.handleChangeReceiveEmails.bind(this)
        this.handleChangeCheckbox = this.handleChangeCheckbox.bind(this)

    }

    handleChangeCheckbox = (event) => {
        this.setState({ [event.target.name]: event.target.checked });

        // console.log(this.state.receiveEmails)
        // console.log(this.state.monthlyReport)
        // console.log(this.state.personalizedRecommandations)
    };

    // sendMonthlyEmail()
    // {
    //     fetch("http://127.0.0.1:5000/sendWelcomeEmail", {
    //         method: "POST",
    //         body: JSON.stringify({
    //             phone: this.state.phone,
    //             email: this.state.email,
    //             name: this.state.name,
    //             twitterHandle:this.state.username,
                
    //         }),
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Accept': 'application/json'
    //         },
    //     }
    //     ).then(response => {
    //         console.log(response)
    //     })
    // }
    sendWelcomeEmail()
    {
        fetch("http://127.0.0.1:5000/sendWelcomeEmail", {
            method: "POST",
            body: JSON.stringify({
                phone: this.state.phone,
                email: this.state.email,
                name: this.state.name,
                twitterHandle:this.state.username
            }),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
        }
        ).then(response => {
            console.log(response)
        })
    }

    handleChangeMonthlyReport() {
        this.setState({ monthlyReport: !this.state.monthlyReport });
    }
    handleChangePersonalizedRecommandations() {
        this.setState({ personalizedRecommandations: !this.state.handleChangePersonalizedRecommandations });
    }
    handleChangeReceiveEmails() {
        this.setState({ receiveEmails: !this.state.receiveEmails });
    }
    handleChange(event) {
        const { name, value } = event.target
        this.setState({ [name]: value })

    }
    showOneProject(e) {
        e.preventDefault()
        var x = document.getElementById("hidden-project-norm");
        var displayValue = window.getComputedStyle(x).display;
        if (displayValue === "none") {
            x.style.display = "block";
        } else {
            x.style.display = "none";
        }
        this.setState({
            noProjects: 1
        })


    }
    showTwoProjects(e) {
        e.preventDefault()
        this.showOneProject(e)
        var y = document.getElementById("hidden-project-norm2");
        var displayValue = window.getComputedStyle(y).display;
        if (displayValue === "none") {
            y.style.display = "block";
        } else {
            y.style.display = "none";
        }
        this.setState({
            noProjects: 2
        })
    }
    showThreeProjects(e) {
        e.preventDefault()
        this.showTwoProjects(e)
        var z = document.getElementById("hidden-project-norm3");
        var displayValue = window.getComputedStyle(z).display;
        if (displayValue === "none") {
            z.style.display = "block";
        } else {
            z.style.display = "none";
        }
        this.setState({
            noProjects: 3
        })
    }
    handleInput = e => {
        e.preventDefault();
        console.log("making request")
        console.log(this.state.trigger1)
        console.log(this.state.feature1)
        console.log(this.state.date1)
        console.log(this.state.feature2)
        console.log(this.state.trigger2)
        console.log(this.state.date2)
        console.log(this.state.personalizedRecommandations)
        console.log(this.state.monthlyReport)
        console.log(this.state.receiveEmails)
        console.log(this.state.userId)
        let ReceiveEmails=this.state.ReceiveEmails

        fetch("http://127.0.0.1:5000/board-config", {
            method: "POST",
            body: JSON.stringify({
                phone: this.state.phone,
                email: this.state.email,
                profilePic: this.state.profilePic,
                feature1: this.state.feature1,
                feature2: this.state.feature2,
                feature3: this.state.feature3,
                trigger1: this.state.trigger1,
                trigger2: this.state.trigger2,
                trigger3: this.state.trigger3,
                username: this.state.username,
                date1: this.state.date1,
                date2: this.state.date2,
                date3: this.state.date3,
                competitor: this.state.competitor,
                noProjects: this.state.noProjects,
                projectName1: this.state.projectName1,
                projectName2: this.state.projectName2,
                projectName3: this.state.projectName3,
                userId: this.state.userId,
                ReceiveRecommendations: this.state.personalizedRecommandations,
                ReceiveEmails: this.state.receiveEmails,
                ReceiveMonthlyReport: this.state.monthlyReport,
                fetchedData: false,
            }),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
        }
        ).then(response => {
            console.log(response)
            console.log(ReceiveEmails)

            {
            this.sendWelcomeEmail()
            }
            this.sendMonthlyEmail()
            return response.json()
        })
            .then(json => {
                console.log(json)
                console.log((Object.keys(json)[0]).toString())
                console.log(json[(Object.keys(json)[0]).toString()])
                console.log(json[this.state.feature1])
                console.log(Object.values(json[this.state.feature1].results))
                console.log(json[this.state.feature1])
                console.log(Object.values(json[this.state.feature1].results))
                console.log(json['ids'])
                console.log(Object.values(json[this.state.feature1].results[2][1]))
                console.log(Object.values(json[this.state.feature1].labeledTweets))

                console.log(json['timelineId'])

                let path = `/board`;
                this.props.history.push({
                    pathname: path,
                    state: {
                        noProjects: this.state.noProjects,
                        username: this.state.username,
                        //project 1 - features
                        competitor: this.state.competitor,
                        feature1: this.state.feature1,
                        date1: this.state.date1,
                        trigger1: this.state.trigger1,
                        feature2: this.state.feature2,
                        date2: this.state.date2,
                        trigger2: this.state.trigger2,
                        feature3: this.state.feature3,
                        date3: this.state.date3,
                        trigger3: this.state.trigger3,
                        projectName1: this.state.projectName1,
                        projectName2: this.state.projectName2,
                        projectName3: this.state.projectName3,
                        //project ids
                        projId: json['ids'],
                        projId1: json['ids'][0] ? json['ids'][0] : 0,
                        projId2: json['ids'][1] ? json['ids'][1] : 0,
                        projId3: json['ids'][2] ? json['ids'][2] : 0,
                        boardsId: json['BoardId'],
                        profilePic: this.state.profilePic,
                        email: this.state.email,
                        name: this.state.name,
                        timelineId: json['timelineId']

                    }
                });
            })
    };


    render() {
        console.log(this.state.receiveEmails)
        console.log(this.state.monthlyReport)
        console.log(this.state.personalizedRecommandations)
        return (<div id="boardConfig">

            <h1 id="small-title">Personalize your board</h1>

            <section>
                <form className="form-board">
                    <div className="vertical">
                        <h3>Where can we find your brand?</h3>
                        <input type='text' name="username" defaultValue={this.state.username} onChange={this.handleChange} placeholder='Twitter username' className="input-board" />
                        {/* <button onClick={this.shoeProject1} id="add-proj">Add project</button> */}
                        <h3>How many strategy projects do you want to create?</h3>

                        <div class="inline-btns-div" ><button class="myButton" id="inline-btns" onClick={this.showOneProject} >1</button>
                            <button class="myButton" onClick={this.showTwoProjects} id="inline-btns">2</button>
                            <button class="myButton" onClick={this.showThreeProjects} id="inline-btns">3</button></div>

                        <div className="hidden-project" id="hidden-project-norm">
                            <input type='text' name="projectName1" value={this.state.projectName1} onChange={this.handleChange} placeholder='project name' className="input-board" />
                            <input type='text' name="feature1" value={this.state.feature1} onChange={this.handleChange} placeholder='Feature to follow' className="input-board" />
                            <input type='text' name="trigger1" value={this.state.trigger1} onChange={this.handleChange} placeholder='Associated trigger' className="input-board" />
                            <input type='date' name="date1" value={this.state.date1} onChange={this.handleChange} placeholder='Starting date' className="input-board" />


                            {/* <button onClick={this.showProject2} id="add-proj">Add project</button>   */}
                        </div>
                        {/* project 2 */}
                        <div className="hidden-project" id="hidden-project-norm2">
                            <input type='text' name="projectName2" value={this.state.projectName2} onChange={this.handleChange} placeholder='project name' className="input-board" />
                            <input type='text' name="feature2" value={this.state.feature2} onChange={this.handleChange} placeholder='Feature to follow' className="input-board" />

                            <input type='text' name="trigger2" value={this.state.trigger2} onChange={this.handleChange} placeholder='Associated trigger' className="input-board" />

                            <input type='date' name="date2" value={this.state.date2} onChange={this.handleChange} placeholder='Starting date' className="input-board" />

                        </div>

                        {/* project 3 */}
                        <div className="hidden-project" id="hidden-project-norm3">
                            <input type='text' name="projectName3" value={this.state.projectName3} onChange={this.handleChange} placeholder='project name' className="input-board" />
                            <input type='text' name="feature3" value={this.state.feature3} onChange={this.handleChange} placeholder='Feature to follow' className="input-board" />

                            <input type='text' name="trigger3" value={this.state.trigger3} onChange={this.handleChange} placeholder='Associated trigger' className="input-board" />

                            <input type='date' name="date3" value={this.state.date3} onChange={this.handleChange} placeholder='Starting date' className="input-board" />

                        </div>

                        <h3>Keep an eye on the competition</h3>
                        <input type='text' name="competitor" value={this.state.competitor} onChange={this.handleChange} placeholder='Track a competitor' className="input-board" />
                        <div id="containerCheckBoxes">
                            {/* <ul class="ks-cboxtags">
                                <li><input type="checkbox" id="checkboxOne" value="receiveEmails" checked={this.state.receiveEmails} onChange={this.handleChangeReceiveEmails} /><label for="checkboxOne"></label><h3>Receive emails</h3></li>


                                <li><input type="checkbox" id="checkboxTwo" value="personalizedRecommandations" checked={this.state.handleChangePersonalizedRecommandations} onChange={this.handleChange} /><label for="checkboxTwo"></label><h3>Receive personalized advice</h3></li>
                                <li><input type="checkbox" id="checkboxThree" value="monthlyReport" checked={this.state.monthlyReport} onChange={this.handleChangeMonthlyReport} /><label for="checkboxThree"></label><h3>Autogenerated monthly report</h3></li>
                            </ul> */}
                            
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={this.state.receiveEmails}
                                    onChange={this.handleChangeReceiveEmails}
                                    name="receiveEmails"
                                    color="#af88d3"
                                />
                            }
                            label={<span style={{ fontSize: '1.5rem' ,fontFamily: 'Reem Kufi'}}>Receive emails</span>}
                        />
                         <FormControlLabel
                            control={
                                <Checkbox
                                    checked={this.state.ReceiveMonthlyReport}
                                    onChange={this.handleChangeMonthlyReport}
                                    name="ReceiveMonthlyReport"
                                    color="#af88d3"
                                />
                            }
                            label={<span style={{ fontSize: '1.5rem',fontFamily: 'Reem Kufi' }}>Receive monthly report</span>}
                        />
                             <FormControlLabel
                            control={
                                <Checkbox
                                    checked={this.state.ReceiveRecommendations}
                                    onChange={this.handleChangePersonalizedRecommandations}
                                    name="Receive recommendations"
                                    color="#af88d3"
                                />
                            }
                            label={<span style={{ fontSize: '1.5rem' , fontFamily: 'Reem Kufi'}}>Receive notifications</span>}
                        />
                        </div>
                        <button onClick={this.handleInput} className="btn-user">Generate board</button>
                    </div>

                </form>
                <Lottie lotti={board} height={600} width={600} />
            </section>
        </div>)
    }
}
export default withRouter(BoardConfig)
