import { Input, Inputs } from "./Settings";

export const SAMPLE: Input[] = [
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

export const VALUES: Inputs = {
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