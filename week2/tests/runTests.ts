import fs from 'fs'
import path from 'path'
import { lexer } from '../src/lexer/lexer'
import { TokenTypes } from '../src/lexer/tokenTypes'
import { parser } from '../src/parser/parser'

const isValidJson = (input: string): boolean => {
  try {
    const tokens = lexer(input)
    if (tokens === undefined || tokens.length == 0) {
      return false
    }
    return parser(tokens)
  } catch (error) {
    console.error('Error during parsing:', error)
    return false
  }
}

const runTest = (filePath: string): void => {
  const jsonContent = fs.readFileSync(filePath, 'utf8')
  const isValid = isValidJson(jsonContent)

  if (isValid) {
    console.log(`✅ ${path.basename(filePath)}: Valid`)
  } else {
    console.error(`❌ ${path.basename(filePath)}: Invalid`)
  }
}

const runTestsInFolder = (folderPath: string): void => {
  const files = fs.readdirSync(folderPath)
  files.forEach(file => {
    const fullPath = path.join(folderPath, file)
    if (file.endsWith('.json')) {
      runTest(fullPath)
    }
  })
}

const main = () => {
  const testsDir = path.join(__dirname, '.')
  const subfolders = fs.readdirSync(testsDir).filter(file => fs.statSync(path.join(testsDir, file)).isDirectory())

  subfolders.forEach(subfolder => {
    const subfolderPath = path.join(testsDir, subfolder)
    console.log(`Running tests in folder: ${subfolder}`)
    runTestsInFolder(subfolderPath)
  })
}

main()
