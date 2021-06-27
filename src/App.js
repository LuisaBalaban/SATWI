import './index.css';
import './elements.css';
import GoogleLogin from 'react-google-login'
import React from 'react';
import landingImage from './images/landing.svg'
import Lottie from './Lottie.js'
import twitter from './images/twitter.json';
import magnifier from './images/magnifier.json';
import line from './images/line.json';
import downArrow from './images/down-arrow.svg';
import downArrowSmall from './images/Arrow-down.svg.png'
import { withRouter } from 'react-router-dom';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollEnd: '',
      scrollEnd2: '',
      pathname: '',
      userId: "",
      timelineId: 0,
      email:'',
      username: '',
      competitor: '',
      projectName1: '',
      boardsId: '',
      feature1: '',
      trigger1: '',
      date1: '',
      projId1: '',
      projectName2:  '',
      feature2:  '',
      trigger2:  '',
      date2:  '',
      projId2: '',
      projectName3: '',
      feature3:  '',
      trigger3: '',
      date3:  '',
      projId3: '',
      noProjects: 0,
      userId: '',
      timelineId: []
    }
    this.findOutMore = this.findOutMore.bind(this);
    this.explore = this.explore.bind(this);
    this.dropGuest = this.dropGuest.bind(this);
    this.dropEnterprise = this.dropEnterprise.bind(this);
    this.dropPro = this.dropPro.bind(this);
    this.loginBrand = this.loginBrand.bind(this);
    this.userSearch = this.userSearch.bind(this);
    this.goPro = this.goPro.bind(this);
  }
  responseGoogle = (response) => {
    console.log(response);
    console.log(response.profileObj);
    this.setState(
      {
        userId: response.profileObj["googleId"]
      }
    )
    console.log(this.state.userId)
    fetch("http://127.0.0.1:5000/profileBoard", {
      method: "POST",
      body: JSON.stringify({
        profile: response.profileObj
      }),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
    }
    ).then(response => {
      console.log(response)
      if (response.status == 200) {
        this.setState({ pathname: '/board' })
      }
      return response.json()

    }).then(json => {
      console.log(json)
      console.log(json['body'])
      console.log("TIMELINE ID")
      console.log(json['body']['timelineId'])
    
      this.props.history.push({
        pathname: '/board',
        state: {
            isLogin:true,
            email:json['body']['email'],
            username: json['body']['twitterHandle'],
            competitor:json['body']['competitor'],
            projectName1:json['body']['projects'][0][0],
            boardsId:json['body']['boardId'],
            feature1:json['body']['projects'][0][1],
            trigger1: json['body']['projects'][0][2],
            date1:json['body']['projects'][0][2],
            projId1:json['body']['projects'][0][4],
            projectName2: json['body']['projects'][1] ? json['body']['projects'][1][0] : '' ,
            feature2:json['body']['projects'][1] ? json['body']['projects'][1][1] : '',
            trigger2: json['body']['projects'][1] ? json['body']['projects'][1][2]  : '',
            date2:json['body']['projects'][1] ? json['body']['projects'][1][3] : '',
            projId2:json['body']['projects'][1] ? json['body']['projects'][1][4]  :'',
            projectName3: json['body']['projects'][2] ? json['body']['projects'][2][0] : '',
            feature3: json['body']['projects'][2] ?json['body']['projects'][2][1]:'',
            trigger3: json['body']['projects'][2]? json['body']['projects'][2][2]:'',
            date3: json['body']['projects'][2]? json['body']['projects'][2][3]:'',
            projId3:json['body']['projects'][2]? json['body']['projects'][2][4]:'',
            noProjects: json['body']['projects'][1]?  json['body']['projects'][2] ? 3 : 2 : 1,
            userId:this.state.userId,
            timelineId:json['body']['timelineId']
          }
      })
    })

   
  }
  userSearch() {
    this.props.history.push({ pathname: '/search' })
  }
  dropPro() {
    document.getElementById("ProDropDown").classList.toggle("show");
    var img = document.getElementById("arrow3");
    img.classList.toggle("rotated");

  }
  explore() {
    this.scrollEnd2.scrollIntoView({ behavior: "smooth" });
  }
  dropEnterprise() {
    document.getElementById("EnterpriseDropDown").classList.toggle("show");
    var img = document.getElementById("arrow2");
    img.classList.toggle("rotated");
  }
  dropGuest() {
    document.getElementById("guestDropDown").classList.toggle("show");
    var img = document.getElementById("arrow");
    img.classList.toggle("rotated");
  }
  loginBrand() {

    this.props.history.push({ pathname: '/login' })
  }
  findOutMore() {

    this.scrollEnd.scrollIntoView({ behavior: "smooth" });

  }
  goPro() {
    this.props.history.push({ pathname: '/login' })
  }
  render() {

    console.log(this.state.timelineId)
    return (
      <div id="landing-page">
        <header>
          <div className="image-landing">
            <img src={landingImage} alt="Kiwi standing on oval" />

          </div>
          <div className="centered-title">
            <h1>What is your      favourite brand’s online persona?</h1>
            <div id="outer">
              <div class="inner"><button class="buttonSpecial" onClick={this.findOutMore}><img id="down-arrow" src={downArrowSmall} /></button> </div>

            </div>
          </div>
        </header>
        <div className="about-us">

          <h1 ref={(el) => { this.scrollEnd = el; }}>About us</h1>

          <h2>Social media</h2>
          <section>
            <p>Social media is indisputably a great stakeholder when it comes to the public image of a brand or a company. Taking into consideration the thousands of different apps available worldwide for no other purpose but to facilitate communication between users, businesses and respectively between each other, the data that social media platforms can provide are extremely valuable in assessing brand perception, persona and general feedback.</p>
            <div className="twitterAnimation">
              <Lottie lotti={twitter} height={200} width={200} />
            </div>
          </section>

          <h2>Sentiment analysis</h2>
          <section>
            <p>By performing sentimental analysis on big amounts of data extracted from one of the most used social media platforms a brand can assess in real-time customer feedback and impressions, whilst a customer can inspect the brand persona of a company they are interested in interacting with. </p>
            <Lottie lotti={magnifier} height={200} width={200} />
          </section>
          <div id="outer">
            <div class="inner"><button class="buttonSpecial" onClick={this.explore}><img id="down-arrow" src={downArrowSmall} /></button> </div>

          </div>
        </div>

        <div className="find-out">
          <h1 ref={(el) => { this.scrollEnd2 = el; }}>Explore</h1>

          <div>
            <section>
              <h2>Guest</h2>
              <button id="arrow" onClick={this.dropGuest} className="drop-btn">
                <img className="arrow" src={downArrow} />
              </button>
            </section>
            <div id="guestDropDown" class="dropdown-content">
              <section>
                <p> Discover valuable insights regarding you favourite brands and make more conscious decisions when shopping</p>
                <button onClick={this.userSearch} className="btn-user">Search for a company</button>
              </section>
            </div>
          </div>
          <div>
            <section>
              <h2>Enterprise</h2>
              <button id="arrow2" onClick={this.dropEnterprise} className="drop-btn">
                <img className="arrow" src={downArrow} />
              </button>
            </section>
            <div id="EnterpriseDropDown" class="dropdown-content">
              <section>
                <p> Explore your board and connect to your customers.</p>
                {/* <button onClick={this.loginBrand} className="btn-user">Log in</button> */}
                <div id="signInButton"><GoogleLogin
                  clientId='332583792653-4sev4321k5ssjukodjmmbbmot21daq12.apps.googleusercontent.com'
                  buttonText="Login with Google"
                  onSuccess={this.responseGoogle}
                  onFailure={this.responseGoogle}
                  cookiePolicy={'single_host_origin'}

                /></div>
              </section></div>
          </div>
          <div>
            <section>
              <h2> Go pro</h2>
              <button id="arrow3" onClick={this.dropPro} className="drop-btn">
                <img className="arrow" src={downArrow} /></button>
            </section>
            <div id="ProDropDown" class="dropdown-content">
              <section>
                <p> Do you want your brand to be on top of your customers reviews? Register now and closely analyze your Twitter trends</p>
                <button onClick={this.goPro} className="btn-user">Register now</button>
              </section></div></div>

        </div>

      </div>
    );
  }
}

export default withRouter(App);
