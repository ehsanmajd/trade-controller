import React, { useEffect } from 'react';

import { createStyles, Grid, makeStyles, MenuItem, Paper, TextField, Theme } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { useState } from 'react';
import { useBasketsContext } from '../../../context/BasketsContext';
import * as services from '../../../service';
import IconButton from '@material-ui/core/IconButton';
import Back from '@material-ui/icons/ArrowBack';
import Forward from '@material-ui/icons/ArrowForward';
import BasketChart from './BasketChart';
import TimeFilter from './TimeFilter';
import { TimeFilterType } from '../../../types/baskets';

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
    chevron: {
      fontSize: '14px'
    },
    row: {
      marginBottom: '4px'
    }
  }),
);

interface ChartData {
  date: Date;
  serverId: string;
  basketId: string;
  equity: number;
  balance: number;
  margin: number;
  freeMargin: number;
  marginLevel: number;
  netLot: number;
}

const Row: React.FC = ({ children }) => {
  const classes = useStyles();
  return <Grid container justify='space-between' className={classes.row}>{children}</Grid>
}

const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1)

const Charts: React.FC = () => {
  const classes = useStyles();
  const { data, hasError, refresh } = useBasketsContext();
  const [selectedBasket, setSelectedBasket] = useState<string | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [filterType, setFilterType] = useState<TimeFilterType>(TimeFilterType.Last24Hours);
  const [from, setFrom] = useState<Date>(yesterday)
  const [to, setTo] = useState<Date>(new Date())


  const baskets = data?.baskets || [];
  const basket = baskets.find(x => x.basketId === selectedBasket);
  const index = baskets.findIndex(x => x.basketId === selectedBasket);

  const handleBasketChange = (_, value) => {
    setSelectedBasket(value?.basketId);
  }

  function navigate(mode: 'back' | 'forward') {
    setSelectedBasket(mode === 'back' ?
      baskets[index - 1].basketId :
      baskets[index + 1].basketId
    );
  }

  useEffect(
    () => {
      (async () => {
        if (selectedBasket) {
          const data = await services.getBasketStatistics(
            selectedBasket,
            {
              type: filterType,
              from,
              to
            }
          );
          setChartData(data.map(x => ({ ...x, date: new Date(x.date) })));
        }
      })();
    },
    [selectedBasket, filterType, from, to]
  );

  useEffect(
    () => {
      if (!selectedBasket && baskets && baskets.length) {
        setSelectedBasket(baskets?.[0]?.basketId);
      }
    },
    // eslint-disable-next-line 
    [baskets]
  );

  useEffect(
    () => {
      if (data.baskets.length === 0) {
        refresh();
      }
    },
    []
  );

  const backDisabled = index <= 0;
  const nextDisabled = (index === -1 && !basket) || index === baskets.length - 1;

  return (
    <Paper>
      <Grid container justify='center' className={classes.selector}>
        <Grid md={6} xs={6} container justify='center'>
          <Autocomplete
            disabled={hasError}
            value={basket || { name: '' }}
            id="combo-box-demo"
            options={baskets}
            getOptionLabel={basket => basket.name}
            style={{ flex: '1', maxWidth: '300px' }}
            onChange={handleBasketChange}
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
      <br />
      <Grid container>
        <Grid md={4}>
          <h1 style={{ paddingLeft: '28px' }}>Charts</h1>
        </Grid>
        <Grid container md={8} spacing={2} alignItems='center'>
          <TimeFilter 
            filterType={filterType}
            onFilterTypeChange={setFilterType}
            from={from}
            onFromChange={setFrom}
            to={to}
            onToChange={setTo}
          />
        </Grid>

      </Grid>
      <Row>
        <BasketChart<ChartData>
          data={chartData}
          dateProp='date'
          valueProp={['balance']}
          label='Balance'
          colors={['#AA25F4']}
        />
        <BasketChart<ChartData>
          data={chartData}
          dateProp='date'
          valueProp={['equity']}
          label='Equity'
          colors={['#142EE4']}
        />
      </Row>
      <Row>
        <BasketChart<ChartData>
          data={chartData}
          dateProp='date'
          valueProp={['margin']}
          label='Margin'
          colors={['#B20089']}
        />
        <BasketChart<ChartData>
          data={chartData}
          dateProp='date'
          valueProp={['freeMargin']}
          label='Free margin'
          colors={['#32CC18']}
        />
      </Row>
      <Row>
        <BasketChart<ChartData>
          data={chartData}
          dateProp='date'
          valueProp={['marginLevel']}
          label='Margin Level'
          colors={['#459ABC']}
        />
        <BasketChart<ChartData>
          data={chartData}
          dateProp='date'
          valueProp={['netLot']}
          label='Net Lot'
          colors={['#FFBB00']}
        />
      </Row>
    </Paper>
  )
}

export default Charts;