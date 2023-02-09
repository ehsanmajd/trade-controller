import { useEffect, useState } from 'react';
import { Avatar, Button, Container, CssBaseline, Grid, makeStyles, TextField, Typography } from '@material-ui/core';
import PasswordIcon from '@material-ui/icons/VpnKeyOutlined';
import { useHistory } from 'react-router-dom';
import * as services from '../../../service';
import { useUserContext } from '../../../context/UserContext';

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

export default function ChangePassword() {
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [counter, setCounter] = useState(COUNTER_INIT);
  const { data: user, setData: setUser } = useUserContext();

  const [error, setError] = useState('');

  const history = useHistory();

  const handleChange = e => setForm({
    ...form,
    [e.target.name]: e.target.value
  });

  const classes = useStyles();

  const handlePasswordChanged = () => {
    handleCancel();
    setUser({
      ...user,
      askPassword: false,
    });
  }

  const handleCancel = () => {
    setForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setError('');
    setMessage('');
    setCounter(COUNTER_INIT);
    history.push('/dashboard/home');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (message) {
      handlePasswordChanged();
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!form.currentPassword) {
      setError('Current password is required');
      return;
    }

    if (!form.newPassword) {
      setError('New password is required');
      return;
    }

    if (form.newPassword.length < 4) {
      setError('Password must be at least 4 characters');
      return;
    }

    try {
      setError('');
      await services.changePassword(form.currentPassword, form.newPassword);
      setMessage('Password changed successfully');
    }
    catch {
      setError('Make sure you entered the correct current password.');
    }
  }

  useEffect(
    () => {
      let timerId;
      if (message) {
        timerId = setTimeout(() => {
          setCounter(counter - 1);
          if (counter === 0) {
            handlePasswordChanged();
          }
        }, 1000);
      }
      return () => clearTimeout(timerId);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [message, counter]
  );

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <PasswordIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Change Password
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleSubmit}>
          <TextField
            value={form.currentPassword}
            onChange={handleChange}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Current password"
            name="currentPassword"
            type="password"
            autoComplete="password"
            autoFocus
          />
          <TextField
            value={form.newPassword}
            onChange={handleChange}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="newPassword"
            label="New password"
            type="password"
            id="newPassword"
            autoComplete="current-password"
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
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}