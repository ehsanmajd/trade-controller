import React, { useState } from 'react';
import { AccessType, UserAccessType } from '../../../types/baskets';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ExpandableListItem from './ExpandableListItem'
import { Menu, MenuItem, TextField } from '@material-ui/core';
import { Cancel, CheckCircle, Error } from '@material-ui/icons';

type BasketInfo = {
  basketId: string;
  name: string;
  users: UserAccessType[]
}

interface ServerCardProps {
  serverId: string;
  address: string;
  baskets: BasketInfo[];
  onBasketChange: (baskets: BasketInfo[]) => void;
  hasError: boolean;
  onDelete: VoidFunction;
  onAddressSave: (address: string) => void;
}

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  paragraph: {
    padding: '5px',
    paddingLeft: '16px',
    paddingTop: '8px'
  },
  flex: {
    display: 'flex',
    alignItems: 'center'
  }
});

const ServerCard: React.FC<ServerCardProps> = ({
  serverId,
  address,
  baskets,
  onBasketChange,
  hasError,
  onDelete,
  onAddressSave
}) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const [serverAddress, setServerAddress] = useState(address);

  const handleBasketChange = (basketId: string, users: UserAccessType[]) => {
    const index = baskets.findIndex(x => x.basketId === basketId);
    if (index !== -1) {
      const basketsCopy = [...baskets]
      basketsCopy[index] = {
        ...baskets[index],
        users: users
      };
      onBasketChange(basketsCopy);
    }
  }

  const handleEdit = () => {
    setMode('edit');
    handleClose();
  }

  const handleDelete = () => {
    onDelete();
    handleClose();
  }

  const handleMoreClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleCancel = () => setMode('view');
  const handleSubmit = () => {
    if (!address) {
      // TODO: Warn user!
      return;
    }
    onAddressSave(serverAddress);
    setMode('view');
  }

  return (
    <Card className={classes.root} variant="outlined">
      <CardHeader
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon onClick={handleMoreClick} />
            <Menu
              id={`${serverId}-vertical`}
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleEdit}>Edit</MenuItem>
              <MenuItem onClick={handleDelete}>Delete</MenuItem>
            </Menu>
          </IconButton>
        }
        title={
          <>
            {mode === 'view' && <div className={classes.flex}>
              {hasError && <><Error color='secondary' />&nbsp;</>}
              <label>{address}</label>
            </div>}
            {mode === 'edit' && <div className={classes.flex}>
              <TextField value={serverAddress} onChange={e => setServerAddress(e.target.value)} />
              <div>
                <IconButton
                  onClick={handleSubmit}
                >
                  <CheckCircle color='primary' />
                </IconButton>
                <IconButton
                  onClick={handleCancel}
                >
                  <Cancel color='secondary' />
                </IconButton>
              </div>
            </div>}
          </>
        }
      />
      <CardContent>
        <Typography className={classes.pos} color="textSecondary">
          <div>
            {baskets.map(basket => (
              <ExpandableListItem
                key={basket.basketId}
                name={basket.name}
                users={basket.users}
                basketId={basket.basketId}
                onBasketChange={(users) => handleBasketChange(basket.basketId, users)}
              />
            ))}
            {hasError && (
              <Typography className={classes.paragraph}>
                Unable to load baskets.
                <br />
                Has the server been configured properly?
                <br />
                Is the server address correct?
              </Typography>
            )}
          </div>
        </Typography>
      </CardContent>
    </Card>
  );
}

export default ServerCard;