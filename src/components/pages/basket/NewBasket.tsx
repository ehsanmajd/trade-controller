import { createStyles, Grid, makeStyles } from '@material-ui/core'
import TextField from '@material-ui/core/TextField';
import Back from '@material-ui/icons/ArrowBack';
import Forward from '@material-ui/icons/ArrowForward';
import Autocomplete from '@material-ui/lab/Autocomplete';
import IconButton from '@material-ui/core/IconButton';
import { Theme } from '@material-ui/core';
import Settings from './Settings';
import { useEffect, useState } from 'react';
import * as service from '../../../service';
import { BasketModel2 } from '../../../types/baskets';
import { getLastViewedBasket } from '../../../utils/basket';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    selector: {
      flexGrow: 1,
      paddingTop: '48px',
      borderBottomStyle: 'solid',
      borderBottomWidth: '1px',
      borderColor: theme.palette.grey[500],
      paddingBottom: '48px'
    },
    box: {
      width: '100%',
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
    },
    chevron: {
      fontSize: '14px'
    },
    timeStamp: {
      padding: '16px'
    }
  }),
);

const getRelatedComponent = (type: string) => {
  if (type === 'enum') {
    return 'Dropdown';
  }
  if (type === 'bool') {
    return 'Checkbox';
  }
  if (type === 'label' || type === 'lable') {
    return 'Label';
  }
  return 'Textbox';
}

export default function Basket() {
  const classes = useStyles();
  const [baskets, setBaskets] = useState<BasketModel2[]>([]);
  const [selectedExpert, setSelectedExpert] = useState<string | null>(null);
  const [selectedBasket, setSelectedBasket] = useState<string | null>(null);
  const experts = baskets.find(x => x.id === selectedBasket)?.experts || [];


  useEffect(
    () => {
      service.getBaskets2()
        .then((baskets) => {
          if (baskets.length) {
            setBaskets(baskets);
          }
        })
    },
    // eslint-disable-next-line 
    []
  );

  useEffect(
    () => {
      if (!selectedBasket && baskets && baskets.length) {
        const lastViewedBasket = getLastViewedBasket();
        if (baskets.some(x => x.id === lastViewedBasket)) {
          setSelectedBasket(lastViewedBasket);
        }
        else {
          setSelectedBasket(baskets?.[0]?.id);
        }
      }
    },
    // eslint-disable-next-line 
    [baskets]
  )
  const basket = baskets.find(x => x.id === selectedBasket);
  const index = baskets.findIndex(x => x.id === selectedBasket);


  function handleBasketChange(_, value) {
    setSelectedBasket(value?.id);
  }

  function navigate(mode: 'back' | 'forward') {
    setSelectedBasket(mode === 'back' ?
      baskets[index - 1].id :
      baskets[index + 1].id
    );
  }


  const backDisabled = index <= 0;
  const nextDisabled = (index === -1 && !basket) || index === baskets.length - 1;
  return (
    <>
      <Grid container justify='center' className={classes.selector}>
        <Grid md={6} xs={6} container justify='center'>
          <Autocomplete
            value={basket || { name: '' }}
            onChange={handleBasketChange}
            options={baskets}
            getOptionLabel={basket => basket.name}
            style={{ flex: '1', maxWidth: '300px' }}
            renderInput={(params) => <TextField {...params} label="Select your basket" variant="outlined" />}
          />
        </Grid>
        <Grid md={6} xs={6} container justify='space-evenly'>
          <Grid md={6} xs={6}>
            <IconButton
              disabled={backDisabled}
              onClick={() => navigate('back')}
            >
              <span className={classes.chevron}>Back</span>&nbsp;
              <Back color={backDisabled ? 'disabled' : 'primary'} />
            </IconButton>
          </Grid>
          <Grid md={6} xs={6}>
            <IconButton
              onClick={() => navigate('forward')}
              disabled={nextDisabled}>
              <Forward color={nextDisabled ? 'disabled' : 'primary'} />&nbsp;
              <span className={classes.chevron}>Next</span>
            </IconButton>
          </Grid>
        </Grid>
      </Grid>
      {selectedBasket &&
        <>
          <h2>Expert Setting ({experts.length})</h2>
          <Grid className={classes.boxContainer}>
            {
              selectedBasket && experts.map((args, index) => {
                const title = 'Expert title ?' // getExpertName(args.params);
                return <Settings
                  mode={args.id === selectedExpert ? 'edit' : 'view'}
                  onModeChange={(mode) => {
                    if (mode === 'edit') {
                      setSelectedExpert(args.id)
                    }
                    else {
                      setSelectedExpert(null)
                    }
                  }}
                  updating={false}
                  readonly={true}
                  disabled={false}
                  key={`${selectedBasket}-${index}`}
                  title={title}
                  structure={args.params.map(arg => ({
                    name: arg.name as any,
                    type: arg.type as any,
                    component: getRelatedComponent(arg.type),
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
                  onSubmit={console.log}
                />
              })
            }
          </Grid>
        </>}
    </>
  )
}
