const path = require('path');
const fs = require("fs");

const src = path.join(__dirname, "../lib/CoverSheets.js")
const dest = path.join(__dirname, "../dist/CoverSheets.js");
fs.copyFileSync(src, dest);

const fd = fs.openSync(dest, 'a+', 0o666,);
const content = fs.readFileSync(fd, 'utf8');
const classes = content.matchAll(/class ([^\s]*)\s{/g)
const classNames = [...classes].map(c => c[1]);  

const declarations = classNames.map(c => `var ${c} = CoverSheets.${c}`);

fs.appendFileSync(fd, `${declarations.join(';\r\n')};\r\n`)

fs.appendFileSync(fd, "var exports = exports || {};\r\n");
const exportDeclarations = classNames.map(c => `exports.${c} = CoverSheets.${c}`);
fs.appendFileSync(fd, `${exportDeclarations.join(';\r\n')};\r\n`);

fs.close(fd);

// fs.copyFileSync(dest, path.join(__dirname, "../tests/CoverSheets.js"));