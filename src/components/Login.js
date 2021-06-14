import '../index.css';
import React from 'react';
import GoogleLogin from 'react-google-login'
import { withRouter } from 'react-router-dom';

class Login extends React.Component {

  responseGoogle=(response)=>{
    console.log(response);
    console.log(response.profileObj);
    fetch("http://127.0.0.1:5000/register", {
            method: "POST",
            body: JSON.stringify({
                profile: response.profileObj
            }),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
        }
        
        ).then(res=> {
          console.log(res)
          if(res.status==200)
          {
            this.props.history.push({ pathname: '/board-config',
        state: {
            username: response.profileObj['username'],
            userId:response.profileObj['googleId'],
            email:response.profileObj['email'],
          }})
          }
         

      })  

  }
    constructor(props) {
      super(props);
      this.state = {
     
      }
    }
      render() {

      
        return (<div className="google-button">
<div class='container'>
  
  <div class='window'>
    <div class='content'>
      <div class='welcome'>Welcome!</div>
      <div class='subtitle'>Get ready to dive in your Twitter data</div>
      <div class='input-fields'>
      
        {/* <input type='name' placeholder='Username' class='input-line full-width'></input>
        <input type='email' placeholder='Email' class='input-line full-width'></input>
        <input type='password' placeholder='Password' class='input-line full-width'></input> */}
 <GoogleLogin
        clientId="332583792653-4sev4321k5ssjukodjmmbbmot21daq12.apps.googleusercontent.com"
        buttonText="Register with Google"
        onSuccess={this.responseGoogle}
        onFailure={this.responseGoogle}
        cookiePolicy={'single_host_origin'}
        
        />
      </div>
      {/* 
      <div><button class='ghost-round full-width' id="login-btn" >Log in</button></div> */}
    </div>
  </div>
</div>

        </div>);
    }
}
export default withRouter(Login);