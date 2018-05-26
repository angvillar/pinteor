import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

const SignUpForm = ({ onSubmit, onChange, errors, user }) => (
  <Card>
    <CardContent>
  <form action="/" onSubmit={onSubmit}>
    <div className="field">  
    <TextField
      label="Name"
      name="name"
      onChange={onChange}
      value={user.name}
    />
    </div>
    <div className="field">     
    <TextField
      label="Email"
      name="email"
      onChange={onChange}
      value={user.email}
    />
    </div>
    <div className="field"> 
    <TextField
      label="Password"
      type="password"
      name="password"
      onChange={onChange}
      value={user.password}
    />
    </div>
    <div className="field"> 
    <Button variant="raised" type="submit" label="Create New Account" color="primary">
      Create New Account
    </Button>
    </div>
    <div className="field"> 
    <Typography color="textSecondary">
      Already have an account? <Link to={'/login'}>Log in</Link>
    </Typography>
    </div> 
  </form>
  </CardContent>
  </Card>
);

SignUpForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
};


export default SignUpForm;