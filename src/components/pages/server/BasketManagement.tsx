import { useEffect, useState } from "react";
import { Card, CardHeader, Grid, IconButton, TextField } from "@material-ui/core";
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import AddIcon from '@material-ui/icons/Add';
import { defineBasket, getDefinedBaskets, updateDefinedBasket } from "../../../service";

interface BasketProps {
  name: string;
  uid: string;
  mode: 'edit' | 'view';
  onEdit: () => void;
  onSave: (model: { name: string; uid: string }) => void;
}

const Basket: React.FC<BasketProps> = ({ name, uid, mode, onEdit, onSave }) => {
  const [nameText, setNameText] = useState(name);

  useEffect(() => {
    if (mode === 'view') {
      setNameText(name);
    }
  }, [name, mode]);

  function handleClick() {
    if (mode === 'view') {
      onEdit();
    } else {
      onSave({ name: nameText, uid });
    }
  }


  return (
    <Grid item xs={12} md={4}>
      <Card>
        <CardHeader
          title={
            mode === 'edit' ? (
              <TextField
                label="Standard"
                value={nameText}
                onChange={(e) => setNameText(e.target.value)}
              />
            ) : (
              name
            )
          }
          action={
            <IconButton aria-label="settings" onClick={handleClick}>
              {mode === 'view' ? <EditIcon /> : <SaveIcon />}
            </IconButton>
          }
        />
        uid: {uid}
      </Card>
    </Grid>
  );
}

export default function Index() {
  const [nameText, setNameText] = useState<string>('');
  const [baskets, setBaskets] = useState<any[]>([]);
  const [editBasket, setEditBasket] = useState<string | null>(null);

  async function fetchBaskets() {
    const baskets = await getDefinedBaskets();
    setBaskets(baskets);
  }

  useEffect(
    () => {
      fetchBaskets();
    },
    []
  );

  async function handleSave(id: string, { name }: { name: string, uid: string }) {
    if (editBasket) {
      await updateDefinedBasket(id, name);
      setEditBasket(null);
      await fetchBaskets();
    }
  }

  async function handleAdd() {
    if(editBasket === 'new') {
      await defineBasket(nameText);
      setNameText('');
      setEditBasket(null);
      await fetchBaskets();
    }
    else {
      setEditBasket('new');
    }
  }


  return (
    <Grid container spacing={3}>
      {baskets.map((basket) => (
        <Basket
          key={basket.uid}
          name={basket.name}
          uid={basket.uid}
          mode={editBasket === basket.uid ? 'edit' : 'view'}
          onEdit={() => setEditBasket(basket.uid)}
          onSave={(...args) => handleSave(basket.id, ...args)}
        />
      ))}
      {(editBasket === 'new' || !editBasket) && <Card>
        <CardHeader
          title='Add new basket'
          action={
            <IconButton aria-label="settings" onClick={handleAdd}>
              {editBasket === 'new' ? <SaveIcon /> : <AddIcon />}
            </IconButton>
          }
        />
        {editBasket === 'new' && <TextField
          label="Standard"
          value={nameText}
          onChange={(e) => setNameText(e.target.value)}
        />}

      </Card>}
    </Grid>
  );
}
