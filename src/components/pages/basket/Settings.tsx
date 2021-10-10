import React from 'react'
import { MenuItem, Select } from '@material-ui/core';
import { Button, InputLabel } from '@material-ui/core'
import Row from '../../Row';
import { useForm, Controller } from "react-hook-form";
import DetailContainer from './DetailContainer';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import InputNumber from './InputNumber';
import TextField from '@material-ui/core/TextField';
import { useEffect } from 'react';


type InputTypes = 'string' | 'number' | 'boolean';

interface Input {
  component: 'Textbox' | 'Dropdown' | 'Checkbox' | 'Label';
  type: InputTypes;
  name: string;
  label?: string;
  attributes?: any;
}

interface SettingsProps {
  structure?: Input[];
  value?: object;
  title: string;
  onSubmit: (data: Record<string, unknown>) => void;
  disabled?: boolean;
  readonly: boolean;
  updating: boolean;
}

const Components = {
  'Label': (props) => <TextField {...props} InputProps={{ readOnly: true }} />,
  'Textbox': React.forwardRef((props, ref) => <InputNumber {...props} ref={ref as any} />),
  'Checkbox': (props) => {
    return <><InputLabel id={`label-${props.name}`}>{props.label}</InputLabel>
      <Select
        labelId={`label-${props.name}`}
        name={props.name}
        fullWidth
        {...props}
      >
        <MenuItem value={1}>True</MenuItem>
        <MenuItem value={0}>False</MenuItem>
      </Select>
    </>
  },
  'Dropdown': (props) => <><InputLabel id={`label-${props.name}`}>{props.label}</InputLabel>
    <Select
      labelId={`label-${props.name}`}
      {...props}
    >
      {props.datasource.map(item => <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>)}
    </Select>
  </>
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
  close_Pending_Order: number,
  close_Market_Order: number,
  terminate_strategy: number
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
          value: 1
        },
        {
          label: 'BUY',
          value: 2
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
    component: 'Dropdown',
    attributes: {
      datasource: [
        {
          label: 'None',
          value: 1
        },
        {
          label: 'Pending order',
          value: 2
        },
        {
          label: 'Market order',
          value: 3
        },
        {
          label: 'All',
          value: 4
        }
      ]
    }
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

const VALUES: Inputs = {
  channel_top: 1.28,
  channel_bottom: 1.19,
  min_distance: 10,
  lot_size: 0.1,
  order_interval: 5,
  take_profit: 10,
  stop_loss: 10,
  side: 1,
  strategy_serial: 1001,
  trailing_stop_first_step: 6,
  trailing_stop_first_modification: 1,
  trailing_stop_further_step: 1,
  trailing_stop_further_modification: 1,
  pending_order_limit_count: 5,
  maximum_market_order_count: 4,
  terminate_strategy: 0,
  close_Pending_Order: 0,
  close_Market_Order: 1,
  order_to_modify: 1,
}

const MESSAGES = {
  int: 'Enter an Integer number',
  positive: 'Only positive numbers allowed'
}

const typeMap = {
  int: yup.number().integer(MESSAGES['int']).min(0, MESSAGES['positive']).required(),
  double: yup.number().min(0, MESSAGES['positive']).required(),
}

export default function Settings({ structure = SAMPLE, readonly, title, value = VALUES, onSubmit, disabled = false, updating }: SettingsProps) {
  const shape = structure.reduce((acc, item) => {
    const validation = typeMap[item.type];
    if (!validation) {
      return acc;
    }
    return {
      ...acc,
      [item.name]: typeMap[item.type]
    }
  }, {});
  const schema = yup.object().shape(shape);
  const { handleSubmit, control, register, reset, formState } = useForm<Inputs>({
    defaultValues: value,
    resolver: yupResolver(schema),
    reValidateMode: 'onChange',
    shouldUseNativeValidation: false,
    shouldFocusError: true,
    mode: 'onChange'
  });

  useEffect(
    () => {
      if (!formState.isDirty) {
        reset(value);
      }
    },
    // eslint-disable-next-line 
    [value]
  );
  return (
    <DetailContainer style={{backgroundColor: updating ? '#ccc' : undefined}}>
      <h2>{title}</h2>
      {updating && <h3>Updating ...</h3>}
      <form onSubmit={handleSubmit(onSubmit)}>
        {
          structure.filter(x => x.name !== 'symbol').map(s => {
            return <Row key={s.name}>{
              <Controller
                // @ts-ignore
                name={s.name}
                control={control}
                render={({ field, fieldState }) => {
                  return React.createElement(Components[s.component], {
                    fullWidth: true,
                    label: s.label ?? s.name,
                    ...(s.attributes || {}),
                    ...field,
                    error: !!fieldState.error,
                    helperText: fieldState.error?.message
                  })
                }}
                // @ts-ignore
                {...register(s.name)}
              />
            }</Row>
          })
        }
        {!readonly && <Button disabled={disabled} type="submit" variant='contained' color='primary'>Save</Button>}
      </form>
    </DetailContainer>
  )
}
