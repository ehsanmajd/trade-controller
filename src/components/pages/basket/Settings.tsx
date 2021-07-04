import { MenuItem, Select } from '@material-ui/core';
import { Button, Checkbox, createStyles, FormControlLabel, InputLabel, makeStyles, TextField, Theme } from '@material-ui/core'
import React from 'react'
import { useForm, SubmitHandler } from "react-hook-form";
import DetailContainer from './DetailContainer';




type InputTypes = 'string' | 'number' | 'boolean';

interface Input {
  component: 'Textbox' | 'Dropdown' | 'Checkbox';
  type: InputTypes;
  name: string;
  label?: string;
  attributes?: any;
}



const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    row: {
      marginTop: 4,
      marginBottom: 4,
      padding: 2,
      boxSizing: 'border-box'
    },
  }),
);

const Row: React.FC = ({ children }) => {
  const classes = useStyles();
  return <div className={classes.row}>{children}</div>
}

interface SettingsProps {
  structure?: Input[];
  value?: object;
  title: string;
}

const Components = {
  'Textbox': (props) => <TextField fullWidth label='channel_top' {...props} />,
  'Checkbox': ({ label, ...rest }) => <FormControlLabel
    control={<Checkbox {...rest} />}
    label={label}
  />,
  'Dropdown': (props) => <><InputLabel id={`label-${props.name}`}>{props.label}</InputLabel>
    <Select
      labelId={`label-${props.name}`}
      id={props.name}
      value={props.value}
      onChange={props.onChange}
      fullWidth
    >
      {props.datasource.map(item => <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>)}
    </Select>
  </>,
}
type Inputs = {
  channel_top: number,
  channel_bottom: number,
  min_distance: number,
  lot_size: number,
  order_interval: number,
  take_profit: number,
  stop_loss: number,
  side: number,
  strategy_serial: number,
  trailing_stop_first_step: number,
  trailing_stop_first_modification: number,
  trailing_stop_further_step: number,
  trailing_stop_further_modification: number,
  pending_order_limit_count: number,
  maximum_market_order_count: number,
  order_to_modify: number,
  close_Pending_Order: boolean,
  close_Market_Order: boolean,
  terminate_strategy: boolean
};

const SAMPLE: Input[] = [
  {
    name: 'channel_top',
    type: 'number',
    component: 'Textbox',
  },
  {
    name: 'channel_bottom',
    type: 'number',
    component: 'Textbox',
  },
  {
    name: 'min_distance',
    type: 'number',
    component: 'Textbox',
  },
  {
    name: 'lot_size',
    type: 'number',
    component: 'Textbox',
  },
  {
    name: 'order_interval',
    type: 'number',
    component: 'Textbox',
  },
  {
    name: 'take_profit',
    type: 'number',
    component: 'Textbox',
  },
  {
    name: 'stop_loss',
    type: 'number',
    component: 'Textbox',
  },
  {
    name: 'side',
    type: 'number',
    component: 'Dropdown',
    attributes: {
      datasource: [
        {
          label: 'SELL',
          value: '1'
        },
        {
          label: 'BUY',
          value: '2'
        }
      ]
    }
  },
  {
    name: 'strategy_serial',
    type: 'number',
    component: 'Textbox',
  },
  {
    name: 'trailing_stop_first_step',
    type: 'number',
    component: 'Textbox',
  },
  {
    name: 'trailing_stop_first_modification',
    type: 'number',
    component: 'Textbox',
  },
  {
    name: 'trailing_stop_further_step',
    type: 'number',
    component: 'Textbox',
  },
  {
    name: 'trailing_stop_further_modification',
    type: 'number',
    component: 'Textbox',
  },
  {
    name: 'pending_order_limit_count',
    type: 'number',
    component: 'Textbox',
  },
  {
    name: 'maximum_market_order_count',
    type: 'number',
    component: 'Textbox',
  },
  {
    name: 'order_to_modify',
    type: 'number',
    component: 'Textbox',
  },
  {
    name: 'close_Pending_Order',
    type: 'number',
    component: 'Checkbox',
  },
  {
    name: 'close_Market_Order',
    type: 'number',
    component: 'Checkbox',
  },
  {
    name: 'terminate_strategy',
    type: 'number',
    component: 'Checkbox',
  },
]

export default function Settings({ structure = SAMPLE, title }: SettingsProps) {
  const { register, handleSubmit } = useForm<Inputs>();



  const onSubmit: SubmitHandler<Inputs> = data => console.log(data);
  return (
    <DetailContainer>
      <h2>{title}</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {
          structure.map(s => {
            return <Row>{
              Components[s.component]({
                fullWidth: true,
                label: s.label ?? s.name,
                ...register(s.name as any),
                ...(s.attributes || {})
              })
            }</Row>
          })
        }
        <Button type="submit" variant='contained' color='primary'>Save</Button>
      </form>
    </DetailContainer>
  )
}
