import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { TextField, Checkbox } from '@material-ui/core';
import { useState } from 'react';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function createData(name: string, username: string, active: boolean) {
  return { name, username, active };
}

const rows = [
  createData("Ehsan Majd", "bemaxima", true),
  createData("Khashayar Pakfar", "kpakfar", true),
  createData("Alireza Edalatpour", "alireza", true)
];

const INITIAL = {
  name: '',
  username: '',
  password: '',
  active: true
}

export default function Index() {
  const [mode, setMode] = useState<'view' | 'edit'>('view')
  const [form, setForm] = useState(INITIAL);

  const { name, username, password, active } = form
  const classes = useStyles();


  const toggleActive = (active: boolean) => {
    // API CALL
  }

  const handleAdd = () => {
    setMode('edit');
  }

  const handleInputChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.type === 'text' ? e.target.value : e.target.checked
    })
  }

  const handleSubmit = () => {
    // API CALL
    setMode('view');
    setForm(INITIAL)
  }

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} size="small">
        <TableHead>
          <TableRow>
            <TableCell>&nbsp</TableCell>
            <TableCell>Index</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Username</TableCell>
            {mode === 'edit' && <TableCell>Password</TableCell>}
            <TableCell>Active</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={row.name}>
              <TableCell width='25px'><Button variant='contained' color='secondary'>-</Button></TableCell>
              <TableCell>{index + 1}</TableCell>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell>{row.username}</TableCell>
              {mode === 'edit' && <TableCell>******</TableCell>}
              <TableCell>{row.active ? 'yes' : 'no'}</TableCell>
              <TableCell align="center">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => toggleActive(!row.active)}
                >{row.active ? 'Deactivate' : 'Activate'}</Button>
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            {mode === 'edit' && <>
              <TableCell><Button variant='contained' color='secondary'>-</Button></TableCell>
              <TableCell>#</TableCell>
              <TableCell><TextField label='Name' name='name' onChange={handleInputChange} /></TableCell>
              <TableCell><TextField label='Username' name='username' onChange={handleInputChange} /></TableCell>
              <TableCell><TextField label='Password' name='password' type='password' onChange={handleInputChange} /></TableCell>
              <TableCell><Checkbox name='active' onChange={handleInputChange} /></TableCell>
              <TableCell>
                <Button
                  variant='contained'
                  color='primary'
                  onClick={handleSubmit}
                >Submit</Button>
              </TableCell>
            </>}
            {
              mode === 'view' && <>
                <TableCell>
                  <Button
                    variant='contained'
                    color='secondary'
                    onClick={() => handleAdd()}
                  >+</Button>
                </TableCell>
              </>
            }
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );

}