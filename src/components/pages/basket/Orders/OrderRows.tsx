import { CircularProgress, createStyles, IconButton, makeStyles, TableCell, TableRow, Theme } from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close'
import { OrderModel } from "../../../../types/baskets";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
        red:{
            color:'red',
            fontWeight:'bold'
        },
        blue:{
            color:'blue',
            fontWeight:'bold'
        },
        pendings:{
          '& > th, & > td':{
            color:'#6e6d6d'
          }
        }
    })
);

interface RowsProps{
  orders:OrderModel[],
  isPending?:boolean,
  isInvestor:boolean,
  closingTicketIds:number[],
  onCloseOrder:(ticketId:number)=>void
}

export default function Rows({orders,isPending,isInvestor,closingTicketIds,onCloseOrder}:RowsProps){
  const classes = useStyles();
  
  const getAmountClass=(amount:number)=>{
    return amount > 0 ? classes.blue : (amount < 0 ? classes.red : null)
  }

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
          {!isInvestor &&  <TableCell align="center"><IconButton onClick={()=>onCloseOrder(row.ticketId)}>
            {!closingTicketIds.includes(row.ticketId) && <CloseIcon color='secondary' />}
            {closingTicketIds.includes(row.ticketId) && <CircularProgress color="secondary" size={20} />}
            </IconButton>
          </TableCell>}
      </TableRow>))}</>;
}