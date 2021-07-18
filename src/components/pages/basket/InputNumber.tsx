import React, { useState } from 'react'
import TextField from '@material-ui/core/TextField'
import { useEffect } from 'react';

const Persian = {
  0: '۰',
  1: '۱',
  2: '۲',
  3: '۳',
  4: '۴',
  5: '۵',
  6: '۶',
  7: '۷',
  8: '۸',
  9: '۹',
  '.': '.'
};

const English = {
  '۰': '0',
  '۱': '1',
  '۲': '2',
  '۳': '3',
  '۴': '4',
  '۵': '5',
  '۶': '6',
  '۷': '7',
  '۸': '8',
  '۹': '9',
  '.': '.'
}


export default (props) => {
  const [val, setVal] = useState(props.value || '');
  const handleChange = (e) => {
    const newValue = (e.target.value || '').toString();
    const oldValue = (props.value || '').toString();
    if (newValue.length > oldValue.length) {
      const lastCharacter = newValue[newValue.length - 1];
      if(!Persian[lastCharacter]) {
        return;
      }
    }
    props.onChange({
      ...e,
      target: {
        ...e.target,
        value: newValue.split('').map(x => English[x] || x).join('')
      }
    })
  }

  return (
    <TextField {...props} value={(props.value || '').toString().split('').map(c => Persian[c] || c).join('')} onChange={handleChange} />
  )

}