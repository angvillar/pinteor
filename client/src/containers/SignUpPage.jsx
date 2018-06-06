import React  from 'react';
import PropTypes from 'prop-types';
import SignUpForm from '../components/SignUpForm.jsx';

class SignUpPage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      errors: [],
      message: '',
      user: {
        email: '',
        name: '',
        password: ''
      }
    };

    this.processForm = this.processForm.bind(this);
    this.changeUser = this.changeUser.bind(this);
  };

  changeUser(event) {
    const field = event.target.name;
    const user = this.state.user;
    user[field] = event.target.value;

    this.setState({
      user
    });
  };
  
  processForm(event) {
    event.preventDefault();
   
    fetch('http://localhost:3000/api/signup', {
      method: 'post',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: this.state.user.name, 
        email: this.state.user.email,
        password: this.state.user.password,
      })
    }).then(res => {
      res.json().then(data => {
        console.log(data);
        if (res.status == '200') {
          this.setState({ 
            errors: [],
            message: data.message 
          });
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
  };

  render() {
    return (
      <SignUpForm
        onSubmit={this.processForm}
        onChange={this.changeUser}
        errors={this.state.errors}
        message={this.state.message}
        user={this.state.user}
      />
    );
  };

}

export default SignUpPage;