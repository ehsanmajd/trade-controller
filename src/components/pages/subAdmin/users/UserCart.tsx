import React, { useState } from 'react';
import { Grid, Container, Paper, makeStyles, IconButton } from '@material-ui/core';
import ImportantDevicesIcon from '@material-ui/icons/ImportantDevices';
import UserServer from './UserServer';

interface Props {
  user: {
    id: string;
    name: string;
    email: string;
  },
  servers?: {
    id: string;
    name: string;
    ip: string;
  }[],
}

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    padding: '4px',
    boxSizing: 'border-box',
  },
  item: {
    padding: '16px',
    boxSizing: 'border-box',
  },
  center: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  name: {
    margin: '0px',
  },
});

const UserCart: React.FC<Props> = ({
  user,
  servers = [
    {
      name: 'server 1',
      ip: '192.168.1.2'
    }
  ]
}) => {
  
  const classes = useStyles();
  const [selectedServerId, setSelectedServerId] = useState('');
  const [mode, setMode] = useState<'editServers' | 'view'>('view');

  const isViewMode = mode === 'view';

  return (
    <Container className={classes.root}>
      <Paper className={classes.item}>
        <Grid container spacing={3}>
          <Grid item xs={10}>
            <h4 className={classes.name}>{user.name}</h4>
            <h5>{user.email}</h5>
          </Grid>
          <Grid item xs={2} container alignItems='center' justify='center'>
            <IconButton onClick={() => setMode(mode === 'editServers' ? 'view' : 'editServers')}>
              <ImportantDevicesIcon color='primary' />
            </IconButton>
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          {!isViewMode && servers.map((server) => (
            <Grid item xs={12} key={server.id}>
              <UserServer name={server.name} ip={server.ip} />
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Container>
  )
}

export default UserCart;
