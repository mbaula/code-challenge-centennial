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
  const inputPath = process.argv[2] 
  if (!inputPath) {
    console.error('Please provide a file or folder path to run tests.')
    process.exit(1)
  }

  const resolvedPath = path.resolve(__dirname, inputPath)

  if (!fs.existsSync(resolvedPath)) {
    console.error(`The path "${inputPath}" does not exist.`)
    process.exit(1)
  }

  const stat = fs.statSync(resolvedPath)

  if (stat.isDirectory()) {
    console.log(`Running tests in folder: ${inputPath}`)
    runTestsInFolder(resolvedPath)
  } else if (stat.isFile() && inputPath.endsWith('.json')) {
    console.log(`Running test on file: ${inputPath}`)
    runTest(resolvedPath)
  } else {
    console.error(`The path "${inputPath}" is not a valid JSON file or directory.`)
    process.exit(1)
  }
}

main()
