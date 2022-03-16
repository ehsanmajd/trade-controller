import React from 'react';
import { Container, Grid, makeStyles, TextField, IconButton } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import UserCart from './UserCart';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    width: '100%',
    backgroundColor: '#fafafa',
  },
  search: {
    padding: '16px 8px',
  },
  item: {
  },
});

export default function SubAdminUsers() {
  const [users, setUsers] = React.useState([
    {
      id: '1',
      name: 'user 1',
      email: 'user1@test.com',
      servers: []
    },
    {
      id: '2',
      name: 'user 2',
      email: 'user2@test.com',
      servers: []
    },
    {
      id: '3',
      name: 'user 3',
      email: 'user3@test.com',
      servers: []
    },
    {
      id: '4',
      name: 'user 4',
      email: 'user4@test.com',
      servers: []
    },
    {
      id: '5',
      name: 'user 5',
      email: 'user5@test.com',
      servers: []
    }
  ]);
  const [keyword, setKeyword] = React.useState('');
  const classes = useStyles();
  const filteredUsers = users.filter(user => user.name.includes(keyword));
  return (
    <Container>
      <Container className={classes.root}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Grid container spacing={3} wrap='nowrap' className={classes.search}>
              <TextField fullWidth placeholder='search user ...' value={keyword} onChange={e => setKeyword(e.target.value)} />
              <IconButton>
                <SearchIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
      </Container>
      <Container className={classes.root}>
        <Grid container style={{ gap: 0 }}>
          {filteredUsers.map((user) => (
            <Grid className={classes.item} item xs={6} md={4} key={user.id}>
              <UserCart user={user} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Container>
  )
}