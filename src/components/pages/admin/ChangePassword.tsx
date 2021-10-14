import { Button, createStyles, makeStyles, TextField, Theme } from '@material-ui/core';
import React from 'react';
import { useState } from 'react';
import * as adminServices from '../../../service/admin';

interface Props {
  userId: string;
  onClose: () => void;
}

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
    }
  }),
);

const Row: React.FC = ({ children }) => <div>{children}</div>

const ChangePassword: React.FC<Props> = ({ userId, onClose }) => {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const error = (
    () => {
      if (!password || !repeatPassword) {
        return 'Fill the fields.'
      }
      if (password !== repeatPassword) {
        return 'Password does not match.'
      }
    }
  )();

  const handleSave = async () => {
    if (!error) {
      await adminServices.changePassword(userId, password);
      onClose();
    }
  }

  return (
    <div style={modalStyle} className={classes.paper}>
      <form>
        <Row>
          <TextField type='password' label='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
        </Row>
        <Row>
          <TextField type='password' label='Repeat password' value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} />
        </Row>
        <Row>
          {error}
        </Row>
        <Row>
          <Button onClick={handleSave}>Save</Button>
          <Button onClick={onClose}>Cancel</Button>
        </Row>
      </form>
    </div>
  )
}

export default ChangePassword;