import { createStyles, Grid, makeStyles, Theme } from '@material-ui/core';
import React from 'react';
import { AxisOptions, Chart } from 'react-charts';

interface Props<T> {
  dateProp: keyof T;
  valueProp: (keyof T)[];
  label: string;
  data: T[];
  colors?: string[];
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    grid: {
      padding: '40px',
      [theme.breakpoints.down('md')]: {
        paddingLeft: 0,
        paddingRight: 0,
      },
    },
    box: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      border: 'solid 1px #ccc',
      borderRadius: '5px',
      width: '100%',
      backgroundColor: '#EFF'
    },
    chart: {
      width: '80%',
      height: 'calc(50vh - 50px)',

      [theme.breakpoints.down('md')]: {
        height: 'calc(100vh - 100px)'
      },
    }
  }),
);

function BasketChart<T>({ label, data, dateProp, valueProp, colors }: Props<T>) {
  const classes = useStyles();
  const primaryAxis = React.useMemo(
    (): AxisOptions<T> => (
      {
        getValue: datum => datum[dateProp],
        formatters: {
          tooltip: (value: Date, formatters) => {
            if (!value) {
              return '';
            }
            const date = new Date(value);
            return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
          }
        }
      }
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const secondaryAxes = React.useMemo(
    (): AxisOptions<T>[] => [
      {
        // @ts-ignore
        getValue: datum => datum['value']
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [valueProp]
  )

  const chartData = React.useMemo(
    () => {
      return valueProp.map(val => {
        return {
          label: val,
          data: data.map(x => {
            return {
              // @ts-ignore
              date: x.date,
              value: x[val]
            }
          })
        }
      })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, colors]
  )

  const render = data.length !== 0;



  return <Grid md={6} xs={12} alignItems='center' container direction='column' className={classes.grid}>
    <div className={classes.box}>
      <div className={classes.chart}>
        {render && <Chart
          options={{
            defaultColors: colors,
            data: chartData as any,
            primaryAxis,
            secondaryAxes,

          }}
        />}
      </div>
      <h5>{label}</h5>
    </div>
  </Grid>

}

export default BasketChart;