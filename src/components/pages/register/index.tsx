import { useState } from 'react';
import { Avatar, Button, Container, CssBaseline, Grid, makeStyles, TextField, Typography } from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import { useHistory } from 'react-router-dom';
import * as services from '../../../service';
import { validateEmail } from '../../../utils/general';


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
  command: {
    marginLeft: '5px',
    marginRight: '5px'
  }
}));

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [signupComplete, setSignupComplete] = useState(false);
  const [error, setError] = useState('');
  const history = useHistory();

  const handleChange = e => setForm({
    ...form,
    [e.target.name]: e.target.value
  });

  const classes = useStyles();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (signupComplete) {
      history.push('/guest/signin');
      return;
    }

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError('Please fill all the fields');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (form.password.length < 4) {
      setError('Password must be at least 4 characters long');
      return;
    }

    if (!validateEmail(form.email)) {
      setError('Invalid email');
      return;
    }

    try {
      await services.registerUser(form);
      setSignupComplete(true);
    } catch (e) {
      const errorMessageMap = new Map();
      errorMessageMap.set(409, 'Email address already exists');
      errorMessageMap.set(404, 'Email address not found');
      errorMessageMap.set(500, 'An error occurred during registration');
      const errorMessage = errorMessageMap.get(e.response.status) || 'Something went wrong';
      setError(errorMessage);
    }
  }

  const handleCancel = () => {
    history.push('/guest/signin');
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <CreateIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleSubmit}>
          <TextField
            value={form.name}
            onChange={handleChange}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="name"
            label="Name"
            name="name"
            type="text"
            autoComplete="fullname"
            autoFocus
          />
          <TextField
            value={form.email}
            onChange={handleChange}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="email"
            label="Email address"
            type="email"
            id="email"
            autoComplete="email"
          />
          <TextField
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
            autoComplete="password"
          />
          <TextField
            value={form.confirmPassword}
            onChange={handleChange}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm password"
            type="password"
            id="confirmPassword"
            autoComplete="confirm-password"
          />
          {error && <Typography component="p" variant="caption" color='error'>
            {error}
          </Typography>}
          {signupComplete && <Typography component="p" variant="subtitle1" color='secondary'>
            Check your email to verify your account.
          </Typography>}
          <Grid container>
            <Grid item xs className={classes.command}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                {signupComplete ? 'Back to Sign In' : 'Submit'}
              </Button>
            </Grid>
            {!signupComplete && <Grid item xs className={classes.command}>
              <Button
                fullWidth
                variant="outlined"
                className={classes.submit}
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </Grid>}
          </Grid>
        </form>
      </div>
    </Container>
  );
}