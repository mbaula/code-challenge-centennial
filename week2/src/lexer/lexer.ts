import { TokenTypes } from './tokenTypes'
import { Token } from './token'
import { createToken } from '../helpers/createToken'

export const lexer = (input: String): Token[] => {
    let current = 0
    const tokens: Token[] = []

    while (current < input.length && input.length !== 0) {
        let char = input[current]

        switch(char) {
            case '{':
                tokens.push(createToken(TokenTypes.LEFT_BRACE, '{'))
                current++
                break
            
            case '}': 
                tokens.push(createToken(TokenTypes.RIGHT_BRACE, '}'))
                current++
                break
            
            case ':':
                tokens.push(createToken(TokenTypes.COLON, ':'))
                current++
                break
            
            case ',':
                tokens.push(createToken(TokenTypes.COMMA, ","))
                current++
                break
            
            case '"':
                let value = ''
                current++
                while (current < input.length && input[current] != '"') {
                    value += input[current]
                    current++
                }
                
                if(input[current] == '"') {
                    tokens.push(createToken(TokenTypes.STRING, value))
                    current++
                }
                else {
                    tokens.push(createToken(TokenTypes.UNKNOWN)) // if string does not end with "" then INVALID
                }
                break
            
            case ' ':
            case '\t':
            case '\n':
            case '\r':
                current++ // Skip over the whitespace
                break

            default:
                tokens.push(createToken(TokenTypes.UNKNOWN, char))
                current++
                break
        }
    }

    console.log(tokens)
    return tokens
}