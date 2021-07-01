import { Box, createStyles, Grid, makeStyles, Theme } from '@material-ui/core';
import React from 'react'
import DetailContainer from './DetailContainer';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      // minWidth: 'calc(50% - 32px)',
      minHeight: 400,
      backgroundColor: theme.palette.grey[100],
      border: 'solid 1px #ccc',
      borderRadius: 5,
      padding: 16,
      boxSizing: 'border-box',
     
    },
  }),
);

export default function DetailBox() {
  const classes = useStyles();
  return (
    <DetailContainer>Abbas</DetailContainer>
  )
}
