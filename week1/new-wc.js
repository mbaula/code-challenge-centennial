"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var optionsMap = {
    '-c': function (filePath) { return fs.statSync(filePath).size; },
    '-l': function (filePath) { return fs.readFileSync(filePath, 'utf-8').split('\n').length; },
    '-w': function (filePath) { return fs.readFileSync(filePath, 'utf-8').split(/\s+/).filter(function (word) { return word.length > 0; }).length; },
    '-m': function (filePath) { return fs.readFileSync(filePath, 'utf-8').length; }
};
function handleArguments(args) {
    if (args.length !== 2) {
        console.log('Usage: new-wc [-c | -l | -w | -m] <file-path>');
        return;
    }
    var option = args[0];
    var filePath = args[1];
    var countFunction = optionsMap[option];
    if (!countFunction) {
        console.log('Invalid option. Usage: new-wc [-c | -l | -w | -m] <file-path>');
        return;
    }
    try {
        var result = countFunction(filePath);
        console.log("".concat(result, " ").concat(filePath));
    }
    catch (err) {
        if (err instanceof Error) {
            console.error("Error: ".concat(err.message));
        }
        else {
            console.error('An unknown error occurred');
        }
    }
}
handleArguments(process.argv.slice(2));
