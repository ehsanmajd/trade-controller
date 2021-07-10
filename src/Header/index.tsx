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

const FullWidthGrid: React.FC = ({ children }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <UserInfo />
      {children}
    </div>
  );
}

export default FullWidthGrid;