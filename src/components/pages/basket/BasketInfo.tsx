import { createStyles, Grid, makeStyles, Theme } from '@material-ui/core';
import Button from '@material-ui/core/Button';
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
      padding: '16px 0',
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
      <Grid md={4} xs={6}><b>{label}</b></Grid>
      <Grid md={8} xs={6}>
        {color && <span style={{ color: color }}>{value}</span>}
        {!color && value}
      </Grid>
    </Grid>
  )
}

const Column: React.FC = ({ children }) => {
  const classes = useStyles();
  return <Grid className={classes.column} md={6} xs={12}>{children}</Grid>
}

interface Itemmain {
  value: number;
  color?: string;
}

export type BasketInfoModel = Record<string, Itemmain>;
interface BasketInfoProps {
  data?: {
    main: BasketInfoModel;
    extra?: BasketInfoModel[];
  }
}

const INIT_STATE = {
  main: {
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
    'Margin_Level': {
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
}

export default function BasketInfo({ data = INIT_STATE }: BasketInfoProps) {
  const { main, extra } = data || {};
  const [expanded, setExpanded] = React.useState(false);
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <h2>Basket Summary</h2>
      <Grid container>
        <Column>
          <Row label='Balance' value={main['Balance']?.value} color='#506dbe' />
          <Row label='Equity' value={<ProgressBar left={+main['Equity']?.value} right={+main['Balance']?.value - +main['Equity']?.value} hideRight />} />
          <Row label='Margin' value={<ProgressBar left={+main['Margin']?.value} right={+main['Free_Margin']?.value} />} />
          <Row label='Margin_Level' value={main['Margin_Level']?.value} />
          <Row label='Total_Market_Orders' value={main['Total_Market_Orders']?.value} />
        </Column>
        <Column>
          <Row label='Total_Sell_Lots' value={main['Total_Sell_Lots']?.value} />
          <Row label='Total_Buy_Lots' value={main['Total_Buy_Lots']?.value} />
          <Row label='Sell_Buy_Diff_Lots' value={main['Sell_Buy_Diff_Lots']?.value} />
          <Row label='Total_Sell_Profit' value={main['Total_Sell_Profit']?.value} color={main['Total_Sell_Profit']?.color} />
          <Row label='Total_Buy_Profit' value={main['Total_Buy_Profit']?.value} color={main['Total_Buy_Profit']?.color} />
          <Row label='Total_Profit' value={main['Total_Profit']?.value} color={main['Total_Profit']?.color} />
        </Column>
      </Grid>
      {expanded && <Grid container>
        {extra.map(extraData => {
          return <Column>{Object.keys(extraData).map(key => <Row label={key} value={extraData[key]?.value} color={extraData[key]?.color} />)}</Column>
        })}
      </Grid>}
      {extra && <Grid container justify='center'>
        <Grid><Button variant='outlined' onClick={() => setExpanded(p => !p)}>{`Load ${expanded ? 'less' : 'more'} ...`}</Button></Grid>
      </Grid>}
    </div>
  )
}
