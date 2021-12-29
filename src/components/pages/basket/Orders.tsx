import * as React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import CloseIcon from '@material-ui/icons/Close'
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import { OrderModel } from '../../../types/baskets';

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

    const Rows = ({orders,isPending}:{orders:OrderModel[],isPending?:boolean})=>{
        return <>{orders.map((row) => (
            <TableRow key={row.ticketId} className={isPending ? classes.pendings : ""}>
                <TableCell component="th" scope="row">
                    {row.ticketId}
                </TableCell>
                <TableCell align="center">{row.symbol}</TableCell>
                <TableCell align="center">{row.openTime}</TableCell>
                <TableCell align="center">{row.type}</TableCell>
                <TableCell align="center">{row.size}</TableCell>
                <TableCell align="center">{row.openPrice}</TableCell>
                <TableCell align="center">{row.stopLoss}</TableCell>
                <TableCell align="center">{row.takeProfit}</TableCell>
                <TableCell align="center" className={getAmountClass(row.profit)}>{row.profit}</TableCell>
                {!isInvestor &&  <TableCell align="center"><IconButton onClick={()=>handleCloseOrder(row.ticketId)}>
                  {!closingTicketIds.includes(row.ticketId) && <CloseIcon color='secondary' />}
                  {closingTicketIds.includes(row.ticketId) && <CircularProgress color="secondary" size={20} />}
                  </IconButton>
                </TableCell>}
            </TableRow>))}</>;
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
        <Rows orders={marketOrders} />
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
        <Rows orders={pendingOrders} isPending={true} />
      </TableBody>
    </Table>
  </TableContainer>
}