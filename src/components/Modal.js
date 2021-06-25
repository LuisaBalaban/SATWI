import '../modal.css';
import Form from './Form'
import React from 'react';

// const Modal = ({ handleClose, show, children }) => {
//   const showHideClassName = show ? "modal display-block" : "modal display-none";

class Modal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            projectName1: "",
            feature1: "",
            trigger1: "",
            show: false,
            userId:'',
            TwitterHandle:''

        }
        this.hideModal=this.hideModal.bind(this);
    }

    // componentDidMount()
    // {
    //     this.setState({
    //     handleClose: this.state.show? "modal display-block" : "modal display-none",
    //     children:this.state.show? "modal display-block" : "modal display-none",
    //     showHideClassName:this.state.show? "modal display-block" : "modal display-none"
    // })

    componentWillReceiveProps(nextProps) {
        this.setState({
            projectName1: nextProps.projectName1,
            feature1: nextProps.feature1,
            trigger1: nextProps.trigger1,
            show: nextProps.show,
            handleClose: nextProps.handleClose,
            children: this.state.show ? " " : "modal display-none",
            showHideClassName: this.state.show ? "modal display-block" : "modal display-none",
            userId:nextProps.userId,
            projId1:nextProps.projId1,
            TwitterHandle:nextProps.TwitterHandle,
            

        })
    }
    hideModal = () => {
        this.setState({ show: false ,
            children: this.state.show ? " " : "modal display-none",
            showHideClassName: this.state.show ? "modal display-block" : "modal display-none"});
        console.log(this.state.show)
    };
    render() {
        console.log(this.state.show)
        console.log(this.state.projectName1)
        return (
            <div className={this.state.showHideClassName}>
                <section className="modal-main">
                    {this.state.children}
                    <Form projectName1={this.state.projectName1}
                        feature1={this.state.feature1}
                        trigger1={this.state.trigger1}
                        userId={this.state.userId}
                        projId1={this.state.projId1} 
                        TwitterHandle={this.state.TwitterHandle}/>
              
                    <button type="button" id="modal-button" onClick={this.hideModal} > Close
                    </button>
                </section>
            </div>
        );
    }
};
export default Modal