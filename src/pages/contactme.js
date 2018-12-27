import React from 'react'
import ReactDOM from 'react-dom'
import { withRouteData } from 'react-static'

const axios = require('axios');
const showAlertSucess = "alert alert-success fade show"
const showAlertError = "alert alert-danger fade show"
const hideAlert = "alert fade"
const successMsg = "Message Sent. Thanks!";
const errorMsg = "Oh no! Error sending...please try again.";

class ContactMe extends React.Component {

  constructor(){
    super();
    this.state = {
      disableButton: false,
      alertStyle: hideAlert,
      alertMsg: "",
    }
  };

  emailChange = (event) => {
    this.setState({
      email:event.target.value,
    });
  }

  subjectChange = (event) => {
    this.setState({
      subject:event.target.value,
    });
  }

  messageChange = (event) => {
    this.setState({
      msg:event.target.value,
    });
  }

  hideAlert = () => {
    setTimeout(() => {
      this.setState({
        alertStyle: hideAlert,
        alertMsg: "",
      });
    }, 3000);
  }

  handleSubmit = (event) => {
    event.preventDefault();

    this.setState({
      disableButton: 1,
    })

    let config = {
      headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
      body:{
        email: 'email@email.com',
        subject: 'hello',
        msg: 'this is a test'
      }
    };

    let formData = {
      email: this.state.email,
      subject: this.state.subject,
      msg: this.state.msg,
    };

    axios.post('https://qyvh36o5yh.execute-api.us-east-1.amazonaws.com/prod/sendfeedbackform', formData)
      .then((response) => {
        if(response.status == 200) {
            // alert('success');
            this.setState({
              disableButton: 0,
              alertStyle: showAlertSucess,
              alertMsg: successMsg
            });
            this.hideAlert();
        } else {
          // alert('fail');
          this.setState({
            disableButton: 0,
            alertMsg: errorMsg,
            alertStyle: showAlertError,
          });
          this.hideAlert();
        }
      })
      .catch((error) =>  {
        // alert('internalerror');
        console.log(error);
        this.setState({
          disableButton: 0,
          alertMsg: errorMsg,
          alertStyle: showAlertError,
        });
        this.hideAlert();
      });
  };

  render() {
    return(
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h1 className="display-4">Send me feedback!</h1>
          </div>
        </div>
        <div className="row">
          <div className="col-md-8">
            <p className="lead">For any suggestions or if you just want to say hello.</p>
          </div>
            <div className="col-md-4">
              <div className={this.state.alertStyle} role="alert">
                {this.state.alertMsg}
              </div>
            </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <form onSubmit={this.handleSubmit} method="post">
              <div className="form-group">
                <label htmlFor="emailInput">Email Address</label>
                <input required type="email" className="form-control" id="emailInput" placeholder="Enter email" onChange={(event) => this.emailChange(event)}/>
              </div>
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input required type="text" className="form-control" id="subject" placeholder="Subject" onChange={(event) => this.subjectChange(event)}/>
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea required type="text" className="form-control" rows="5" id="message" placeholder="Hello!" onChange={(event) => this.messageChange(event)}></textarea>
              </div>
              <button disabled={this.state.disableButton} className="btn btn-primary" type="submit">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default ContactMe

// export default withRouteData(({  }) => (
//   <div className="container">
//     <div className="row">
//       <div className="col-md-12">
//         <h1 className="display-4">Send me feedback!</h1>
//       </div>
//     </div>
//     <div className="row">
//       <div className="col-md-12">
//         <p className="lead">For any suggestions or if you just want to say hello.</p>
//       </div>
//     </div>
//     <div className="row">
//       <div className="col-md-12">
//         <form onSubmit={this.handleSubmit} method="post">
//           <div className="form-group">
//             <label htmlFor="emailInput">Email Address</label>
//             <input required type="email" className="form-control" id="emailInput" placeholder="Enter email" onChange={(event) => this.emailChange(event)}/>
//           </div>
//         </form>
//         <form>
//           <div className="form-group">
//             <label htmlFor="subject">Subject</label>
//             <input required type="text" className="form-control" id="subject" placeholder="Subject" onChange={(event) => this.subjectChange(event)}/>
//           </div>
//         </form>
//         <form>
//           <div className="form-group">
//             <label htmlFor="message">Message</label>
//             <textarea required type="text" className="form-control" rows="5" id="message" placeholder="Hello!" onChange={(event) => this.messageChange(event)}></textarea>
//           </div>
//         </form>
//         <button type="submit" className="btn btn-primary">Submit</button>
//       </div>
//     </div>
//   </div>
// ))
