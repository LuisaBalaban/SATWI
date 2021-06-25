import React from 'react';
import '../index.css';
import '../modal.css'

class Form extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            projectName1:"",
            feature1:"",
            trigger1:"",
            userId:"",
            projId1:'',
            TwitterHandle:''
        }
        this.hideModal = this.hideModal.bind(this);
        this.handleChange=this.handleChange.bind(this)
    }
    handleChange(event) {
        const { name, value } = event.target
        this.setState({ [name]: value })

    }
    componentWillReceiveProps(nextProps) {
        this.setState({projectName1: nextProps.projectName1,
            feature1: nextProps.feature1,
            trigger1: nextProps.trigger1,
            projId1:nextProps.projId1,
            userId:nextProps.userId,
            TwitterHandle:nextProps.TwitterHandle
        
        
})
    }
    hideModal = () => {
        this.setState({ show: false });
    };
    commitChanges=()=>
    {
        console.log("MODIFYING PROJECT")
        console.log(this.state.trigger1)
        fetch("http://127.0.0.1:5000/modifyProject", {
            method: "POST",
            body: JSON.stringify({
                projectName1:this.state.projectName1,
                feature1:this.state.feature1,
                trigger1:this.state.trigger1,
                userId:this.state.userId,
                projId1:this.state.projId1,
                TwitterHandle:this.state.TwitterHandle
            })
            ,
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
            })
    }

    render() {
        console.log(this.state.userId)
        return (<div>
            <div className="center-modal">
            <h3>Edit your project features</h3>
            <input  type='text' name="projectName" defaultValue={this.state.projectName1} onChange={this.handleChange} placeholder='Project Name' className="input-board" />
            <input type='text' name="feature" defaultValue={this.state.feature1} onChange={this.handleChange} placeholder='Associated feature' className="input-board" />
            <input type='text' name="trigger1" defaultValue={this.state.trigger1} onChange={this.handleChange} placeholder='Associated trigger' className="input-board" />
            <button onClick={this.commitChanges}>Commit changes</button>
            </div>
        </div>)
    }
}
export default Form