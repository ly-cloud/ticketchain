/**
 *
 * LoginPage
 *
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import {
  makeSelectEmail,
  makeSelectPassword,
  makeSelectIsSubmitted,
  makeSelectErrorText,
} from './selectors';
import {
  login,
  changeEmail,
  changePassword,
  changeIsSubmitted,
  changeErrorText,
} from './actions';
import reducer from './reducer';
import saga from './saga';

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  link: {
    textDecoration: 'none',
  },
}));

export function LoginPage(props) {
  useEffect(() => {}, []);
  const { email, password, isSubmitted, errorText } = props;
  const {
    onChangeEmail,
    onChangePassword,
    onChangeIsSubmitted,
    onChangeErrorText,
    onLogin,
  } = props;

  useInjectReducer({ key: 'loginPage', reducer });
  useInjectSaga({ key: 'loginPage', saga });

  const classes = useStyles();

  const regexEmail = new RegExp(
    '^[\\w-_\\.+]*[\\w-_\\.]\\@([\\w]+\\.)+[\\w]+[\\w]$',
  );

  function onHandleChangeEmail(evt) {
    if (!evt.target.value) {
      onChangeErrorText('Email is required!');
    } else if (!regexEmail.test(evt.target.value)) {
      onChangeErrorText('Please enter a valid email');
    } else {
      onChangeErrorText('');
    }
    onChangeEmail(evt.target.value);
  }

  function onHandleSubmit(event) {
    event.preventDefault();
    onChangeIsSubmitted(true);
    if (!email || !regexEmail.test(email) || !password) {
      return;
    }
    onLogin();
  }

  return (
    <React.Fragment>
      <Helmet>
        <title>TicketChain - Login</title>
        <meta name="description" content="Login page" />
      </Helmet>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <form className={classes.form} noValidate onSubmit={onHandleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={onHandleChangeEmail}
              error={isSubmitted && (!email || !regexEmail.test(email))}
              helperText={!isSubmitted ? '' : errorText}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={onChangePassword}
              error={isSubmitted && !password}
              helperText={
                // eslint-disable-next-line no-nested-ternary
                !isSubmitted ? '' : password ? '' : 'Password is required!'
              }
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Login
            </Button>
            <Grid container>
              <Grid item xs>
                <Link to="/" variant="body2" className={classes.link}>
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link to="/" variant="body2" className={classes.link}>
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
        <Box mt={8} />
      </Container>
    </React.Fragment>
  );
}

LoginPage.propTypes = {
  email: PropTypes.string,
  password: PropTypes.string,
  isSubmitted: PropTypes.bool,
  errorText: PropTypes.string,
  onChangeEmail: PropTypes.func,
  onChangePassword: PropTypes.func,
  onChangeIsSubmitted: PropTypes.func,
  onChangeErrorText: PropTypes.func,
  onLogin: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  email: makeSelectEmail(),
  password: makeSelectPassword(),
  isSubmitted: makeSelectIsSubmitted(),
  errorText: makeSelectErrorText(),
});

function mapDispatchToProps(dispatch) {
  return {
    onChangeEmail: email => dispatch(changeEmail(email)),
    onChangePassword: evt => dispatch(changePassword(evt.target.value)),
    onChangeIsSubmitted: isSubmitted =>
      dispatch(changeIsSubmitted(isSubmitted)),
    onChangeErrorText: errorText => dispatch(changeErrorText(errorText)),
    onLogin: evt => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(login());
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(LoginPage);
