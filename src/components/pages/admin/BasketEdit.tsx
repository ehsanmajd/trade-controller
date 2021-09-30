import React, { useEffect, useState } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { TableContainer, Paper, TableCell, TableHead, TableRow } from '@material-ui/core';
import Table from '@material-ui/core/Table/Table';
import TableBody from '@material-ui/core/TableBody/TableBody';
import * as service from '../../../service'
import { useCallback } from 'react';
import Chips from '../../Chips';
import { AccessType, BasketUsers, UserAccessType } from '../../../types/baskets';
import { User } from '../../../types/user';

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      position: 'absolute',
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
    table: {
      minWidth: 350,
    },
  }),
);

interface Props {
  userId: string;
  serverId: string;
  onClose: () => void;
}

export default function BasketEdit({ userId, serverId, onClose }: Props) {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [basketsUser, setBasketsUser] = useState<BasketUsers[]>([]);


  const handleSubmit = async () => {
    await service.updateBasketPermissions(serverId, basketsUser);
    onClose();

  }

  const reset = useCallback(
    async () => {
      const basketsUser = await service.getBasketsByServerIdForAdmin(serverId);
      setBasketsUser(basketsUser);
    },
    [userId, setBasketsUser]
  )

  useEffect(
    () => {
      reset();
    },
    [reset]
  );

  const mapUserToChip = (user: User) => {
    return {
      label: user.username,
      key: user.id
    }
  }

  const mapUserAccessToChip = (user: UserAccessType) => {
    return {
      label: user.username,
      key: user.userId
    }
  }

  const usersDatasource = async (keyword: string) => {
    const users = await service.searchUsers(keyword);
    return users.map(mapUserToChip);
  }

  const [
    handleUsersChange,
    handleInvestorsChange,
  ] = (
    (types: AccessType[]) =>
      types.map(type =>
        (basketId, users) => {
          setBasketsUser(basketUsers => {
            const currentBasketIndex = basketUsers.findIndex(x => x.basketId === basketId);

            if (currentBasketIndex === -1) {
              return basketUsers;
            }
            const others = basketUsers[currentBasketIndex]
              ?.users.filter(x => x.accessType !== type);

            const stateCopied = [...basketUsers];
            stateCopied[currentBasketIndex] = {
              ...stateCopied[currentBasketIndex],
              users: [
                ...others,
                ...users.map(user => ({
                  username: user.label,
                  userId: user.key,
                  accessType: type
                }))
              ]
            }
            return stateCopied;
          });
        }))([AccessType.User, AccessType.Investor]);

  return (
    <div style={modalStyle} className={classes.paper}>
      <TableContainer component={Paper}>
        <Table className={classes.table} size="small">
          <TableHead>
            <TableRow>
              <TableCell>Index</TableCell>
              <TableCell>Basket</TableCell>
              <TableCell>Users</TableCell>
              <TableCell>Investors</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>

            {basketsUser.map((basketUser, index) => {
              const users = basketUser.users.filter(x => x.accessType === AccessType.User);
              const investors = basketUser.users.filter(x => x.accessType === AccessType.Investor);
              return (
                <TableRow key={basketUser.basketId}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    {basketUser.basketName}
                  </TableCell>
                  <TableCell>
                    <Chips
                      datasource={usersDatasource}
                      value={users.map(mapUserAccessToChip)}
                      onChange={(items) => handleUsersChange(basketUser.basketId, items)}
                    />
                  </TableCell>
                  <TableCell>
                    <Chips
                      datasource={usersDatasource}
                      value={investors.map(mapUserAccessToChip)}
                      onChange={(items) => handleInvestorsChange(basketUser.basketId, items)}
                    />
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <br />
      <button onClick={() => onClose()}>Close</button>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}