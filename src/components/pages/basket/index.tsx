import { createStyles, Grid, makeStyles } from '@material-ui/core'
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Theme } from '@material-ui/core';
import DetailBox from './DetailBox';
import Settings from './Settings';
import { useEffect, useState } from 'react';
import * as service from '../../../service';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    box: {
      marginTop: 64,
      backgroundColor: theme.palette.background.default
    },
    boxContainer: {
      display: 'grid',
      marginTop: 48,
      gridGap: 16,
      [theme.breakpoints.down('xs')]: {
        gridTemplateColumns: '1fr',
        gridTemplateRows: '1fr'
      },
      [theme.breakpoints.up('sm')]: {
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: '1fr 1fr'
      },
      [theme.breakpoints.up('md')]: {
        gridTemplateColumns: '1fr 1fr 1fr 1fr',
        gridTemplateRows: '1fr'
      },
    }
  }),
);

interface BasketModel {
  name: string;
  info: {

  },
  parameters: {
    value: number;
    name: string;
    type: string;
    options: {
      key: string;
      value: number;
    }[]
  }[][]
}

export default function Basket() {
  const classes = useStyles();
  const [selectedBasket, setSelectedBasket] = useState<string | null>(null);
  const [baskets, setBaskets] = useState<BasketModel[]>([]);

  useEffect(
    () => {
      service.getBaskets()
        .then((baskets: BasketModel[]) => {
          setBaskets(baskets);
        })
    },
    []
  )



  function handleBasketChange(e, value) {
    setSelectedBasket(value.name);
  }


  return (
    <>
      <Grid container justify='center' className={classes.root}>
        <Grid justify='center' spacing={1} md={1} className={classes.box} component='div'>
          <Autocomplete
            id="combo-box-demo"
            options={baskets}
            getOptionLabel={basket => basket.name}
            style={{ width: 300 }}
            onChange={handleBasketChange}
            renderInput={(params) => <TextField {...params} label="Select your basket" variant="outlined" />}
          />
        </Grid>
      </Grid>
      {selectedBasket &&
        <>
          <h2>Basket Summary</h2>
          <Grid className={classes.boxContainer}>
            <DetailBox />
            <DetailBox />
            <DetailBox />
            <DetailBox />
          </Grid>
          <h2>Expert Setting</h2>
          <Grid className={classes.boxContainer}>
            {
              selectedBasket && baskets.find(x => x.name === selectedBasket)?.parameters.map(args => {
                return <Settings
                  title={`Expert #2`}
                  structure={args.map(arg => ({
                    name: arg.name,
                    type: arg.type as any,
                    component: arg.type === 'enum' ? 'Dropdown' : (arg.type === 'bool' ? 'Checkbox' : 'Textbox'),
                    attributes: {
                      datasource: arg.options?.map(item => ({
                        label: item.key,
                        value: item.value
                      }))
                    }
                  }))}
                  value={args.reduce((acc, item) => {
                    acc[item.name] = item.value;
                    return acc;
                  }, {})}
                />
              })
            }
          </Grid>
        </>
      }
    </>
  )
}
