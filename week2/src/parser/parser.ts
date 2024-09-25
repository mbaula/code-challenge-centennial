import { Token } from "../lexer/token"
import { TokenTypes } from "../lexer/tokenTypes"

const validValueTokenTypes = new Set([
    TokenTypes.STRING,
    TokenTypes.NUMBER,
    TokenTypes.TRUE,
    TokenTypes.FALSE,
    TokenTypes.NULL,
    TokenTypes.LEFT_BRACE,
    TokenTypes.LEFT_BRACKET
])


export const parser = (tokens: Token[]): boolean => {
    let current = 0

    const parseValue = (): boolean => {
        const token = tokens[current]

        if (validValueTokenTypes.has(token.type)) {
            if (token.type === TokenTypes.LEFT_BRACE) {
                return parseObject() 
            } else if (token.type === TokenTypes.LEFT_BRACKET) {
                return parseArray() 
            } else {
                current++ 
                return true
            }
        }
        return false
    }

    const parseObject = (): boolean => {
        if (tokens[current].type !== TokenTypes.LEFT_BRACE) {
            return false
        }
        current++ 

        while (tokens[current] && tokens[current].type !== TokenTypes.RIGHT_BRACE) {
            if (tokens[current].type !== TokenTypes.STRING) {
                return false
            }
            current++ 

            if (tokens[current].type !== TokenTypes.COLON) {
                return false
            }
            current++

            if (!parseValue()) {
                return false
            }

            if (tokens[current].type === TokenTypes.COMMA) {
                current++ 
            } else if (tokens[current].type !== TokenTypes.RIGHT_BRACE) {
                return false
            }
        }

        current++
        return true
    }

    const parseArray = (): boolean => {
        if (tokens[current].type !== TokenTypes.LEFT_BRACKET) {
            return false
        }
        current++

        while (tokens[current] && tokens[current].type !== TokenTypes.RIGHT_BRACKET) {
            if (!parseValue()) {
                return false
            }

            if (tokens[current].type === TokenTypes.COMMA) {
                current++ 
            } else if (tokens[current].type !== TokenTypes.RIGHT_BRACKET) {
                return false 
            }
        }

        current++
        return true
    }
    
    return parseObject() || parseArray()
}