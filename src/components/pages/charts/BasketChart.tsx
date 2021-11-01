import { Grid } from '@material-ui/core';
import React from 'react';
import { AxisOptions, Chart } from 'react-charts';

interface Props<T> {
  dateProp: keyof T;
  valueProp: keyof T;
  label: string;
  data: T[];
  color?: string;
}

function BasketChart<T>({ label, data, dateProp, valueProp, color }: Props<T>) {
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

  return chartData.data.length !== 0 ? <Grid md={6} xs={12} alignItems='center' container direction='column' style={{padding: '40px'}}>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', border: 'solid 1px #ccc', borderRadius:'5px', width: '100%' }}>
      <div style={{ width: '80%', height: '300px' }}>
        <Chart
          style={{ height: '400px', width: '100%' }}
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