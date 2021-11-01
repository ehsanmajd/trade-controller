import { createStyles, Grid, makeStyles, Theme } from '@material-ui/core';
import React from 'react';
import { AxisOptions, Chart } from 'react-charts';

interface Props<T> {
  dateProp: keyof T;
  valueProp: keyof T;
  label: string;
  data: T[];
  color?: string;
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
      borderRadius:'5px', 
      width: '100%',
      backgroundColor: '#EFF'
    },
    chart: {
      width: '80%', 
      height: '300px'
    }
  }),
);

function BasketChart<T>({ label, data, dateProp, valueProp, color }: Props<T>) {
  const classes = useStyles();
  const primaryAxis = React.useMemo(
    (): AxisOptions<T> => ({
      getValue: datum => datum[dateProp]
    }),
    []
  )

  const secondaryAxes = React.useMemo(
    (): AxisOptions<T>[] => [
      {
        getValue: datum => datum[valueProp],
      },
    ],
    []
  )

  const chartData = React.useMemo(
    () => {
      return {
        label,
        data,
        color: 'red'
      }
    },
    [data, color]
  )

  return chartData.data.length !== 0 ? <Grid md={6} xs={12} alignItems='center' container direction='column' className={classes.grid}>
    <div className={classes.box}>
      <div className={classes.chart}>
        <Chart
          // style={{ height: '400px', width: '100%' }}
          options={{
            defaultColors: [color],
            data: [chartData],
            primaryAxis,
            secondaryAxes,
          }}
        />
      </div>
      <h5>{label}</h5>
    </div>
  </Grid> : null

}

export default BasketChart;