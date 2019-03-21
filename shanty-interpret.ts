
import * as fs from 'fs';
import { Interpreter } from './interpreter';

fs.readFile(process.argv[2], 'utf8', function(err, contents) {
    const i = new Interpreter(contents);
    try {
        i.interpretFile();
    } catch (err) {
        console.log(err);
    }
});
