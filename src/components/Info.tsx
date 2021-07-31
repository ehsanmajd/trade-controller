import React from 'react';
import Snackbar from '@material-ui/core/Snackbar/Snackbar';

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