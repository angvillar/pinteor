import React from 'react';
import { withRouter } from 'react-router-dom';
import Auth from '../modules/Auth.js';
import LoginForm from '../components/LoginForm.jsx';


class LoginPage extends React.Component {

  /**
   * Class constructor.
   */
  constructor(props) {
    super(props);

    const storedMessage = localStorage.getItem('successMessage');
    let successMessage = '';

    if (storedMessage) {
      successMessage = storedMessage;
      localStorage.removeItem('successMessage');
    }

    // set the initial component state
    this.state = {
      errors: [],
      successMessage: '',
      user: {
        email: '',
        password: ''
      }
    };

    this.processForm = this.processForm.bind(this);
    this.changeUser = this.changeUser.bind(this);
  }

  /**
   * Process the form.
   *
   * @param {object} event - the JavaScript event object
   */
  processForm(event) {
    event.preventDefault();
   
    fetch('http://localhost:3000/auth/login', {
      method: 'post',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        email: this.state.user.email,
        password: this.state.user.password,
      })
    }).then(res => {
      res.json().then(data => {
        if (res.status == '200') {
          this.setState({ errors: [] });
          Auth.authenticateUser(data.token);
          this.props.history.push('/dashboard');
        }
        if (res.status == '400' || res.status == '409') {
          const errors = data.errors.map( err => {
            return {
              'name': err.dataPath.substr(1),
              'message': err.message
            }
          });
          this.setState({ 
            errors, 
            message: data.message 
          });
        }
        if (res.status == '500') {
          this.setState({ 
            errors: [], 
            message:  data.message 
          }); 
        }
      }); 
    });
    
  }

  /**
   * Change the user object.
   *
   * @param {object} event - the JavaScript event object
   */
  changeUser(event) {
    const field = event.target.name;
    const user = this.state.user;
    user[field] = event.target.value;

    this.setState({
      user
    });
  }

  /**
   * Render the component.
   */
  render() {
    return (
      <LoginForm
        onSubmit={this.processForm}
        onChange={this.changeUser}
        errors={this.state.errors}
        successMessage={this.state.successMessage}
        user={this.state.user}
      />
    );
  }

}

export default withRouter(LoginPage);