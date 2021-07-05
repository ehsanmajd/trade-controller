import Layout from '../Layout'
import MainPage from '../components/pages/basket'
import { createStyles, Grid, makeStyles, Paper, Theme } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary
    },

  }),
);

export default function Main() {
  const classes = useStyles();
  return (
    <Layout header={
      () => (
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
      )}
    >
      <MainPage />
    </Layout>
  )
}
