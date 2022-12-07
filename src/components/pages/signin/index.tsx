import React from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import * as service from '../../../service';
import { Redirect } from 'react-router-dom'
import { useUserContext } from '../../../context/UserContext';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom'
import { disposeAccessToken, disposeRefreshToken, setAccessToken, setRefreshToken } from '../../../utils/token';


const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  link: {
    cursor: 'pointer'
  }
}));

export default function SignIn() {
  const [error, setError] = React.useState('');
  const [emailSent, setEmailSent] = React.useState(false);
  const [mode, setMode] = React.useState<'signin' | 'forgot-password'>('signin');
  const [form, setForm] = React.useState({
    email: '',
    password: '',
    captcha: ''
  });
  const history = useHistory();
  const classes = useStyles();
  const recaptchaRef = React.useRef<{reset: Function}>(null);

  const { setData: setUser, data: user } = useUserContext();

  const handleChange = e => setForm({
    ...form,
    [e.target.name]: e.target.value
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === 'signin') {
      // if (!form.email || !form.password || !form.captcha) {
      //   setError('Please fill all the fields');
      //   return;
      // }
      setError('');
      try {
        const { accessToken, refreshToken, user } = await service.login(form.email, form.password, form.captcha);
        setRefreshToken(refreshToken);
        setAccessToken(accessToken);
        setUser({
          loggedIn: true,
          name: user.name,
          username: user.username,
          roles: user.roles,
          askEmail: !user.email,
          askPassword: user.askForPasswordReset
        });
      }
      catch {
        recaptchaRef.current?.reset();
        setError('Invalid username or password');
      }
    }
    else if (mode === 'forgot-password') {
      const email = form.email;
      try {
        await service.forgotPassword(email);
        setEmailSent(true);
      } catch (err) {
        setError('Email not found');
      }
    }
  }

  useEffect(() => {
    disposeRefreshToken();
    disposeAccessToken();
  }, []);

  useEffect(
    () => {
      let timerId;
      if (emailSent) {
        timerId = setTimeout(() => {
          setEmailSent(false);
        }, 5000);
      }
      return () => clearTimeout(timerId);

    },
    [emailSent]
  )

  const toggleMode = () => {
    setMode(mode => mode === 'signin' ? 'forgot-password' : 'signin');
    setError('');
    setForm({
      email: '',
      password: '',
      captcha: ''
    })
  }

  const gotoRegisterPage = () => {
    history.push('/guest/register');
  }

  return (
    <Container component="main" maxWidth="xs">
      {user.loggedIn && <Redirect to='/' />}
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {mode === 'signin' ? 'Sign in' : 'Forgot password'}
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleSubmit}>
          <TextField
            value={form.email}
            onChange={handleChange}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label={mode === 'forgot-password' ? 'Email' : "Username"}
            name="email"
            autoComplete="username"
            autoFocus
          />
          {mode === 'signin' && <TextField
            value={form.password}
            onChange={handleChange}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />}
          {/* {mode === 'signin' && <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
            onChange={(value) => handleChange({
              target: {
                name: 'captcha',
                value
              }
            })}
          />} */}
          {error && <Typography component="p" variant="caption" color='error'>
            {error}
          </Typography>}
          {emailSent && <Typography component="p" variant="caption" color='textPrimary'>
            Please check your email to reset your password
          </Typography>}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={(mode === 'forgot-password' && !form.email && emailSent)}
          >
            {mode === 'signin' ? 'Sign In' : 'Send'}
          </Button>
          <Grid container>
            <Grid item xs>
              <Link className={classes.link} variant="body2" onClick={toggleMode}>
                {mode === 'signin' ? 'Forgot password?' : 'Back to Sign In'}
              </Link>
            </Grid>
            <Grid item>
              <Link className={classes.link} variant="body2" onClick={gotoRegisterPage}>
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}