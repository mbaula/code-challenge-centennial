import { TokenTypes } from './tokenTypes';

type ValidValueType = string | number | boolean | null;

export type Token = {
  type: TokenTypes;
  value?: ValidValueType;
};