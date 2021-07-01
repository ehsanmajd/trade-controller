import { Container, createStyles, Grid, makeStyles } from '@material-ui/core'
import React from 'react'
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Box from '@material-ui/core/Box';
import { Theme } from '@material-ui/core';
import DetailBox from './DetailBox';
import Settings from './Settings';

const basketList = [
  {
    title: 'FXCM EURCAD', id: '1'
  },
  {
    title: 'Alpari USDCAD', id: '2',
  },
  {
    title: 'FXCM', id: '3',
  }
]


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    box: {
      marginTop: 64
    },
    boxContainer: {
      display: 'grid',
      marginTop: 48,
      gridGap: 16,
      [theme.breakpoints.down('sm')]: {
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: '1fr 1fr'
      },
      [theme.breakpoints.up('md')]: {
        gridTemplateColumns: '1fr 1fr 1fr 1fr',
      },
    }
  }),
);

export default function Basket() {
  const classes = useStyles();
  return (
    <>
      <Grid container justify='center' className={classes.root}>
        <Grid justify='center' spacing={1} m={1} className={classes.box}>
          <Autocomplete
            id="combo-box-demo"
            options={basketList}
            getOptionLabel={(option) => option.title}
            style={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Combo box" variant="outlined" />}
          />
        </Grid>
      </Grid>
      <h2>Basket Summary</h2>
      <Grid className={classes.boxContainer}>
        <DetailBox />
        <DetailBox />
        <DetailBox />
        <DetailBox />
      </Grid>
      <h2>Expert Setting</h2>
      <Box className={classes.boxContainer}>
        <Settings />
        <Settings />
        <Settings />
        <Settings />
      </Box>
    </>
  )
}
