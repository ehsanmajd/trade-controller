import { useState, useEffect } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import IconButton from '@material-ui/core/IconButton';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Remove from '@material-ui/icons/Remove'
import * as service from '../../../service';
import { UserBasketPermission, AccessType } from '../../../types/baskets';
import * as services from '../../../service';

const useStyles = makeStyles((theme: Theme) => ({
  table: {
    minWidth: 650,
  },
  root: {
    marginTop: theme.spacing(10)
  }
}));


export default function SharedBaskets() {
  const [baskets, setBaskets] = useState<UserBasketPermission[]>([]);
  const classes = useStyles();


  const reset = async () => {
    const servers = await service.loadSharedServers();
    setBaskets(servers);
  }

  const handleDelete = async (id: string) => {
    await services.deleteSharedBasket(id);
    reset();
  }

  useEffect(
    () => {
      reset();
    },
    []
  )

  return (
    <TableContainer className={classes.root} component={Paper}>
      <Table className={classes.table} size="small">
        <TableHead>
          <TableRow>
            <TableCell> </TableCell>
            <TableCell>Index</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Basket</TableCell>
            <TableCell>AccessType</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {baskets.map((row, index) => (
            <TableRow key={row.id}>
              <TableCell width='25px'>
                <IconButton><Remove /></IconButton>
              </TableCell>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{row.address}</TableCell>
              <TableCell>{row.basketName}</TableCell>
              <TableCell>{AccessType[row.accessType]}</TableCell>
              <TableCell>
                <a onClick={() => handleDelete(row.id)} href='#'>Delete</a>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
