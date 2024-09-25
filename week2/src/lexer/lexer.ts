import { TokenTypes } from './tokenTypes';
import { Token } from './token';
import { createToken } from '../helpers/createToken';

export const lexer = (input: String): Token[] => {
    let current = 0
    const tokens: Token[] = []

    while (current < input.length) {
        let char = input[current]

        switch(char) {
            case '{':
                tokens.push(createToken(TokenTypes.LEFT_BRACE))
                current++
                break
            
            case '}': 
                tokens.push(createToken(TokenTypes.RIGHT_BRACE))
                current++
                break
            
            default:
                tokens.push(createToken(TokenTypes.UNKNOWN, char));
                current++;
                break;
        }
    }

    return tokens
}