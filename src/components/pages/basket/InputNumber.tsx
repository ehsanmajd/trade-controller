import TextField from '@material-ui/core/TextField'

const Mapping = {
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
  '.': '.',
  '0': '0',
  '1': '1',
  '2': '2',
  '3': '3',
  '4': '4',
  '5': '5',
  '6': '6',
  '7': '7',
  '8': '8',
  '9': '9',
}


export default function InputNumber(props) {
  const normalizeValue = (v: number | string) => {
    if (typeof v === 'string') {
      return (v || '').trim() || '';
    }
    return v ?? (typeof v === 'number' ? 0 : '');
  }
  const val = normalizeValue(props.value);
  const handleChange = (e) => {
    const newValue = normalizeValue(e.target.value).toString();
    const oldValue = val.toString();
    if (newValue.length > oldValue.length) {
      const lastCharacter = newValue[newValue.length - 1];
      if (!Mapping[lastCharacter]) {
        return;
      }
    }
    props.onChange({
      ...e,
      target: {
        ...e.target,
        value: newValue.split('').map(x => Mapping[x] || x).join('')
      }
    })
  }

  return (
    <TextField {...props} value={val} onChange={handleChange} />
  )

}