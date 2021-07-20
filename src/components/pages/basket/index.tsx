import { createStyles, Grid, makeStyles } from '@material-ui/core'
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import IconButton from '@material-ui/core/IconButton';
import { Theme } from '@material-ui/core';
import Settings from './Settings';
import { useEffect, useState } from 'react';
import * as service from '../../../service';
import Back from '@material-ui/icons/ArrowBack';
import Forward from '@material-ui/icons/ArrowForward';


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
    },
    baskets: {
      dispay: 'flex'
    }
  }),
);


type ParameterType = {
  value: unknown;
  name: string;
  type: string;
  options: {
    key: string;
    value: number;
  }[]
};

type ParameterFileType = {
  params: ParameterType[];
  id: string;
}
export interface BasketModel {
  serverId?: string;
  name: string;
  info: {

  },
  parameters: ParameterFileType[]
}

export default function Basket() {
  const classes = useStyles();
  const [selectedBasket, setSelectedBasket] = useState<string | null>(null);
  const [baskets, setBaskets] = useState<BasketModel[]>([]);

  const basket = baskets.find(x => x.name === selectedBasket);
  const parameterFiles = basket?.parameters;

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
    setSelectedBasket(value?.name);
  }

  async function handleSubmit(data: Record<string, unknown>, model: ParameterType[], filePath: string) {
    Object.keys(data)
      .forEach(key => {
        model.find(x => x.name === key)!.value = data[key];
      });
    const basket = baskets.find(x => x.name === selectedBasket);
    await service.updateExpert(basket.serverId, selectedBasket, filePath, model);
  }
  const index = baskets.findIndex(x => x.name === selectedBasket);

  function navigate(mode: 'back' | 'forward') {
    setSelectedBasket(mode === 'back' ?
      baskets[index - 1].name :
      baskets[index + 1].name
    );
  }


  return (
    <>
      <Grid container justify='center' className={classes.root}>
        <Grid container justify='space-between' spacing={1} md={6} className={classes.box} component='div'>
          <IconButton
            disabled={index <= 0}
            onClick={() => navigate('back')}
          >
            <Back color='primary' />
          </IconButton>
          <Autocomplete
            value={basket || { name: '' }}
            id="combo-box-demo"
            options={baskets}
            getOptionLabel={basket => basket.name}
            style={{ width: 300 }}
            onChange={handleBasketChange}
            renderInput={(params) => <TextField {...params} label="Select your basket" variant="outlined" />}
          />
          <IconButton
            onClick={() => navigate('forward')}
            disabled={(index === -1 && !basket) || index === baskets.length - 1}>
            <Forward color='primary' />
          </IconButton>
        </Grid>
      </Grid>
      {selectedBasket &&
        <>
          <h2>Basket Summary</h2>
          {/* <Grid className={classes.boxContainer}>
            <DetailBox />
            <DetailBox />
            <DetailBox />
            <DetailBox />
          </Grid> */}
          <h2>Expert Setting</h2>
          <Grid className={classes.boxContainer}>
            {
              selectedBasket && parameterFiles.map((args, index) => {
                return <Settings
                  key={`${selectedBasket}-${index}`}
                  title={`Expert ${index + 1}`}
                  structure={args.params.map(arg => ({
                    name: arg.name as any,
                    type: arg.type as any,
                    component: arg.type === 'enum' ? 'Dropdown' : (arg.type === 'bool' ? 'Checkbox' : 'Textbox'),
                    attributes: {
                      datasource: arg.options?.map(item => ({
                        label: item.key,
                        value: item.value
                      }))
                    }
                  }))}
                  value={args.params.reduce((acc, item) => {
                    acc[item.name] = item.value;
                    return acc;
                  }, {})}
                  onSubmit={(data) => handleSubmit(data, args.params, args.id)}
                />
              })
            }
          </Grid>
        </>
      }
    </>
  )
}
