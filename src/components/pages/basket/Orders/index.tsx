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
import Rows from './OrderRows';

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

interface OrdersProps {
    orders:OrderModel[];
    isInvestor:boolean;
    onCloseOrder:(ticketId:number)=>void;
  }

export default function Orders({orders,isInvestor,onCloseOrder}:OrdersProps){
    const classes = useStyles();

    const [closingTicketIds,setClosingTicketIds] = React.useState([]);
    
    const handleCloseOrder=(ticketId:number)=>{
      setClosingTicketIds([...closingTicketIds,ticketId]);
      onCloseOrder(ticketId);
    }

    const marketOrders = orders.filter(c=> ['buy','sell'].includes(c.type));
    const pendingOrders = orders.filter(c=> !['buy','sell'].includes(c.type));

    const totalProfit= React.useMemo(()=>{
        let sum=0;
        marketOrders.forEach(item=>sum += item.profit);
        return sum;
    },[marketOrders]);

    const getAmountClass=(amount:number)=>{
        return amount > 0 ? classes.blue : (amount < 0 ? classes.red : null)
    }

    return <TableContainer component={Paper}>
    <Table className={classes.table} aria-label="simple table">
      <TableHead>
        <TableRow>
          <TableCell>Ticket Id</TableCell>
          <TableCell align="center">Symbol</TableCell>
          <TableCell align="center">Open Time</TableCell>
          <TableCell align="center">Type</TableCell>
          <TableCell align="center">Size</TableCell>
          <TableCell align="center">Open Price</TableCell>
          <TableCell align="center">S / L</TableCell>
          <TableCell align="center">T / P</TableCell>
          <TableCell align="center">Profit</TableCell>
          {!isInvestor && <TableCell align="center">Close</TableCell>}
        </TableRow>
      </TableHead>
      <TableBody>
        <Rows 
          orders={marketOrders} 
          onCloseOrder={handleCloseOrder} 
          closingTicketIds={closingTicketIds} 
          isInvestor={isInvestor} 
        />
        {!!marketOrders.length && <TableRow key={'sum'}>
            <TableCell component="th" scope="row"></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell colSpan={3} className={classes.rightBold}>Total Profit/Loss</TableCell>
            <TableCell className={getAmountClass(totalProfit)} >{totalProfit.toFixed(2)}</TableCell>
            {!isInvestor && <TableCell></TableCell>}
          </TableRow>}
        <Rows 
          orders={pendingOrders} 
          onCloseOrder={handleCloseOrder} 
          closingTicketIds={closingTicketIds} 
          isPending={true} 
          isInvestor={isInvestor} 
        />
      </TableBody>
    </Table>
  </TableContainer>
}