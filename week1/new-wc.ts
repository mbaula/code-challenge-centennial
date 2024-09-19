import * as fs from 'fs';

const optionsMap: { [key: string]: (filePath: string) => number } = {
    '-c': (filePath) => fs.statSync(filePath).size, 
    '-l': (filePath) => fs.readFileSync(filePath, 'utf-8').split('\n').length, 
    '-w': (filePath) => fs.readFileSync(filePath, 'utf-8').split(/\s+/).filter(word => word.length > 0).length, 
    '-m': (filePath) => fs.readFileSync(filePath, 'utf-8').length 
};

function handleArguments(args: string[]): void {
    if (args.length !== 2) {
        console.log('Usage: new-wc [-c | -l | -w | -m] <file-path>');
        return;
    }

    const option = args[0];
    const filePath = args[1];

    const countFunction = optionsMap[option];

    if (!countFunction) {
        console.log('Invalid option. Usage: new-wc [-c | -l | -w | -m] <file-path>');
        return;
    }

    try {
        const result = countFunction(filePath);
        console.log(`${result} ${filePath}`);
    } catch (err) {
        if (err instanceof Error) {
            console.error(`Error: ${err.message}`);
        } else {
            console.error('An unknown error occurred');
        }
    }
}

handleArguments(process.argv.slice(2));