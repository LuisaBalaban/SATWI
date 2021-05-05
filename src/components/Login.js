import '../index.css';
import React from 'react';
import { withRouter } from 'react-router-dom';

class Login extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
     
      }
    }
      render() {

      
        return (<div>
<div class='container'>
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
</div>
        </div>);
    }
}
export default withRouter(Login);