import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';


const SignUpForm = ({ onSubmit, onChange, errors, user }) => (
  <form action="/" onSubmit={onSubmit}>  
    <TextField
      label="Name"
      name="name"
      onChange={onChange}
      value={user.name}
    />
    <TextField
      label="Email"
      name="email"
      onChange={onChange}
      value={user.email}
    />
    <TextField
      label="Password"
      type="password"
      name="password"
      onChange={onChange}
      value={user.password}
    />
    <Button variant="raised" type="submit" label="Create New Account" color="primary">
      Create New Account
    </Button>
    <Typography color="textSecondary">
      Already have an account? <Link to={'/login'}>Log in</Link>
    </Typography> 
  </form>
);

/*
const SignUpForm = ({ onSubmit, onChange, errors, user }) => {
  return (
    <Card className="container">
        <CardContent>
          <Typography color="textSecondary">
            This is the signup page.
          </Typography>
        </CardContent>
      </Card>
  );
};
*/

SignUpForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
};


export default SignUpForm;