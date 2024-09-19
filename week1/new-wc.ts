import * as fs from 'fs';

const optionsMap: { [key: string]: (filePath: string) => number } = {
    '-c': (filePath) => fs.statSync(filePath).size, 
    '-l': (filePath) => fs.readFileSync(filePath, 'utf-8').split('\n').length-1, 
    '-w': (filePath) => fs.readFileSync(filePath, 'utf-8').split(/\s+/).filter(word => word.length > 0).length, 
    '-m': (filePath) => fs.readFileSync(filePath, 'utf-8').length 
};

function handleArguments(args: string[]): void {
    let filePath: string;
    let options: string[];

    if (args.length === 1) {
        filePath = args[0];
        options = ['-l', '-w', '-c'];
    } else if (args.length === 2) {
        filePath = args[1];
        options = [args[0]];
    } else {
        console.log('Usage: new-wc [-c | -l | -w | -m] <file-path>');
        return;
    }

    try {
        const results = options.map(option => {
            const countFunction = optionsMap[option];
            if (!countFunction) {
                throw new Error('Invalid option');
            }
            return countFunction(filePath);
        });

        console.log(`${results.join(' ')} ${filePath}`);
    } catch (err) {
        if (err instanceof Error) {
            console.error(`Error: ${err.message}`);
        } else {
            console.error('An unknown error occurred');
        }
    }
}

handleArguments(process.argv.slice(2));