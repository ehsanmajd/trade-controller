import { useState, useEffect } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import IconButton from '@material-ui/core/IconButton';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Remove from '@material-ui/icons/Remove'
import Add from '@material-ui/icons/Add'
import CheckCircle from '@material-ui/icons/CheckCircle'
import Cancel from '@material-ui/icons/Cancel'
import * as service from '../../../service';
import Chips from '../../Chips';
import { User, Server } from '../../../types/user';

const useStyles = makeStyles((theme: Theme) => ({
  table: {
    minWidth: 650,
  },
  root: {
    marginTop: theme.spacing(10)
  }
}));



const EMPTY_FORM_VALUES = {
  address: '',
  users: []
}

export default function Index() {
  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const [form, setForm] = useState(EMPTY_FORM_VALUES);
  const [servers, setServers] = useState<Server[]>([]);
  const classes = useStyles();
  const { address, users } = form;

  const handleCancel = () => {
    setForm(EMPTY_FORM_VALUES);
    setMode('view');
  }

  const handleAdd = () => {
    setMode('edit');
  }

  const handleInputChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.type === 'text' ? e.target.value : e.target.checked
    });
  }

  const handleSubmit = async () => {
    await service.addServer(users.map(x => x.key), address);
    setMode('view');
    setForm(EMPTY_FORM_VALUES);
    reset();
  }

  const handleChange = (v: any) => {
    setForm({
      ...form,
      users: v
    })
  }

  const reset = async () => {
    const servers = await service.loadServers();
    setServers(servers);
  }


  useEffect(
    () => {
      reset();
    },
    []
  )

  const mapUserToChip = (user: User) => {
    return {
      label: user.username,
      key: user.id
    }
  }

  const usersDatasource = async (keyword: string) => {
    const users = await service.searchUsers(keyword);
    return users.map(mapUserToChip);
  }

  return (
    <TableContainer className={classes.root} component={Paper}>
      <Table className={classes.table} size="small">
        <TableHead>
          <TableRow>
            <TableCell> </TableCell>
            <TableCell>Index</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Users</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {servers.map((row, index) => (
            <TableRow key={row.id}>
              <TableCell width='25px'>
                <IconButton><Remove /></IconButton>
              </TableCell>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{row.address}</TableCell>
              <TableCell>
                <Chips
                  datasource={usersDatasource}
                  value={row.users.map(mapUserToChip)}
                  addDisabled
                />
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            {mode === 'edit' && <>
              <TableCell>
                <IconButton
                ><Remove /></IconButton>
              </TableCell>
              <TableCell>#</TableCell>
              <TableCell><TextField value={address} label='Address' name='address' onChange={handleInputChange} /></TableCell>
              <TableCell>
                <Chips
                  datasource={usersDatasource}
                  value={users}
                  addDisabled={false}
                  onChange={handleChange}
                />
              </TableCell>
              <TableCell>
                <IconButton
                  onClick={handleSubmit}
                >
                  <CheckCircle color='primary' />
                </IconButton>
                <IconButton
                  onClick={handleCancel}
                >
                  <Cancel color='secondary' />
                </IconButton>
              </TableCell>
            </>}
            {
              mode === 'view' && <>
                <TableCell>
                  <IconButton
                    onClick={() => handleAdd()}
                  ><Add /></IconButton>
                </TableCell>
              </>
            }
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
