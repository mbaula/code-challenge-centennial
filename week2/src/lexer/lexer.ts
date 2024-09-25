import { TokenTypes } from './tokenTypes'
import { Token } from './token'
import { createToken } from '../helpers/createToken'

export const lexer = (input: String): Token[] => {
    let current = 0
    const tokens: Token[] = []
    const NUMBERS = /[0-9]/

    while (current < input.length && input.length !== 0) {
        let char = input[current]

        switch(true) {
            case char === '{':
                tokens.push(createToken(TokenTypes.LEFT_BRACE, '{'))
                current++
                break
            
            case char === '}': 
                tokens.push(createToken(TokenTypes.RIGHT_BRACE, '}'))
                current++
                break
            
            case char === ':':
                tokens.push(createToken(TokenTypes.COLON, ':'))
                current++
                break
            
            case char === ',':
                tokens.push(createToken(TokenTypes.COMMA, ","))
                current++
                break
            
            case char === '"':
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
            
            case char === 't':
                if (input.slice(current, current + 4) === 'true') {
                    tokens.push(createToken(TokenTypes.TRUE, true))
                    current += 4
                } else {
                    tokens.push(createToken(TokenTypes.UNKNOWN, char))
                    current++
                }
                break

            case char === 'f':
                if (input.slice(current, current + 5) === 'false') {
                    tokens.push(createToken(TokenTypes.FALSE, false))
                    current += 5
                } else {
                    tokens.push(createToken(TokenTypes.UNKNOWN, char))
                    current++
                }
                break
            
            case char === 'n':
                if (input.slice(current, current + 4) === 'null') {
                    tokens.push(createToken(TokenTypes.NULL, null))
                    current += 4
                } else {
                    tokens.push(createToken(TokenTypes.UNKNOWN, char))
                    current++
                }
                break
            
            case NUMBERS.test(char):
                let numValue = ''
                let decimalFound = false

                while (current < input.length && (NUMBERS.test(input[current]) || (input[current] === '.' && !decimalFound))) {
                    if (input[current] === '.') {
                        decimalFound = true
                    }
                    numValue += input[current]
                    current++
                }

                const parsedNumber = parseFloat(numValue)

                if (!isNaN(parsedNumber)) {
                    tokens.push(createToken(TokenTypes.NUMBER, parsedNumber))
                } else {
                    throw new Error(`Invalid number format: ${numValue}`)
                }
                break
            
            case char === ' ':
            case char === '\t':
            case char === '\n':
            case char === '\r':
                current++ // Skip over the whitespace
                break
            
            case char === '[':
                tokens.push(createToken(TokenTypes.LEFT_BRACKET, '['))
                current++
                break

            case char === ']':
                tokens.push(createToken(TokenTypes.RIGHT_BRACKET, ']'))
                current++
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