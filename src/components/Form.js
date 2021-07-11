import React from 'react';
import '../index.css';
import '../modal.css'
import Loader from 'react-loader-spinner';

class Form extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            projectName: "",
            feature: "",
            trigger: "",
            userId: "",
            projId: '',
            TwitterHandle: '',
            projectNo: 0,
            competitor: '',
            boardId: '',
            flag: 0
        }
        this.hideModal = this.hideModal.bind(this);
        this.handleChange = this.handleChange.bind(this)
    }
    handleChange(event) {
        const { name, value } = event.target
        this.setState({ [name]: value })

    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            projectName: nextProps.projectName,
            feature: nextProps.feature,
            trigger: nextProps.trigger,
            projId: nextProps.projId,
            userId: nextProps.userId,
            TwitterHandle: nextProps.TwitterHandle,
            projectNo: nextProps.projectNo,
            competitor: nextProps.competitor,
            boardId: nextProps.boardId,



        })
        console.log(nextProps)
    }
    hideModal = () => {
        this.setState({ show: false });
    };
    commitChanges = () => {
        this.setState({ flag: 1 })
        console.log("MODIFYING PROJECT")
        console.log(this.state.trigger1)
        fetch("http://127.0.0.1:5000/modifyProject", {
            method: "POST",
            body: JSON.stringify({
                projectName1: this.state.projectName,
                feature1: this.state.feature,
                trigger1: this.state.trigger,
                userId: this.state.userId,
                projId1: this.state.projId,
                TwitterHandle: this.state.TwitterHandle
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
                this.setState({ flag: 0 })
            })
    }

    commitChangesCompetitor = () => {
        this.setState({ flag: 1 })
        console.log("MODIFYING COMPETITOR")
        console.log(this.state.competitor)
        fetch("http://127.0.0.1:5000/modifyCompetitor", {
            method: "POST",
            body: JSON.stringify({
                userId: this.state.userId,
                competitor: this.state.competitor,
                boardId: this.state.boardId,
                projId: this.state.projId
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
                this.setState({ flag: 0 })
                console.log(json)
            })
    }
    render() {
        console.log(this.state.userId)
        console.log(this.state.boardId)
        return (<div>
            <div className="center-modal">
                {
                    this.state.projectNo < 5 ?
                        <div>
                            <h3>Edit your project features</h3>
                            <input type='text' name="projectName" defaultValue={this.state.projectName} onChange={this.handleChange} placeholder='Project Name' className="input-board" />
                            <input type='text' name="feature" defaultValue={this.state.feature} onChange={this.handleChange} placeholder='Associated feature' className="input-board" />
                            <input type='text' name="trigger1" defaultValue={this.state.trigger} onChange={this.handleChange} placeholder='Associated trigger' className="input-board" />
                            <div style={{
                                    width: "100%",
                                    height: "100",
                                    display: "flex", justifyContent: "center", alignItems: "center"
                                    
                                }}    >{this.state.flag == 1? <Loader type="TailSpin" color="#483e4f" height="50" width="100" /> : ''}
                                </div>
                            <div id="button-center" style={{  display: "flex", justifyContent: "center", alignItems: "center"}}>
                            <button onClick={this.commitChanges}>Commit changes</button>
                            </div>
                        </div> :
                        <div>
                            <h3>Edit your monitored competitor</h3>
                            <input type='text' name="competitor" defaultValue={this.state.competitor} onChange={this.handleChange} placeholder='Competitor' className="input-board" />
                            <div style={{
                                    width: "100%",
                                    height: "100",
                                    display: "flex", justifyContent: "center", alignItems: "center"
                                    
                                }}    >{this.state.flag == 1? <Loader type="TailSpin" color="#483e4f" height="50" width="100" /> : ''}
                                </div>
                            <div id="button-center" style={{  display: "flex", justifyContent: "center", alignItems: "center"}}>
                                <button  onClick={this.commitChangesCompetitor}>Commit changes</button>
                               
                            </div>
                        </div>
                }
            </div>
        </div>)
    }
}
export default Form