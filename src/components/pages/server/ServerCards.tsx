import React, { useEffect, useState } from 'react';
import { BasketModel, UserAccessType } from '../../../types/baskets';
import ServerCard from './ServerCard';
import * as services from '../../../service';
import { Card, CardContent, makeStyles,  Button, TextField } from '@material-ui/core';
import Row from '../../Row';
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

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
  onAdd: (address: string) => void;
}

interface FormItems {
  address: string;
}

const schema = yup.object().shape({
  // TODO: Add ip validator
  address: yup.string().required()
});

const AddServer: React.FC<AddButtonProp> = ({ onAdd }) => {
  const classes = useStyles();
  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const { handleSubmit, control, register, reset } = useForm<FormItems>({
    defaultValues: {
      address: ''
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
    onAdd(data.address);
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

    setServers(servers);
    setLoading(false);
  }

  useEffect(
    () => {
      load();
    },
    []
  );

  const handleBasketChange = (
    server: ServerInfo,
    baskets: {
      basketId: string;
      name: string;
      users: UserAccessType[]
    }[]
  ) => {
    setServers(servers => {
      const index = servers.findIndex(x => x.id === server.id);
      if (index !== -1) {
        const temp = [...servers];
        temp[index] = {
          ...temp[index],
          baskets
        };
        return temp;
      }
    });
  }

  const handleAddServer = async (address: string) => {
    if (servers.some(x => x.address === address)) {
      // TODO: Warn user.
      return;
    }
    await services.addServer(address);
    await load();
  }

  const handleDelete = async (serverId: string) => {
    await services.deleteMyServer(serverId);
    await load();
  }

  const handleAddressSave = async (serverId: string, address: string) => {
    if (servers.some(x => x.address === address)) {
      // TODO: Warn user.
      return;
    }
    await services.updateServer(serverId, address);
    setLoading(true);
    // TODO: load the updated server only
    await load();
  }

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
            onDelete={() => handleDelete(server.id)}
            key={server.id}
            serverId={server.id}
            address={server.address}
            baskets={server.baskets}
            onBasketChange={(users) => handleBasketChange(server, users)}
            hasError={server.hasError}
            onAddressSave={(address) => handleAddressSave(server.id, address)}
          />
        ))
      }
      {!loading && <AddServer onAdd={handleAddServer} />}
    </>
  )
}

export default ServerCards;