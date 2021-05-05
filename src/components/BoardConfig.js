import React from 'react';
import { withRouter } from 'react-router-dom';
import '../index.css';
import Lottie from '../Lottie.js'
import board from '../images/config-board.json'

class BoardConfig extends React.Component {
    constructor() {
        super();
        this.state={
            username:'',
            features_string:'',
            features:[],
            triggers_string:'',
            triggers:[],
            competitor:'',

        }
        this.handleChange = this.handleChange.bind(this)
        this.handleInput=this.handleInput.bind(this);
    }
    handleChange(event) {
        const {name, value} = event.target

        this.setState({
            [name]: value
        }) 
    }
    handleInput= e => {
        e.preventDefault();
       this.setState({
           features:this.state.features_string.split(','),
           triggers:this.state.triggers_string.split(',')
       })
     
      };
    

    render() {
        console.log(this.state.features)
        console.log(this.state.features_string)
        console.log(this.state.triggers)
        console.log(this.state.username)
        console.log(this.state.competitor)
 
        return(<div>
           
             <h1 id="small-title">Personalize your board</h1>
          
            <section>
            <form className="form-board">
                <div className="vertical">
                <input type='text' name="username" value={this.state.username} onChange={this.handleChange} placeholder='Twitter username' className="input-board">
                </input>
                <input  type='text'  name="features_string" value={this.state.features_string} onChange={this.handleChange} placeholder='Features to follow' className="input-board">
                </input>
                <input  type='text' name="triggers_string" value={this.state.triggers_string} onChange={this.handleChange} placeholder='Urgent triggers' className="input-board">
                </input>
                <input  type='text' name="competitor" value={this.state.competitor} onChange={this.handleChange} placeholder='Competitor to analyze' className="input-board">
                </input>
                <button onClick={this.handleInput} className="btn-user">Generate board</button>
                </div>
               
            </form>
            <Lottie lotti={board} height={600} width={600} />
            </section>
        </div>)
    }
}
export default withRouter(BoardConfig)
