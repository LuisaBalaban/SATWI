import '../modal.css';
import Form from './Form'
import React from 'react';

// const Modal = ({ handleClose, show, children }) => {
//   const showHideClassName = show ? "modal display-block" : "modal display-none";

class Modal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            projectName: "",
            feature: "",
            trigger: "",
            show: false,
            userId:'',
            TwitterHandle:'',
            projectNo:0,
            boardId:'',
            competitor:''

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
            projectName: nextProps.projectName,
            feature: nextProps.feature,
            trigger: nextProps.trigger,
            show: nextProps.show,
            handleClose: nextProps.handleClose,
            children: this.state.show ? " " : "modal display-none",
            showHideClassName: this.state.show ? "modal display-block" : "modal display-none",
            userId:nextProps.userId,
            projId:nextProps.projId,
            TwitterHandle:nextProps.TwitterHandle,
            projectNo:nextProps.projectNo,
            boardId:nextProps.boardId,
            competitor:nextProps.competitor

        })
        console.log(nextProps)
    }
    hideModal = () => {
        this.setState({
            show:false,
            children: this.state.show ? "" : "modal display-none",
            showHideClassName: this.state.show ? "" : "modal display-none",});
            
        console.log(this.state.show)
    };
    render() {
        console.log(this.state.boardId)
        console.log(this.state.show)
        console.log(this.state.projectName)
        console.log(this.state.projectNo)
        return (
            <div className={this.state.showHideClassName}>
                {this.state.show?
                <section className="modal-main">
                    {this.state.children}
                   {this.state.projectNo<5?
                   <div className="modal-container">
                         <button type="button" id="modal-button" onClick={this.hideModal} > Close
                    </button>
                    <Form
                    projectNo={this.state.projectNo}
                    projectName={this.state.projectName}
                        feature={this.state.feature}
                        trigger={this.state.trigger}
                        userId={this.state.userId}
                        projId={this.state.projId} 
                        boardId={this.state.boardId}
                        TwitterHandle={this.state.TwitterHandle}/> 
                   
                    </div> : 
                     <div  className="modal-container"> 
                     <button type="button" id="modal-button" onClick={this.hideModal} > Close
                </button>
                     <Form
                         userId={this.state.userId}
                         projectNo={this.state.projectNo}
                         projId={this.state.projId} 
                         competitor={this.state.competitor}
                         boardId={this.state.boardId}
                         TwitterHandle={this.state.TwitterHandle}/> 
                   
                     </div>}
                </section>
                : ''}
            </div>
        );
    }
};
export default Modal