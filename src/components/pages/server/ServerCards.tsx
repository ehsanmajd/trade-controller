import React, { useEffect, useState } from 'react';
import { BasketModel, UserAccessType } from '../../../types/baskets';
import ServerCard from './ServerCard';
import * as services from '../../../service';
import { Card, CardContent, makeStyles, Button, TextField } from '@material-ui/core';
import Row from '../../Row';
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useBasketsContext } from '../../../context/BasketsContext';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  center: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
});


interface AddButtonProp {
  onAdd: (m: { address: string; name: string }) => void;
}

interface FormItems {
  address: string;
  name: string;
}

const schema = yup.object().shape({
  // TODO: Add ip validator
  address: yup.string().required(),
  name: yup.string().required(),
});

const AddServer: React.FC<AddButtonProp> = ({ onAdd }) => {
  const classes = useStyles();
  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const { handleSubmit, control, register, reset } = useForm<FormItems>({
    defaultValues: {
      address: '',
      name: ''
    },
    resolver: yupResolver(schema),
    reValidateMode: 'onChange',
    shouldUseNativeValidation: false,
    shouldFocusError: true,
    mode: 'onChange'
  });
  const handleAddServer = () => {
    if (mode === 'view') {
      setMode('edit');
    }
    else {
      reset();
      setMode('view');
    }
  }

  const handleSave = (data: FormItems) => {
    onAdd({ address: data.address, name: data.name });
    reset();
    setMode('view');
  }

  return (
    <Card className={classes.root} variant="outlined">
      <CardContent className={classes.center}>
        {mode === 'edit' && <form onSubmit={handleSubmit(handleSave)}>
          <Row>
            <Controller
              // @ts-ignore
              name={'name'}
              control={control}
              render={({ field, fieldState }) => {
                return <TextField fullWidth label='name' {...field} />
              }}
              // @ts-ignore
              {...register('name')}
            />
          </Row>
          <Row>
            <Controller
              // @ts-ignore
              name={'address'}
              control={control}
              render={({ field, fieldState }) => {
                return <TextField fullWidth label='address' {...field} />
              }}
              // @ts-ignore
              {...register('address')}
            />
          </Row>
          <Button variant='contained' type="submit">
            Save
          </Button>
        </form>}
        {mode === 'view' && <Button onClick={handleAddServer} variant='contained'>
          Add server
        </Button>}
      </CardContent>
    </Card>
  )
}

interface ServerInfo {
  id: string;
  serverName: string;
  address: string;
  baskets: {
    name: string;
    basketId: string;
    users: UserAccessType[];
  }[];
  hasError: boolean;
}

const ServerCards: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [servers, setServers] = useState<ServerInfo[]>([]);
  const { reset: resetBaskets } = useBasketsContext();

  const load = async () => {
    const baskets = await services.loadMyServers() as (BasketModel &
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
          serverName: item.serverName,
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
    resetBaskets();
    setServers(servers);
    setLoading(false);
  }

  useEffect(
    () => {
      load();
    },
    []
  );

  const handleAddServer = async ({ address, name }) => {
    if (servers.some(x => x.address === address)) {
      // TODO: Warn user.
      return;
    }
    await services.addServer({ address, name });
    await load();
  }

  const handleDelete = async (serverId: string) => {
    setServers(servers => {
      return servers.filter(x => x.id !== serverId);
    })
  }

  const addresses = servers.map(x => x.address);

  return (
    <>
      {loading && <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <p>
          Loading baskets...
          <br />
          Please wait...
        </p>
      </div>
      }
      {
        !loading && servers.map(server => (
          <ServerCard
            key={server.id}
            serverId={server.id}
            name={server.serverName}
            address={server.address}
            baskets={server.baskets}
            hasError={server.hasError}
            onDelete={() => handleDelete(server.id)}
            addresses={addresses.filter(x => x !== server.address)}
          />
        ))
      }
      {!loading && <AddServer onAdd={handleAddServer} />}
    </>
  )
}

export default ServerCards;