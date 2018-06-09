import React from 'react';
import { withRouter } from 'react-router-dom';
import Auth from '../modules/Auth';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

class DashboardPage extends React.Component {

  constructor(props) {
    
    super(props);

    this.state = {
      message: '',
      user: {}
    };

    this.logout = this.logout.bind(this);

  }

  logout(event) {
    event.preventDefault();
    Auth.deauthenticateUser();
    this.props.history.push('/login');
  }

  componentDidMount() {
    fetch('http://localhost:3000/api/dashboard', {
      method: 'get',
      headers: {
        'Authorization': Auth.getToken(),
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      }
    }).then(res => {
      res.json().then(data => {
        console.log('data: ', data);
        if (res.status === 200) {
          this.setState({ 
            message: data.message,
            user: data.user 
          });
        }
        if (res.status === 401) {
          this.props.history.push('/login');
        }
      })
    })
  }

  render() {
    return (
      <Card>
        <CardContent>
          <Typography>
            {this.state.message}
            Hello {this.state.user.username}, your email is {this.state.user.email}
          </Typography>
          <Button color="primary" onClick={this.logout}>
            Logout
          </Button>
        </CardContent>
      </Card>
    );
  }

}

export default withRouter(DashboardPage);