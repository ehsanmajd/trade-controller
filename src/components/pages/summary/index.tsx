import BasketInfo from '../basket/BasketInfo';
import { useBasketsContext } from '../../../context/BasketsContext';
import { makeStyles, Theme, createStyles, Button, Grid, IconButton } from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import SaveIcon from '@material-ui/icons/Save';
import ShowChartIcon from '@material-ui/icons/ShowChart';
import { useState, useEffect } from 'react';
import { useUserContext } from '../../../context/UserContext';
import * as services from '../../../service';
import { TimeFilterType } from '../../../types/baskets';
import { TimeFilter } from '../charts';
import clsx from 'clsx';
import { useRef } from 'react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: '#f5f5f5',
      borderRadius: '8px',
      border: '1px solid #e0e0e0',
    },
    settings: {
      border: 'solid 1px #ccc',
      borderRadius: '8px',
      backgroundColor: '#f8f8f8',
      maxHeight: '0',
      opacity: '0',
      overflow: 'hidden'
    },
    expand: {
      animation: `$expand 1000ms ${theme.transitions.easing.easeInOut}`,
      maxHeight: '600px',
      opacity: '1',
    },
    collapse: {
      animation: `$collapse 500ms ${theme.transitions.easing.easeInOut}`,
      maxHeight: '0',
      opacity: '0',
    },
    baskets: {
      border: 'solid 1px #ccc',
      borderRadius: '8px',
      margin: '24px 0',
      padding: '16px',
      boxSizing: 'border-box',
      '&:nth-of-type(odd)': {
        backgroundColor: '#f8f8f8'
      }
    },
    title: {
      marginTop: 0,
      marginLeft: '16px',
    },
    icon: {
      padding: '2px',
    },
    info: {

    },
    line: {

    },
    "@keyframes expand": {
      "0%": {
        maxHeight: '0',
        opacity: '0',
      },
      "100%": {
        maxHeight: '600px',
        opacity: '1',
      }
    },
    "@keyframes collapse": {
      "100%": {
        maxHeight: '0',
        opacity: '0',
      },
      "0%": {
        maxHeight: '600px',
        opacity: '1',
      }
    }
  }),

);

const yesterday = (
  () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d;
  }
)();

export default function Summary() {
  const classes = useStyles();
  const { data, refresh } = useBasketsContext();
  const { data: userData } = useUserContext();
  const { baskets, refreshTime } = data;
  const rendered = useRef(false);

  const [showCharts, setShowCharts] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [filterType, setFilterType] = useState<TimeFilterType>(TimeFilterType.Last24Hours);
  const [from, setFrom] = useState<Date>(yesterday);
  const [to, setTo] = useState<Date>(new Date());

  useEffect(
    () => {
      rendered.current = true;
    },
    []
  );


  useEffect(
    () => {
      if (!refreshTime) {
        refresh();
      }
    },
    // eslint-disable-next-line 
    [refreshTime]
  )

  const handleDownload = async () => {
    await services.exportBaskets(userData.username);
  }

  return (
    <div className={classes.root}>
      <Grid container justify='flex-end' alignItems='center' className={classes.title}>
        <Grid item xs={10} md={11}>
          <h4>Summary</h4>
        </Grid>
        <Grid item xs={2} md={1}>
          <IconButton onClick={() => setShowSettings(!showSettings)} className={classes.icon}>
            <SettingsIcon color='primary' />
          </IconButton>
          <IconButton onClick={handleDownload} className={classes.icon} title='export'>
            <SaveIcon color='primary' />
          </IconButton>
          <IconButton onClick={() => setShowCharts(!showCharts)} className={classes.icon} title='charts'>
            <ShowChartIcon color='primary' />
          </IconButton>
        </Grid>
      </Grid>
      <Grid container className={clsx(
        classes.settings,
        {
          [classes.expand]: showSettings,
          [classes.collapse]: rendered.current && !showSettings,
        }
      )}>
        <Grid container md={4} alignItems='center'>
          <h4 style={{ paddingLeft: '28px' }}>
            Charts settings
          </h4>
        </Grid>
        <Grid container md={6} spacing={2} alignItems='center'>
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
      {baskets.map(basket => {
        return (
          <div key={basket.name} className={classes.baskets}>
            <h3>Basket: {basket.name} ({basket.parameters.length})</h3>
            <hr />
            <div>
              <BasketInfo
                data={basket.info}
                basketId={basket.basketId}
                chartSettings={{
                  type: filterType,
                  from,
                  to
                }}
                displayGraphs={showCharts}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
