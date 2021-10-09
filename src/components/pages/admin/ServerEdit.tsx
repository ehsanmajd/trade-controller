import React, { useEffect, useState } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { TableContainer, Paper, TableCell, TableHead, TableRow, IconButton, TextField } from '@material-ui/core';
import Table from '@material-ui/core/Table/Table';
import TableBody from '@material-ui/core/TableBody/TableBody';
import { Add, Cancel, CheckCircle, Remove } from '@material-ui/icons';
import * as service from '../../../service';
import * as adminServices from '../../../service/admin';
import { useCallback } from 'react';
import Link from '@material-ui/core/Link/Link';

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      position: 'absolute',
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
    table: {
      minWidth: 350,
    },
  }),
);

interface Props {
  userId: string;
  onClose: () => void;
  onOpenBasket: (serverId: string) => void;
}

interface Server {
  id: string;
  address: string;
}

const EMPTY_FORM_VALUES = {
  address: ''
}

export default function ServerEdit({ userId, onClose, onOpenBasket }: Props) {
  const [mode, setMode] = useState<'view' | 'edit' | 'add'>('view');
  const [form, setForm] = useState(EMPTY_FORM_VALUES);
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [servers, setServers] = useState<Server[]>([]);
  const [selectedServerIdToEdit, setSelectedServerIdToEdit] = useState(null);

  const { address } = form;

  const gotoEditMode = (serverId: string) => {
    setSelectedServerIdToEdit(serverId);
    setForm({
      ...EMPTY_FORM_VALUES,
      ...servers.find(x => x.id === serverId)
    })
    setMode('edit');
  }

  const handleInputChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: (e.target.type === 'text' || e.target.type === 'password') ? e.target.value : e.target.checked
    })
  }

  const handleCancel = () => {
    setForm(EMPTY_FORM_VALUES);
    setMode('view');
    setSelectedServerIdToEdit(null);
  }

  const handleAdd = () => {
    setMode('add');
  }

  const handleSubmit = async () => {
    if (mode === 'add') {
      await adminServices.addServer(userId, address);
    }
    else if (mode === 'edit') {
      await adminServices.updateServer(selectedServerIdToEdit, address, userId);
    }
    handleCancel();
    reset();
  }

  const reset = useCallback(
    async () => {
      const servers = await service.getServersByUserId(userId);
      setServers(servers);
    },
    [userId, setServers]
  )

  const deleteServer = async (serverId: string) => {
    await adminServices.deleteServer(serverId, userId);
    reset();
  }

  useEffect(
    () => {
      reset();
    },
    [reset]
  );

  return (
    <div style={modalStyle} className={classes.paper}>
      <TableContainer component={Paper}>
        <Table className={classes.table} size="small">
          <TableHead>
            <TableRow>
              <TableCell> </TableCell>
              <TableCell>Index</TableCell>
              <TableCell>Address</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {servers.map((server, index) => {
              const editMode = mode === 'edit' && server.id === selectedServerIdToEdit;
              return (
                <TableRow key={server.id}>
                  <TableCell width='25px'>
                    <IconButton
                      onClick={() => {
                        if (!editMode) {
                          deleteServer(server.id)
                        }
                      }}
                    ><Remove /></IconButton>
                  </TableCell>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    {editMode ?
                      <TextField value={address} label='Address' name='address' onChange={handleInputChange} />
                      : server.address}
                  </TableCell>
                  <TableCell>
                    {editMode ?
                      <>
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
                      </>
                      :
                      <>
                        <Link href='#' onClick={() => gotoEditMode(server.id)}>Edit</Link>
                        &nbsp;
                        <Link href='#' onClick={() => onOpenBasket(server.id)}>Baskets</Link>
                      </>
                    }
                  </TableCell>
                </TableRow>
              )
            })}
            <TableRow>
              {mode === 'add' && <>
                <TableCell>
                  <IconButton
                  ><Remove /></IconButton>
                </TableCell>
                <TableCell>#</TableCell>
                <TableCell><TextField value={address} label='Address' name='address' onChange={handleInputChange} /></TableCell>
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
      <br />
      <button onClick={() => onClose()}>Close</button>
    </div>
  );
}