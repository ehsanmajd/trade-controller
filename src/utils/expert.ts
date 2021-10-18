import { ParameterType } from "../types/baskets";

export function getExpertName(model: ParameterType[]): string {
  const symbol = model.find(x => x.name === 'symbol')?.type;

  const strategy = model.find(x => x.name === 'strategy_serial')?.value?.toString() || 'Unknow';
  return `${strategy} ${symbol ? `(${symbol})` : ''}`
}