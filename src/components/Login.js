import '../index.css';
import React from 'react';
import GoogleLogin from 'react-google-login'
import { withRouter } from 'react-router-dom';

class Login extends React.Component {

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
        )
    
  }
    constructor(props) {
      super(props);
      this.state = {
     
      }
    }
      render() {

      
        return (<div className="google-button">
{/* <div class='container'>
  
  <div class='window'>
    <div class='content'>
      <div class='welcome'>Welcome back!</div>
      <div class='subtitle'>Get ready to dive in your Twitter data</div>
      <div class='input-fields'>
        <input type='name' placeholder='Username' class='input-line full-width'></input>
        <input type='email' placeholder='Email' class='input-line full-width'></input>
        <input type='password' placeholder='Password' class='input-line full-width'></input>

      </div>
      <div class='spacing'>or continue with <span class='highlight'>Google</span></div>
      <div><button class='ghost-round full-width' id="login-btn" >Log in</button></div>
    </div>
  </div>
</div> */}
 <GoogleLogin
        clientId="332583792653-4sev4321k5ssjukodjmmbbmot21daq12.apps.googleusercontent.com"
        buttonText="Login"
        onSuccess={this.responseGoogle}
        onFailure={this.responseGoogle}
        cookiePolicy={'single_host_origin'}
        
        />
        </div>);
    }
}
export default withRouter(Login);