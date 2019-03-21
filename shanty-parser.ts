import { Parser } from './parser';
import * as fs from 'fs';
import * as util from 'util';

fs.readFile(process.argv[2], 'utf8', function(err, contents) {
    const p = new Parser(contents);
    console.log(util.inspect(p.parseProgram(), {showHidden: false, depth: null}))
});
