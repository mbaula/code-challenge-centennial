import { Token } from "../lexer/token"
import { TokenTypes } from "../lexer/tokenTypes"


export const parser = (tokens: Token[]): boolean => {
    let current = 0
    const validValueTokenTypes = new Set([
        TokenTypes.STRING,
        TokenTypes.NUMBER,
        TokenTypes.TRUE,
        TokenTypes.FALSE,
        TokenTypes.NULL
    ])

    if (tokens[current].type !== TokenTypes.LEFT_BRACE) {
        return false
    }

    current++

    // loop over key value pairs
    while(tokens[current] && tokens[current].type != TokenTypes.RIGHT_BRACE){
        if (tokens[current].type !== TokenTypes.STRING) {
            return false 
        }
    
        current++
    
        if (tokens[current].type !== TokenTypes.COLON) {
            return false 
        }
    
        current++
    
        let valueToken = tokens[current]
        if (!validValueTokenTypes.has(valueToken.type)) {
            return false
        }
    
        current++
    
        if (tokens[current] && tokens[current].type === TokenTypes.COMMA) {
            current++
            valueToken = tokens[current]
            if (!validValueTokenTypes.has(valueToken.type)) {
                return false
            }
        } else if (tokens[current] && tokens[current].type !== TokenTypes.RIGHT_BRACE) {
            return false
        }
    }
    return true
}