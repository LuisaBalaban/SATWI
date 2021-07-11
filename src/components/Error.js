import React from 'react';
import { withRouter } from 'react-router-dom';
import error from '../images/error.json';
import sparkles from '../images/sparkles.json';
import '../index.css';
import Lottie from '../Lottie.js'

class Error extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        responseCode: this.props.location.state.responseCode,
        issue:this.props.location.state.issue,
      }
    }
    render() {
        console.log(this.state.issue)
        return (<div>
            {this.state.issue==100?<div><h3 className="error-text">The account you tried to login with is not registered as a Satwi account. Register first!</h3> <Lottie lotti={error} height={200} width={200} /></div>:''}
            {this.state.issue==200?<div><h3 className="error-text">This email already has an associated account!</h3> <Lottie lotti={sparkles} height={200} width={200} /></div>:''}
        </div>)
    }
}
export default withRouter(Error);