import { TokenTypes } from './tokenTypes';

export type Token = {
  type: TokenTypes;
  value?: string;
};