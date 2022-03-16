import React from 'react';
import { Grid, Typography, Button, Paper, makeStyles, IconButton, TextField } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import EditIcon from '@material-ui/icons/Edit';
import CancelIcon from '@material-ui/icons/Cancel';
import DeleteIcon from '@material-ui/icons/Delete';
import CheckCircle from '@material-ui/icons/CheckCircle';

interface Props {
  name: string;
  ip: string;
  mode?: 'edit' | 'view';
}


const useStyles = makeStyles({
  icon: {
    padding: '0',
  }
});


const UserServer: React.FC<Props> = ({ name, ip }) => {
  const classes = useStyles();
  const [mode, setMode] = React.useState<'edit' | 'view'>('view');
  const [confirmationMode, setConfirmationMode] = React.useState(false);
  const isEditMode = mode === 'edit';

  const handleCancel = () => {
    setMode('view');
  }


  const renderConfirmation = () => {
    return (
      <Grid container spacing={3} wrap='nowrap' justify='center'>
        <Grid item xs={12}>
          <Typography>
            Are you sure you want to delete this server?
          </Typography>
        </Grid>
        <IconButton
          className={classes.icon}
          onClick={() => {
            setConfirmationMode(false);
            setMode('view');
          }}
        >
          <CheckCircle color='primary' />
        </IconButton>
        <IconButton
          className={classes.icon}
          onClick={() => {
            setConfirmationMode(false);
            setMode('view');
          }}
        >
          <CancelIcon />
        </IconButton>
      </Grid>
    )
  }

  return (
    <Grid container style={{ gap: 8 }}>
      {confirmationMode && renderConfirmation()}
      {!confirmationMode && <Grid item xs={5}>
        {isEditMode && <TextField fullWidth placeholder='name' />}
        {!isEditMode && <Typography>{name}</Typography>}
      </Grid>}
      {!confirmationMode && <Grid
        item
        xs={6}
        container
        wrap='nowrap'
        alignItems='flex-end'
        style={{ gap: 4 }}
        justify='space-between'
      >
        {isEditMode && <>
          <TextField fullWidth placeholder='ip' />
          <IconButton color='primary' className={classes.icon}>
            <SaveIcon />
          </IconButton>
          <IconButton color='secondary' className={classes.icon} onClick={handleCancel}>
            <CancelIcon />
          </IconButton>
        </>}
        {!isEditMode && <>
          <Typography variant='body1'>{ip}</Typography>
          <IconButton color='primary' className={classes.icon} onClick={() => setMode('edit')}>
            <EditIcon />
          </IconButton>
          <IconButton color='secondary' className={classes.icon} onClick={() => setConfirmationMode(true)}>
            <DeleteIcon />
          </IconButton>
        </>}
      </Grid>}
      <Button fullWidth variant='outlined' color='primary'>+</Button>
    </Grid>
  )
}

export default UserServer;