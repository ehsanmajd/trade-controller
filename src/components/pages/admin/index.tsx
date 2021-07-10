import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import IconButton from '@material-ui/core/IconButton';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { TextField, Checkbox } from '@material-ui/core';
import { useState, useEffect } from 'react';
import * as service from '../../../service';
import CheckCircle from '@material-ui/icons/CheckCircle'
import Cancel from '@material-ui/icons/Cancel'
import ToggleOn from '@material-ui/icons/ToggleOn'
import ToggleOff from '@material-ui/icons/ToggleOff'
import VerifiedUser from '@material-ui/icons/VerifiedUser'
import Remove from '@material-ui/icons/Remove'
import Add from '@material-ui/icons/Add'

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});


const EMPTY_FORM_VALUES = {
  name: '',
  username: '',
  password: '',
  active: true
}

interface User {
  id: string;
  name: string;
  username: string;
  password: string;
  email: string;
  phone: string;
  active: boolean;
}

export default function Index() {
  const [mode, setMode] = useState<'view' | 'edit'>('view')
  const [form, setForm] = useState(EMPTY_FORM_VALUES);
  const [users, setUsers] = useState<User[]>([]);

  const { name, username, password, active } = form
  const classes = useStyles();

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
      [e.target.name]: (e.target.type === 'text' || e.target.type === 'password') ? e.target.value : e.target.checked
    })
  }

  const handleSubmit = async () => {
    await service.addUser(name, username, password);
    setMode('view');
    setForm(EMPTY_FORM_VALUES);
    reset();
  }


  const reset = async () => {
    const users = await service.loadUsers();
    setUsers(users);
  }

  const toggleActive = async (id: string) => {
    // API CALL
    await service.toggleActive(id);
    reset();
  }

  useEffect(
    () => {
      reset();
    },
    []
  )

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} size="small">
        <TableHead>
          <TableRow>
            <TableCell> </TableCell>
            <TableCell>Index</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Username</TableCell>
            {mode === 'edit' && <TableCell>Password</TableCell>}
            <TableCell>Active</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((row, index) => (
            <TableRow key={row.id}>
              <TableCell width='25px'>
                <IconButton><Remove /></IconButton>
              </TableCell>
              <TableCell>{index + 1}</TableCell>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell>{row.username}</TableCell>
              {mode === 'edit' && <TableCell>******</TableCell>}
              <TableCell>{row.active && <VerifiedUser color='action' />}</TableCell>
              <TableCell align="center">
                <IconButton
                  onClick={() => toggleActive(row.id)}
                  title={row.active ? 'Deactivate' : 'Activate'}
                >
                  {row.active && <ToggleOn color='primary' />}
                  {!row.active && <ToggleOff color='secondary' />}
                </IconButton>
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
              <TableCell><TextField value={name} label='Name' name='name' onChange={handleInputChange} /></TableCell>
              <TableCell><TextField value={username} label='Username' name='username' onChange={handleInputChange} /></TableCell>
              <TableCell><TextField value={password} label='Password' name='password' type='password' onChange={handleInputChange} /></TableCell>
              <TableCell><Checkbox checked={active} name='active' onChange={handleInputChange} /></TableCell>
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