import { createStyles, Grid, IconButton, makeStyles, Paper, Theme } from '@material-ui/core'
import { Refresh } from '@material-ui/icons';
import { FC } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useBasketsContext } from '../../context/BasketsContext';
import { usePrevious } from '../../hooks/usePrevious';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      padding: theme.spacing(1),
      textAlign: 'center',
      color: theme.palette.text.secondary,
      cursor: 'pointer'
    },
    selected: {
      fontWeight: 'bold'
    },
    error: {
      color: theme.palette.error.main
    }

  }),
);

const Header: FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const { data, refresh, hasError } = useBasketsContext();
  const { refreshTime } = data;
  const prevRefreshTime = usePrevious(refreshTime);

  const getClassNames = (route) => {
    const paperClasses = [classes.paper];
    if (location.pathname.endsWith(route)) {
      paperClasses.push(classes.selected);
    }
    return paperClasses.join(' ');
  }

  const HeaderPaper = ({ name, path }) => <Paper className={getClassNames(path)} onClick={() => history.push('/v1/dashboard/' + path)}>{name}</Paper>;

  return <Grid container spacing={1} justify='flex-start' alignItems='center'>
    <Grid item xs={3} sm={3}>
      <HeaderPaper path='setting' name='Setting' />
    </Grid>
    <Grid item xs={2} sm={2}>
      <HeaderPaper path='home' name='Basket' />
    </Grid>
    <Grid item xs={3} sm={3}>
      <HeaderPaper path='summary' name='Summary' />
    </Grid>
    <Grid item xs={2} sm={2}>
      <HeaderPaper path='logs' name='Logs' />
    </Grid>
    <Grid item xs={2} sm={2}>
      <HeaderPaper path='charts' name='Charts' />
    </Grid>
    <Grid item xs={12} sm={3}>
      {refreshTime && <Grid container justify='center'>
        <Grid container justify='center' alignItems='center' wrap='nowrap'>
          <label className={hasError ? classes.error : ''} >Last updated time:
            {!hasError && refreshTime.toLocaleTimeString()}
            {hasError && (prevRefreshTime ? prevRefreshTime.toLocaleTimeString() : '')}
          </label>
          <span><IconButton onClick={() => refresh()}><Refresh /></IconButton></span>
        </Grid>
      </Grid>}
    </Grid>
  </Grid>
}

export default Header;