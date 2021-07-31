import React from 'react';
import { Button, IconButton } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar/Snackbar';
import CloseIcon from '@material-ui/icons/Close';

interface Props {
  open: boolean;
  onClose: () => void;
  message: string;
}

export default function Info({ open, onClose, message }: Props) {
  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
      message={message}
    />
  )
}