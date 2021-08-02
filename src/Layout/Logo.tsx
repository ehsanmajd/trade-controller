import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import UserInfo from '../components/UserInfo';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary
    },

  }),
);

const Logo: React.FC = ({ children }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <img src='/images/logo.png' height='64px' width='auto' />
    </div>
  );
}

export default Logo;