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
import Info from '../../Info';
import BasketInfo, { BasketInfoModel } from './BasketInfo';
import { Refresh } from '@material-ui/icons';

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
  headerValue: string;
}
export interface BasketModel {
  serverId?: string;
  name: string;
  info: {
    main: BasketInfoModel;
    extra?: BasketInfoModel[];
  };
  parameters: ParameterFileType[]
}

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
  const [selectedBasket, setSelectedBasket] = useState<string | null>(null);
  const [baskets, setBaskets] = useState<BasketModel[]>([]);
  const [savedExpert, setSavedExpert] = useState<string>('');

  const basket = baskets.find(x => x.name === selectedBasket);
  const parameterFiles = basket?.parameters;
  const index = baskets.findIndex(x => x.name === selectedBasket);

  useEffect(
    () => {
      refresh();
    },
    []
  )

  function handleBasketChange(e, value) {
    setSelectedBasket(value?.name);
  }

  function getExpertName(model: ParameterType[]): string {
    const symbol = model.find(x => x.name === 'symbol')?.type;

    const strategy = model.find(x => x.name === 'strategy_serial')?.value.toString() || 'Unknow';
    return `${strategy} ${symbol ? `(${symbol})` : ''}`
  }

  async function handleSubmit(data: Record<string, unknown>, model: ParameterType[], filePath: string, headerValue: string) {

    Object.keys(data)
      .forEach(key => {
        model.find(x => x.name === key)!.value = data[key];
      });
    const basket = baskets.find(x => x.name === selectedBasket);
    model = model.filter(x => x.name !== 'symbol');
    await service.updateExpert(basket.serverId, selectedBasket, filePath, model, headerValue);
    const title = getExpertName(model);
    setSavedExpert(title);
  }

  function navigate(mode: 'back' | 'forward') {
    setSelectedBasket(mode === 'back' ?
      baskets[index - 1].name :
      baskets[index + 1].name
    );
  }

  function refresh() {
    service.getBaskets()
      .then((baskets: BasketModel[]) => {
        setBaskets(baskets);
      })
  }

  const backDisabled = index <= 0;
  const nextDisabled = (index === -1 && !basket) || index === baskets.length - 1;

  return (
    <>
      <Grid container justify='center' className={classes.selector}>
        <Grid md={6} xs={6} container justify='center'>
          <Autocomplete
            value={basket || { name: '' }}
            id="combo-box-demo"
            options={baskets}
            getOptionLabel={basket => basket.name}
            style={{ flex: '1', maxWidth: '300px' }}
            onChange={handleBasketChange}
            renderInput={(params) => <TextField {...params} label="Select your basket" variant="outlined" />}
          />
          <IconButton onClick={() => refresh()}><Refresh /></IconButton>
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
          <BasketInfo data={basket.info} />
          <h2>Expert Setting</h2>
          <Grid className={classes.boxContainer}>
            {
              selectedBasket && parameterFiles.map((args, index) => {
                const title = getExpertName(args.params);
                return <Settings
                  key={`${selectedBasket}-${index}`}
                  title={`EA: "${title}"`}
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
                  onSubmit={(data) => handleSubmit(data, args.params, args.id, args.headerValue)}
                />
              })
            }
          </Grid>
          <Info message={`The changes has been successfully applied to EA: "${savedExpert}".`} open={!!savedExpert} onClose={() => setSavedExpert('')} />
        </>
      }
    </>
  )
}
