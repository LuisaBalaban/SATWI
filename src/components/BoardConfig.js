import React from 'react';
import { withRouter } from 'react-router-dom';
import '../index.css';
import Lottie from '../Lottie.js'
import board from '../images/config-board.json'

class BoardConfig extends React.Component {
    constructor() {
        super();
        this.state = {
            username: '',
            competitor: '',
            //project 1
            projectName1: 'Project',
            feature1: '',
            trigger1: '',
            date1: '',
            // count_retweets:0,
            // countPoz: 0,
            // countNeg: 0,
            // count_tweets:0,
            // max_followers:0,
            // most_used_hashtag:0,
            // resultedTweets:[],
            // tweets: [],
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
            noProjects: ''


        }
        this.handleChange = this.handleChange.bind(this)
        this.handleInput = this.handleInput.bind(this);
        this.showOneProject = this.showOneProject.bind(this);
        this.showTwoProjects = this.showTwoProjects.bind(this);
        this.showThreeProjects = this.showThreeProjects.bind(this);
        this.handleChangeMonthlyReport = this.handleChangeMonthlyReport.bind(this)
        this.handleChangePersonalizedRecommandations = this.handleChangePersonalizedRecommandations.bind(this)
        this.handleChangeReceiveEmails = this.handleChangeReceiveEmails.bind(this)

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


        fetch("http://127.0.0.1:5000/board", {
            method: "POST",
            body: JSON.stringify({
                feature1: this.state.feature1,
                feature2: this.state.feature2,
                trigger1: this.state.trigger1,
                trigger2: this.state.trigger2,
                username: this.state.username,
                date1: this.state.date1,
                date2: this.state.date2
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
                console.log((Object.keys(json)[0]).toString())
                console.log(json[(Object.keys(json)[0]).toString()])

                let path = `/board`;
                console.log(this.state.countNeg)
                console.log("JSON KEYS")
                console.log(json[this.state.feature1])
                console.log(json[this.state.trigger1])
                console.log(json[Object.keys(json).toString()])
                console.log("TESTING")
                console.log((Object.values(json[this.state.feature1].labeledTweets)))
                console.log(Object.keys(json[this.state.feature1].labeledTweets[0]))
                console.log(json[this.state.feature1].labeledTweets[0])
                console.log(Object.values(json[this.state.feature1].labeledTweets[0]))


                this.props.history.push({
                    pathname: path,
                    state: {
                        noProjects: this.state.noProjects,
                        username: this.state.username,
                        //project 1 - features
                        competitor: this.state.competitor,
                        feature1: this.state.feature1,
                        date1: this.state.date1,
                        count_retweets1: json[this.state.feature1].count[0],
                        countPoz1: (JSON.stringify(Object.values(json[this.state.feature1].labeledTweets)).match(/Positive/g) || []).length,
                        countNeg1: (JSON.stringify(Object.values(json[this.state.feature1].labeledTweets)).match(/Negative/g) || []).length,
                        count_tweets1: json[this.state.feature1].count[1],
                        polarityValues1: Object.values(json[this.state.feature1].results[0]),
                        max_followers1: json[this.state.feature1].max_followers,
                        all_followers1: json[this.state.feature1].all_followers, most_used_hashtag1: json[this.state.feature1].most_used_hashtag,
                        tweets1: Object.keys(json[this.state.feature1].labeledTweets[0]),
                        bubble_chart_data1: json[this.state.feature1].bubble_chart_data,
                        projectName1: this.state.projectName1,
                        //project 1 - trigger
                        trigger1: this.state.trigger1,
                        avgPolarityTrigger1: json[this.state.trigger1].average,
                        impactedFollowersTrigger1: json[this.state.trigger1].all_followers,
                        hashtagTrigger1: json[this.state.trigger1].most_used_hashtag,
                        mostFollowedTrigger1: json[this.state.trigger1].max_followers,
                        //project 2
                        feature2: this.state.feature2,
                        date2: this.state.date2,
                        count_retweets2: json[this.state.feature2].count[0],
                        countPoz2: (JSON.stringify(Object.values(json[this.state.feature2].labeledTweets)).match(/Positive/g) || []).length,
                        countNeg2: (JSON.stringify(Object.values(json[this.state.feature2].labeledTweets)).match(/Negative/g) || []).length,
                        count_tweets2: json[this.state.feature2].count[1],
                        polarityValues2: Object.values(json[this.state.feature2].results[0]),
                        max_followers2: json[this.state.feature2].max_followers,
                        all_followers2: json[this.state.feature2].all_followers,
                        most_used_hashtag2: json[this.state.feature2].most_used_hashtag,
                        count_tweets2: Object.keys(json[this.state.feature2].labeledTweets[0]),
                        bubble_chart_data2: json[this.state.feature2].bubble_chart_data,
                        projectName2: this.state.projectName2,
                        //project 2 - trigger
                        trigger2: this.state.trigger2,
                        avgPolarityTrigger2: json[this.state.trigger2].average,
                        impactedFollowersTrigger2: json[this.state.trigger2].all_followers,
                        hashtagTrigger2: json[this.state.trigger2].most_used_hashtag,
                        mostFollowedTrigger2: json[this.state.trigger2].max_followers,
                        //project 3
                        feature3: this.state.feature3,
                        date2: this.state.date3,
                        count_retweets3: json[this.state.feature3].count[0],
                        countPoz3: (JSON.stringify(Object.values(json[this.state.feature3].labeledTweets)).match(/Positive/g) || []).length,
                        countNeg3: (JSON.stringify(Object.values(json[this.state.feature3].labeledTweets)).match(/Negative/g) || []).length,
                        count_tweets3: json[this.state.feature3].count[1],
                        polarityValues3: Object.values(json[this.state.feature3].results[0]),
                        max_followers3: json[this.state.feature3].max_followers,
                        all_followers3: json[this.state.feature3].all_followers,
                        most_used_hashtag3: json[this.state.feature3].most_used_hashtag,
                        count_tweets3: Object.keys(json[this.state.feature3].labeledTweets[0]),
                        bubble_chart_data3: json[this.state.feature3].bubble_chart_data,
                        projectName3: this.state.projectName3,
                        //project 3 - trigger
                        trigger3: this.state.trigger3,
                        avgPolarityTrigger3: json[this.state.trigger3].average,
                        impactedFollowersTrigger3: json[this.state.trigger3].all_followers,
                        hashtagTrigger3: json[this.state.trigger3].most_used_hashtag,
                        mostFollowedTrigger3: json[this.state.trigger3].max_followers
                    }
                });
            })
    };



    render() {

        return (<div>

            <h1 id="small-title">Personalize your board</h1>

            <section>
                <form className="form-board">
                    <div className="vertical">
                        <h3>Where can we find your brand?</h3>
                        <input type='text' name="username" value={this.state.username} onChange={this.handleChange} placeholder='Twitter username' className="input-board" />
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
                        <div class="containerCheckBoxes">
                            <ul class="ks-cboxtags">
                                <li><input type="checkbox" id="checkboxOne" value="receiveEmails" checked={this.state.receiveEmails} onChange={this.handleChangeReceiveEmails} /><label for="checkboxOne"></label><h3>Receive emails</h3></li>

                                <li><input type="checkbox" id="checkboxTwo" value="personalizedRecommandations" checked={this.state.handleChangePersonalizedRecommandations} onChange={this.handleChange} /><label for="checkboxTwo"></label><h3>Receive personalized advice</h3></li>
                                <li><input type="checkbox" id="checkboxThree" value="monthlyReport" checked={this.state.monthlyReport} onChange={this.handleChangeMonthlyReport} /><label for="checkboxThree"></label><h3>Autogenerated monthly report</h3></li>
                            </ul>
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
