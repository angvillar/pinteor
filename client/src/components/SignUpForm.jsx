import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';

const SignUpForm = ({ onSubmit, onChange, errors, message, user }) => {

  const hasErr = (name) => {
    return !!errors.filter(err => err.name === name).length;
  }

  const errMessageFor = (name) => {
    return errors.filter(err => err.name === name)[0].message;
  }

  return (
    <Card>
      <CardContent>
        <form action="/" onSubmit={onSubmit}>
          <Typography>
            {message}
          </Typography>
          <div className="field">  
            <FormControl error={hasErr('name')}>
              <InputLabel htmlFor="name">Name</InputLabel>
              <Input 
                id="name" 
                name="name"
                onChange={onChange}
                value={user.name}
              />
              <FormHelperText id="name-text">{ hasErr('name') ? errMessageFor('name') : '' }</FormHelperText>
            </FormControl>
          </div>
          <div className="field">
            <FormControl error={hasErr('email')}>
              <InputLabel htmlFor="email">Email</InputLabel>
              <Input 
                id="email" 
                name="email"
                onChange={onChange}
                value={user.email}
              />
              <FormHelperText id="email-text">{ hasErr('email') ? errMessageFor('email') : '' }</FormHelperText>
            </FormControl>
          </div>
          <div className="field"> 
            <FormControl error={hasErr('password')}>
              <InputLabel htmlFor="password">Password</InputLabel>
              <Input 
                id="password" 
                type="password"
                name="password"
                onChange={onChange}
                value={user.password}
              />
              <FormHelperText id="password-text">{ hasErr('password') ? errMessageFor('password') : '' }</FormHelperText>
            </FormControl>
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
  )
};

SignUpForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.array.isRequired,
  message: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired
};


export default SignUpForm;