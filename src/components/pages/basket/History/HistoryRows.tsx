import * as React from 'react';
import { makeStyles, createStyles, TableCell, TableRow, Theme } from '@material-ui/core';
import { OrderModel } from '../../../../types/baskets';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
        red:{
            color:'red',
            fontWeight:'bold'
        },
        blue:{
            color:'blue',
            fontWeight:'bold'
        }
    })
);

export default function Rows ({orders}:{orders:OrderModel[]}){
  const classes = useStyles();

  const getAmountClass=(amount:number)=>{
    return amount > 0 ? classes.blue : (amount < 0 ? classes.red : null)
  }
  return <>{orders.map((row) => (
      <TableRow key={row.ticketId}>
          <TableCell component="th" scope="row">
              {row.ticketId}
          </TableCell>
          <TableCell align="center">{row.symbol}</TableCell>
          <TableCell align="center">{row.closeTime}</TableCell>
          <TableCell align="center">{row.type}</TableCell>
          <TableCell align="center">{row.size}</TableCell>
          <TableCell align="center">{row.openPrice}</TableCell>
          <TableCell align="center" style={{backgroundColor:`${row.orderComment?.includes('[sl]') ? '#f44336':'unset'}`}} >{row.stopLoss}</TableCell>
          <TableCell align="center" style={{backgroundColor:`${row.orderComment?.includes('[tp]') ? '#4caf50':'unset'}`}}>{row.takeProfit}</TableCell>
          <TableCell align="center" className={getAmountClass(row.profit)}>{row.profit}</TableCell>
      </TableRow>))}</>;
}