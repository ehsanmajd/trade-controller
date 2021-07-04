import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

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

export default function FullWidthGrid() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={1} justify='center'>
        <Grid item xs={3} sm={3}>
          <Paper className={classes.paper}>Setting</Paper>
        </Grid>
        <Grid item xs={3} sm={3}>
          <Paper className={classes.paper}><b>Basket</b></Paper>
        </Grid>
        <Grid item xs={3} sm={3}>
          <Paper className={classes.paper}>Summary</Paper>
        </Grid>
      </Grid>
    </div>
  );
}