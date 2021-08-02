import { createStyles, Grid, makeStyles, Theme } from '@material-ui/core';
import React from 'react'
import ProgressBar from '../../PorgressBar';

interface Props {
  label: string;
  value: string | React.ReactElement | number | undefined;
  color?: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      borderBottomColor: theme.palette.grey[400],
      borderBottomStyle: 'solid',
      borderBottomWidth: '1px'
    },
    column: {
      padding: '24px',
      boxSizing: 'border-box'
    },
    row: {
      lineHeight: '36px'
    }
  }),
);

const Row = ({ label, value, color }: Props) => {
  const classes = useStyles();
  return (
    <Grid container alignItems='center' className={classes.row}>
      <Grid md={4} xs={4}>{label}</Grid>
      <Grid md={8} xs={8}>
        {color && <span style={{color: color}}>{value}</span>}
        {!color && value}
      </Grid>
    </Grid>
  )
}

const Column: React.FC = ({ children }) => {
  const classes = useStyles();
  return <Grid className={classes.column} md={6} xs={12}>{children}</Grid>
}

interface ItemData {
  value: number;
  color?: string;

}
interface BasketInfoProps {
  data?: Record<string, ItemData>
}

const INIT_STATE = {
  'Balance': {
    value: 1974.19
  },
  'Equity': {
    value: 1619.30
  },
  'Margin': {
    value: 178.75
  },
  'Free_Margin': {
    value: 1440.55
  },
  'Margin_Level(%)': {
    value: 905.90
  },
  'Total_Orders': {
    value: 18
  },
  'Total_Sell': {
    value: 0
  },
  'Total_Buy': {
    value: 0
  },
  'Sell_Buy_Diff': {
    value: 0.00,
  },
  'Total_Sell_Profit': {
    value: 0.00,
    color: '#e8173d'
  },
  'Total_Buy_Profit': {
    value: 0.00,
    color: '#e8173d'
  },
  'Total_Profit': {
    value: 0.00,
    color: '#e8173d'
  }
}

export default function BasketInfo({ data = INIT_STATE }: BasketInfoProps) {
  const classes = useStyles();
  return (
    <>
      <h2>Basket Summary</h2>
      <Grid className={classes.root} container>
        <Column>
          <Row label='Balance' value={ data['Balance']?.value} />
          <Row label='Equity' value={<ProgressBar left={data['Equity']?.value} right={data['Balance']?.value - data['Equity']?.value} />} />
          <Row label='Margin' value={<ProgressBar left={data['Margin']?.value} right={data['Free_Margin']?.value} />} />
          <Row label='Margin_Level(%)' value='125' />
          <Row label='Total_Orders' value={data['Total_Orders']?.value} />
        </Column>
        <Column>
          <Row label='Total_Sell' value={data['Total_Sell']?.value} />
          <Row label='Total_Buy' value={data['Total_Buy']?.value} />
          <Row label='Sell_Buy_Diff' value={data['Sell_Buy_Diff']?.value} />
          <Row label='Total_Sell_Profit' value={data['Total_Sell_Profit']?.value} color={data['Total_Sell_Profit']?.color} />
          <Row label='Total_Buy_Profit' value={data['Total_Buy_Profit']?.value} color={data['Total_Buy_Profit']?.color} />
          <Row label='Total_Profit' value={data['Total_Profit']?.value} color={data['Total_Profit']?.color} />
        </Column>
      </Grid>
    </>
  )
}
