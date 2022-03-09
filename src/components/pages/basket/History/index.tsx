import * as React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { OrderModel } from '../../../../types/baskets';
import Rows from './HistoryRows';
import SumRow from './SumRow';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
        table: {
            minWidth:'560px'
        },
        red:{
            color:'red',
            fontWeight:'bold'
        },
        blue:{
            color:'blue',
            fontWeight:'bold'
        },
        rightBold:{
            fontWeight:'bold',
            textAlign:'right'
        },
        pendings:{
          '& > th, & > td':{
            color:'#6e6d6d'
          }
        }
    })
);

interface HistoryProps {
  orders:OrderModel[];
}

export default function History({orders}:HistoryProps){
    const classes = useStyles();
    
    const marketOrders = orders.filter(c=> ['buy','sell'].includes(c.type)).sort((a,b)=>{
      if (a.closeTime > b.closeTime) return 1;
      if (a.closeTime < b.closeTime) return -1;
      return 0;
    });

    const depositRows = orders.filter(c=> c.orderComment && c.orderComment.toLowerCase().includes('deposit'));
    let deposit=0;
    depositRows.forEach(item=> deposit += item.profit);

    const totalProfit= (days)=>{
        let sum=0;
        const from = new Date().getTime() - days * 1000 * 60 * 60 * 24;
        marketOrders.forEach(item=>{
          const closetime = new Date(item.closeTime.toString().replace(/\./g,'/')).getTime();
          if (closetime >= from){
            sum += item.profit;
          }
        });
        return sum;
    }

    return <TableContainer component={Paper}>
    <Table className={classes.table} aria-label="simple table">
      <TableHead>
        <TableRow>
          <TableCell>Ticket Id</TableCell>
          <TableCell align="center">Symbol</TableCell>
          <TableCell align="center">Close Time</TableCell>
          <TableCell align="center">Type</TableCell>
          <TableCell align="center">Size</TableCell>
          <TableCell align="center">Open Price</TableCell>
          <TableCell align="center">S / L</TableCell>
          <TableCell align="center">T / P</TableCell>
          <TableCell align="center">Profit</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <Rows orders={marketOrders} />
        <SumRow label="Last 30 Days Profit/Loss" amount={totalProfit(30)} />
        <SumRow label="Last 7 Days Profit/Loss" amount={totalProfit(7)} />
        <SumRow label="Last 24 Hours Profit/Loss" amount={totalProfit(1)} />
        <SumRow label="Deposit" amount={deposit} />
      </TableBody>
    </Table>
  </TableContainer>
}