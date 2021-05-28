import './index.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch
} from "react-router-dom";
import Routes from './Routes';
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

  responseGoogle=(response)=>{
    console.log(response);
    console.log(response.profileObj);
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
          return response.json()
      })
    
  }
  constructor() {
    super();
    this.state = {
    scrollEnd:'',
    scrollEnd2:''
    }

    this.findOutMore=this.findOutMore.bind(this);
    this.explore=this.explore.bind(this);
    this.dropGuest=this.dropGuest.bind(this);
    this.dropEnterprise=this.dropEnterprise.bind(this);
    this.dropPro=this.dropPro.bind(this);
    this.loginBrand=this.loginBrand.bind(this);
    this.userSearch=this.userSearch.bind(this);
    this.goPro=this.goPro.bind(this);
  }
  userSearch()
  {
    this.props.history.push({ pathname: '/search'})
  }
  dropPro()
  {
    document.getElementById("ProDropDown").classList.toggle("show");
    var img = document.getElementById("arrow3");
    img.classList.toggle("rotated");

  }
  explore()
  {
    this.scrollEnd2.scrollIntoView({ behavior: "smooth" });
  }
  dropEnterprise()
  {
    document.getElementById("EnterpriseDropDown").classList.toggle("show"); 
    var img = document.getElementById("arrow2");
    img.classList.toggle("rotated");
  }
  dropGuest()
  {
    document.getElementById("guestDropDown").classList.toggle("show");
    var img = document.getElementById("arrow");
    img.classList.toggle("rotated");
  }
  loginBrand()
  {
    
    this.props.history.push({ pathname: '/login'})
  }
  findOutMore()
  {
    
      this.scrollEnd.scrollIntoView({ behavior: "smooth" });

  }
  goPro()
  {
    this.props.history.push({ pathname: '/board-config'})
  }
  render() {

  return (
    <div>
      <header>
        <div className="image-landing">
        <img src={landingImage} alt="Kiwi standing on oval"/>

        </div>
        <div className="centered-title">
        <h1>What is your      favourite brand’s online persona?</h1>
        <div id="outer">
        <div class="inner"><button   onClick={this.findOutMore}><img id="down-arrow" src={downArrowSmall}/></button> </div>
        
        </div>
        </div>
      </header>
      <div className="about-us">
     
      <h1 ref={(el) => { this.scrollEnd = el; }}>About us</h1>
   
      <h2>Social media</h2>
      <section>
      <p>Social media is indisputably a great stakeholder when it comes to the public image of a brand or a company. Taking into consideration the thousands of different apps available worldwide for no other purpose but to facilitate communication between users, businesses and respectively between each other, the data that social media platforms can provide are extremely valuable in assessing brand perception, persona and general feedback.</p>
      <div  className="twitterAnimation">
      <Lottie lotti={twitter} height={200} width={200} />
      </div>
      </section>
    
      <h2>Sentiment analysis</h2>
      <section>
      <p>By performing sentimental analysis on big amounts of data extracted from one of the most used social media platforms a brand can assess in real-time customer feedback and impressions, whilst a customer can inspect the brand persona of a company they are interested in interacting with. </p>
      <Lottie lotti={magnifier} height={200} width={200} />
      </section>
      <div id="outer">
        <div class="inner"><button   onClick={this.explore}><img id="down-arrow" src={downArrowSmall}/></button> </div>
        
        </div>
      </div>
      
      <div className="find-out">
        <h1 ref={(el) => { this.scrollEnd2 = el; }}>Explore</h1>
        
        <div>
          <section>
          <h2>Guest</h2>
        <button   id="arrow"  onClick={this.dropGuest} className="drop-btn">
          <img className="arrow"src={downArrow}/>
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
          <button  id="arrow2" onClick={this.dropEnterprise} className="drop-btn">
          <img className="arrow" src={downArrow}/>
          </button>
          </section>
                    <div id="EnterpriseDropDown" class="dropdown-content">
          <section>
          <p> Explore your board and connect to your customers.</p>
         {/* <button onClick={this.loginBrand} className="btn-user">Log in</button> */}
         <div id="signInButton"><GoogleLogin
        clientId={process.env.GOOGLE_CLIENT_ID}
        buttonText="Login"
        onSuccess={this.responseGoogle}
        onFailure={this.responseGoogle}
        cookiePolicy={'single_host_origin'}
        
        /></div>
          </section></div>
          </div>
        <div>
          <section>
         <h2> Go pro</h2>
         <button  id="arrow3"  onClick={this.dropPro} className="drop-btn">
          <img className="arrow" src={downArrow}/></button>
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
