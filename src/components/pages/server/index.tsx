import { useState, useEffect } from 'react';
import { makeStyles,Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
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
import ToggleOn from '@material-ui/icons/ToggleOn'
import ToggleOff from '@material-ui/icons/ToggleOff'
import CheckCircle from '@material-ui/icons/CheckCircle'
import Cancel from '@material-ui/icons/Cancel'
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlank from '@material-ui/icons/CheckBoxOutlineBlank';
import * as service from '../../../service/server';

const useStyles = makeStyles((theme: Theme)=>({
  table: {
    minWidth: 650,
  },
  root:{
    marginTop:theme.spacing(10)
  }
}));

interface Server {
  id: string;
  name: string;
  address:string;
  active: boolean;
}

const EMPTY_FORM_VALUES = {
  name: '',
  address: '',
  active: true
}

export default function Index() {
  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const [form, setForm] = useState(EMPTY_FORM_VALUES);
  const [servers, setServers] = useState<Server[]>([]);
  const classes = useStyles();
  const { name, address, active } = form;

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
    await service.addServer(name, address);
    setMode('view');
    setForm(EMPTY_FORM_VALUES);
    reset();
  }


  const reset = async () => {
    const servers = await service.loadServers();
    setServers(servers);
  }

  const toggleActive = async (id: string) => {
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
    <TableContainer className={classes.root} component={Paper}>
      <Table className={classes.table} size="small">
        <TableHead>
          <TableRow>
            <TableCell> </TableCell>
            <TableCell>Index</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Active</TableCell>
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
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell>{row.address}</TableCell>
              <TableCell>{row.active ? <CheckBoxIcon color='action' /> : <CheckBoxOutlineBlank color='action' />}</TableCell>
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
              <TableCell><TextField value={address} label='Address' name='address' onChange={handleInputChange} /></TableCell>
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
