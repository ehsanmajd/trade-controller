import React, { useRef, useState } from 'react';
import { BasketModel, UserAccessType } from '../../../types/baskets';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ExpandableListItem from './ExpandableListItem'
import { Menu, MenuItem, TextField } from '@material-ui/core';
import { Cancel, CheckCircle, Error } from '@material-ui/icons';
import Button from '@material-ui/core/Button';
import * as services from '../../../service'

type BasketInfo = {
  basketId: string;
  name: string;
  users: UserAccessType[]
}

interface ServerCardProps {
  serverId: string;
  address: string;
  name: string;
  baskets: BasketInfo[];
  hasError: boolean;
  onDelete: VoidFunction;
  addresses: string[];
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

const InlineEditForm = (
  {
    value,
    onChange,
    className,
    onCancel,
    onSubmit
  }:
    {
      className: string;
      value: string,
      onChange: (m: string) => void;
      onCancel: VoidFunction;
      onSubmit: VoidFunction;
    }
) => {
  return (
    <div className={className}>
      <TextField value={value} onChange={e => onChange(e.target.value)} />
      <div>
        <IconButton
          onClick={onSubmit}
        >
          <CheckCircle color='primary' />
        </IconButton>
        <IconButton
          onClick={onCancel}
        >
          <Cancel color='secondary' />
        </IconButton>
      </div>
    </div>
  )
}

const ServerCard: React.FC<ServerCardProps> = ({
  serverId,
  name,
  address,
  baskets: initBaskets,
  hasError: initHasError,
  onDelete,
  addresses
}) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'view' | 'editAddress' | 'editBaskets' | 'editName'>('view');
  const [serverAddress, setServerAddress] = useState(address);
  const [serverName, setServerName] = useState(name);
  const [baskets, setBaskets] = useState<BasketInfo[]>(initBaskets);
  const [hasError, setHasError] = useState<boolean>(initHasError);
  const basketsTemp = useRef<BasketInfo[] | null>(null);

  const load = async () => {
    setLoading(true);
    const baskets = await services.loadServer(serverId) as (BasketModel &
    {
      users: UserAccessType[]
    }
    )[];
    const servers = baskets.reduce((acc, item) => {
      const server = acc.find(x => x.id === item.serverId);
      if (server) {
        server.baskets.push({
          name: item.name,
          basketId: item.basketId,
          users: item.users
        });
      }
      else {
        acc.push({
          id: item.serverId,
          address: item.address,
          baskets: item.success ? [
            {
              name: item.name,
              basketId: item.basketId,
              users: item.users
            }
          ] : [],
          hasError: !item.success
        })
      }
      return acc;
    }, []);
    setBaskets(servers[0]?.baskets);
    setHasError(servers[0]?.hasError);
    setLoading(false);
  }

  const handleBasketChange = (basketId: string, users: UserAccessType[]) => {
    const index = baskets.findIndex(x => x.basketId === basketId);
    if (index !== -1) {
      const basketsCopy = [...baskets]
      basketsCopy[index] = {
        ...baskets[index],
        users: users
      };
      setBaskets(basketsCopy);
    }
  }

  const handleEditAddress = () => {
    setMode('editAddress');
    handleClose();
  }
  
  const handleEditName = () => {
    setMode('editName');
    handleClose();
  }

  const handleEditBaskets = () => {
    basketsTemp.current = JSON.parse(JSON.stringify(baskets));
    setMode('editBaskets');
    handleClose();
  }

  const handleDelete = async () => {
    await services.deleteMyServer(serverId);
    onDelete();
    handleClose();
  }

  const handleMoreClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleCancelAddressOrNameEdit = () => setMode('view');

  const handleSubmitAddressOrName = async () => {
    if (!serverAddress) {
      // TODO: Warn user!

      return;
    }
    if (addresses.some(adr => adr === serverAddress)) {
      console.log(addresses);
      // TODO: Warn user!
      return;
    }
    await services.updateServer(serverId, { address: serverAddress, name: serverName });
    await load();
    setMode('view');
  }

  const handleSave = async () => {
    await services.updateBasketPermissions(serverId, baskets);
    setMode('view');
    basketsTemp.current = null;
  }

  const handleCancelSave = () => {
    setBaskets(basketsTemp.current);
    setMode('view');
    basketsTemp.current = null;
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
              <MenuItem onClick={handleEditBaskets}>Edit Baskets</MenuItem>
              <MenuItem onClick={handleEditAddress}>Edit Address</MenuItem>
              <MenuItem onClick={handleEditName}>Edit Name</MenuItem>
              <MenuItem onClick={handleDelete}>Delete</MenuItem>
            </Menu>
          </IconButton>
        }
        title={
          <>
            {mode !== 'editAddress' && mode !== 'editName' && <div className={classes.flex}>
              {hasError && <><Error color='secondary' />&nbsp;</>}
              <label>{serverName}-{serverAddress}</label>
            </div>}
            {mode === 'editAddress' && <InlineEditForm
              value={serverAddress}
              onChange={setServerAddress}
              className={classes.flex}
              onCancel={handleCancelAddressOrNameEdit}
              onSubmit={handleSubmitAddressOrName}
            />
            }
            {mode === 'editName' && <InlineEditForm
              value={serverName}
              onChange={setServerName}
              className={classes.flex}
              onCancel={handleCancelAddressOrNameEdit}
              onSubmit={handleSubmitAddressOrName}
            />
            }
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
                disabled={mode !== 'editBaskets'}
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
                <br />
                <Button onClick={() => load()} variant='contained' disabled={loading}>
                  {loading && 'Loading ...'}
                  {!loading && 'Retry'}
                </Button>
              </Typography>
            )}
          </div>
        </Typography>
      </CardContent>
      {mode === 'editBaskets' && <CardActions>
        <Button color='primary' variant='contained' onClick={handleSave}>Save</Button>
        <Button variant='contained' onClick={handleCancelSave}>Cancel</Button>
      </CardActions>}
    </Card>
  );
}

export default ServerCard;