/**
 * Helper script that updates lib/index.d.ts so that the types can be consumed from
 * Typescript similar to how the code will be consumed by GAS
 */
 const fs = require("fs");
 const replace = require("replace-in-file");

 const options = {
   files: "./lib/index.d.ts",
   from: [
     /declare module "[^"]*"\s*{/g, 
     /export class/g, 
     /import .*;/g,
     /^}$/gm,
    /;\s*$/],
   to: ['', 'declare class', '', '', '\r\n}']
 }
 
 replace(options)
   .then(results => {
     console.log('Replacement results:', results);
   })
   .catch(error => {
     console.error('Error occurred:', error);
 });