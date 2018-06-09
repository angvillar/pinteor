import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';


const LoginForm = ({ onSubmit, onChange, errors, successMessage, user }) => {

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
            {successMessage}
          </Typography>
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
            <Button variant="raised" type="submit" label="Login" color="primary">
              Login
            </Button>
          </div>
          <div className="field"> 
            <Typography color="textSecondary">
              Do not have an account? <Link to={'/signup'}>Sign up</Link>
            </Typography>
          </div> 
        </form>
      </CardContent>
    </Card>
  )
};

LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.array.isRequired,
  successMessage: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired
};

export default LoginForm;