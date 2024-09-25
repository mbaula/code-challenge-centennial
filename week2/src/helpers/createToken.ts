import { TokenTypes } from '../lexer/tokenTypes';
import { Token } from '../lexer/token';

type ValidValueType = string | number | boolean | null;

export const createToken = (type: TokenTypes, value?: ValidValueType): Token => {
  return { type, value };
};
