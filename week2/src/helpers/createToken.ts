import { TokenTypes } from '../lexer/tokenTypes';
import { Token } from '../lexer/token';

export const createToken = (type: TokenTypes, value?: string): Token => {
  return { type, value };
};
