import '../index.css';
import React from 'react';
import GoogleLogin from 'react-google-login'
import { withRouter } from 'react-router-dom';
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

class Login extends React.Component {
  constructor() {
    super();
    this.state = {

    }
    
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(event) {
    const { name, value } = event.target
    this.setState({ [name]: value })
    console.log(this.state.noPhone)
  }
  responseGoogle = (response) => {
    console.log(response);
    console.log(response.profileObj);
    fetch("http://127.0.0.1:5000/register", {
      method: "POST",
      body: JSON.stringify({
        profile: response.profileObj,
        phone: this.state.noPhone
      }),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
    }

    ).then(res => {
      console.log(res)
      console.log(this.state.noPhone)
      if (res.status == 200) {
        this.props.history.push({
          pathname: '/board-config',
          state: {
            name: response.profileObj['name'],
            userId: response.profileObj['googleId'],
            email: response.profileObj['email'],
            profilePic: response.profileObj['imageUrl'],
            phone: this.state.noPhone
          }
        })
      }


    })

  }
  render() {
    console.log(this.state.noPhone)
    return (<div className="google-button">
      <div class='container'>
        <div class='window'>
          <div class='content'>
            <div class='welcome'>Welcome!</div>
            <div class='subtitle'>Get ready to dive in your Twitter data</div>
            <div class='input-fields'>
              <PhoneInput
                placeholder="Enter phone number"
                value={ this.state.noPhone}
                onChange={noPhone => this.setState({ noPhone })} />
                <div id="center-elem">
              <GoogleLogin
                clientId="332583792653-4sev4321k5ssjukodjmmbbmot21daq12.apps.googleusercontent.com"
                buttonText="Register with Google"
                onSuccess={this.responseGoogle}
                onFailure={this.responseGoogle}
                cookiePolicy={'single_host_origin'}
              />
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>);
  }
}
export default withRouter(Login);