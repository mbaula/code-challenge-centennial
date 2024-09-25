import fs from 'fs'
import path from 'path'
import { lexer } from './src/lexer/lexer'
import { parser } from './src/parser/parser'

const isValidJson = (input: string): boolean => {
  try {
    const tokens = lexer(input)
    if (tokens === undefined || tokens.length === 0) {
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
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      runTestsInFolder(fullPath) 
    } else if (file.endsWith('.json')) {
      runTest(fullPath) 
    }
  })
}

const main = () => {
  const folderName = process.argv[2] 
  if (!folderName) {
    console.error('Please provide a folder name to run tests.')
    process.exit(1)
  }

  const folderPath = path.resolve(__dirname, folderName) 
  
  if (!fs.existsSync(folderPath) || !fs.statSync(folderPath).isDirectory()) {
    console.error(`The folder "${folderName}" does not exist or is not a directory.`)
    process.exit(1)
  }

  console.log(`Running tests in folder: ${folderName}`)
  runTestsInFolder(folderPath)
}

main()
