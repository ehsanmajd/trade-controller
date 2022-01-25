import React from 'react';
import { useHistory } from 'react-router-dom'
import { Container, CssBaseline, Avatar, Typography, TextField, Button, Grid } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import MailIcon from '@material-ui/icons/Mail';
import { useUserContext } from '../../../context/UserContext';
import * as service from '../../../service';
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

const COUNTER_INIT = 3;

function Index() {
  const [error, setError] = React.useState('');
  const [message, setMessage] = React.useState('');
  const classes = useStyles();
  const [form, setForm] = React.useState({
    email: '',
  });
  const [counter, setCounter] = React.useState(COUNTER_INIT);
  const { data: user, setData: setUser } = useUserContext();
  const history = useHistory();

  const handleChange = e => setForm({
    ...form,
    [e.target.name]: e.target.value
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    if (message) {
      history.replace('/dashboard/home');
      return;
    }

    const emailIsValid = validateEmail(form.email);
    if (!emailIsValid) {
      setError('Email is not valid');
      return;
    }
    else {
      try {
        await service.updateEmailAddress(form.email);
        setMessage('Email address updated successfully');
      }
      catch (e) {
        const errorMessageMap = new Map();
        errorMessageMap.set(409, 'Email address already exists');
        errorMessageMap.set(404, 'Email address not found');
        errorMessageMap.set(500, 'Error updating email address');
        const errorMessage = errorMessageMap.get(e.response.status) || 'Something went wrong';
        setError(errorMessage);
      }
    }
  }

  React.useEffect(
    () => {
      let timerId;
      if (message) {
        timerId = setTimeout(() => {
          setCounter(counter - 1);
          if (counter === 0) {
            setUser({
              ...user,
              askEmail: false,
            });
            history.push('/dashboard/home');
          }
        }, 1000);
      }
      return () => clearTimeout(timerId);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [message, counter]
  );

  React.useEffect(
    () => {
      if (!user.askEmail) {
        history.push('/dashboard/home');
      }
    },
    [user.askEmail, history]
  );

  const handleSignout = () => {
    history.push('/signout');
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <MailIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Your email address needs to be updated
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
            label={"Email Address"}
            name="email"
            autoComplete="email"
            autoFocus
          />
          <Typography component="p" variant="caption" color='textSecondary'>
            System will use this email address to send you notifications.
          </Typography>
          {error && <Typography component="p" variant="caption" color='error'>
            {error}
          </Typography>}
          {message && <Typography component="p" variant="caption" color='textPrimary'>
            {message}
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
                {message ? `Homepage (${counter})` : 'Save'}
              </Button>
            </Grid>
            <Grid item xs className={classes.command}>
              <Button
                fullWidth
                variant="outlined"
                className={classes.submit}
                onClick={handleSignout}
              >
                Signout
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}

export default Index;