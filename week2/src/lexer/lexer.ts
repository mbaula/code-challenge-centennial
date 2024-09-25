import { TokenTypes } from './tokenTypes'
import { Token } from './token'
import { createToken } from '../helpers/createToken'

const ESCAPE_SEQUENCES: Record<string, string> = {
    'b': '\b',
    'f': '\f',
    'n': '\n',
    'r': '\r',
    't': '\t',
    '"': '\"',
    '\\': '\\',
    '/': '/'
}
  

export const lexer = (input: String): Token[] => {
    let current = 0
    const tokens: Token[] = []
    let line = 1
    const NUMBERS = /[0-9]/

    while (current < input.length && input.length !== 0) {
        let char = input[current]

        switch(true) {
            case char === '{':
                tokens.push(createToken(TokenTypes.LEFT_BRACE, '{', line))
                current++
                break
            
            case char === '}': 
                tokens.push(createToken(TokenTypes.RIGHT_BRACE, '}', line))
                current++
                break
            
            case char === ':':
                tokens.push(createToken(TokenTypes.COLON, ':', line))
                current++
                break
            
            case char === ',':
                tokens.push(createToken(TokenTypes.COMMA, ",", line))
                current++
                break
            
            case char === '"':
                let value = ''
                current++
                while (current < input.length && input[current] !== '"') {
                    if (input[current] === '\\') {
                        current++ // Skip the backslash
            
                        const escapeChar = input[current]
                        if (ESCAPE_SEQUENCES[escapeChar]) {
                            value += ESCAPE_SEQUENCES[escapeChar] // Handle regular escape sequences like \\ or \n
                        } else if (escapeChar === 'u') {
                            // Handle Unicode escape sequence (\uXXXX)
                            const hex = input.substr(current + 1, 4)
                            if (/^[0-9a-fA-F]{4}$/.test(hex)) {
                                value += String.fromCharCode(parseInt(hex, 16))
                                current += 4 // Move past the 4 hex digits
                            } else {
                                throw new Error(`Invalid Unicode escape sequence: \\u${hex}`)
                            }
                        } else {
                            throw new Error(`Invalid escape character: \\${escapeChar}`)
                        }
                    } else {
                        value += input[current] // Regular character
                    }
                    current++
                }
            
                if (input[current] === '"') {
                    tokens.push(createToken(TokenTypes.STRING, value, line))
                    current++
                } else {
                    tokens.push(createToken(TokenTypes.UNKNOWN, value, line)) // Invalid string (no closing quote)
                }
                break
                
            
            case char === 't':
                if (input.slice(current, current + 4) === 'true') {
                    tokens.push(createToken(TokenTypes.TRUE, true, line))
                    current += 4
                } else {
                    tokens.push(createToken(TokenTypes.UNKNOWN, char, line))
                    current++
                }
                break

            case char === 'f':
                if (input.slice(current, current + 5) === 'false') {
                    tokens.push(createToken(TokenTypes.FALSE, false, line))
                    current += 5
                } else {
                    tokens.push(createToken(TokenTypes.UNKNOWN, char, line))
                    current++
                }
                break
            
            case char === 'n':
                if (input.slice(current, current + 4) === 'null') {
                    tokens.push(createToken(TokenTypes.NULL, null, line))
                    current += 4
                } else {
                    tokens.push(createToken(TokenTypes.UNKNOWN, char, line))
                    current++
                }
                break
            
            case NUMBERS.test(char) || char === '-':
                let numValue = ''
                let decimalFound = false
                let exponentFound = false

                if (char === '-') {
                    numValue += char
                    current++
                    char = input[current]
                }
            
                while (current < input.length && (NUMBERS.test(input[current]) || (input[current] === '.' && !decimalFound) || ((input[current] === 'e' || input[current] === 'E') && !exponentFound))) {
                    if (input[current] === '.') {
                        decimalFound = true
                    }
                    if (input[current] === 'e' || input[current] === 'E') {
                        exponentFound = true
                        numValue += input[current]
                        current++
                        if (input[current] === '+' || input[current] === '-') {
                            numValue += input[current]
                            current++
                        }
                        continue
                    }
                    numValue += input[current]
                    current++
                }
            
                tokens.push(createToken(TokenTypes.NUMBER, numValue, line))
                break    
            
            case char === '\n':
            line++
            current++
            break

            
            case char === ' ':
            case char === '\t':
            case char === '\r':
                current++ // Skip over the whitespace
                break
            
            case char === '[':
                tokens.push(createToken(TokenTypes.LEFT_BRACKET, '[', line))
                current++
                break

            case char === ']':
                tokens.push(createToken(TokenTypes.RIGHT_BRACKET, ']', line))
                current++
                break

            default:
                tokens.push(createToken(TokenTypes.UNKNOWN, char, line))
                current++
                break
        }
    }
    return tokens
}