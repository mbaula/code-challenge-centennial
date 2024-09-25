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
    let hasError = false

    const logError = (expected: string, token: Token): void => {
        hasError = true
        console.error(
            `Parsing Error at line ${token.line}: Expected ${expected}, but found ${token.value || token.type}`
        )
    }

    const parseValue = (): boolean => {
        const token = tokens[current]

        if (!token) {
            console.error(`Parsing Error: Unexpected end of input at line ${tokens[current - 1]?.line || 'unknown'}`)
            return false
        }

        if (validValueTokenTypes.has(token.type)) {
            if (token.type === TokenTypes.LEFT_BRACE) {
                return parseObject()
            } else if (token.type === TokenTypes.LEFT_BRACKET) {
                return parseArray()
            } else {
                current++
                return true
            }
        } else {
            logError("a valid value (string, number, object, array, boolean, or null)", token)
            return false
        }
    }

    const parseObject = (): boolean => {
        let token = tokens[current]

        if (token.type !== TokenTypes.LEFT_BRACE) {
            logError("'{' to start an object", token)
            return false
        }
        current++

        while (tokens[current] && tokens[current].type !== TokenTypes.RIGHT_BRACE) {
            token = tokens[current]

            if (token.type !== TokenTypes.STRING) {
                logError("a string for the object key", token)
                return false
            }
            current++

            token = tokens[current]

            if (token.type !== TokenTypes.COLON) {
                logError("':' after the key in an object", token)
                return false
            }
            current++

            if (!parseValue()) {
                return false
            }

            token = tokens[current]

            if (token.type === TokenTypes.COMMA) {
                current++
            } else if (token.type !== TokenTypes.RIGHT_BRACE) {
                logError("'}' or ',' to close or continue an object", token)
                return false
            }
        }

        if (tokens[current] && tokens[current].type === TokenTypes.RIGHT_BRACE) {
            current++

            if (tokens[current] && tokens[current].type !== TokenTypes.COMMA && tokens[current].type !== TokenTypes.RIGHT_BRACE && tokens[current].type !== TokenTypes.RIGHT_BRACKET) {
                logError("unexpected token after closing '}'", tokens[current])
                return false
            }
            
            return true
        } else {
            logError("'}' to close an object", tokens[current] || tokens[current - 1])
            return false
        }
    }

    const parseArray = (): boolean => {
        let token = tokens[current]

        if (token.type !== TokenTypes.LEFT_BRACKET) {
            logError("'[' to start an array", token)
            return false
        }
        current++

        while (tokens[current] && tokens[current].type !== TokenTypes.RIGHT_BRACKET) {
            if (!parseValue()) {
                return false
            }

            token = tokens[current]

            if (token.type === TokenTypes.COMMA) {
                current++
            } else if (token.type !== TokenTypes.RIGHT_BRACKET) {
                logError("']' or ',' to close or continue an array", token)
                return false
            }
        }

        if (tokens[current] && tokens[current].type === TokenTypes.RIGHT_BRACKET) {
            current++
            return true
        } else {
            logError("']' to close an array", tokens[current] || tokens[current - 1])
            return false
        }
    }

    if (tokens[current]?.type === TokenTypes.LEFT_BRACE) {
        return parseObject()
    } else if (tokens[current]?.type === TokenTypes.LEFT_BRACKET) {
        return parseArray()
    } else {
        logError("'{ or '[' at the start of the JSON document", tokens[current])
        return false
    }
}