#!/usr/bin/env node

const chokidar = require('chokidar');
const debounce=require('lodash.debounce');
const fs=require('fs');
// we get an object that represents the program and not the library 
//therefore we choose to not call it caporal like the convntion should be
// See also docuementation of caporal
const program=require('caporal');
const { spawn } = require('child_process');
const chalk=require('chalk');

program
    .version('0.0.1')
    .argument('[filename]', 'Name of a file to execute')
    .action(async({filename})=>{
        const name=filename||'index.js';
        try{
        await fs.promises.access(name);
    }
    catch(err){
        throw new Error(`Could not find the file ${name}`);
    }
    let proc;
        const start=debounce(()=>{
         if(proc){
             proc.kill();
         }
         console.log(chalk.blue('>>>>>>>>>Starting process...'));
            proc= spawn('node',[name], {stdio: 'inherit'});
        },100);
        
        chokidar.watch('.')
            .on('add', start)
            .on('change',start)
            .on('unlink',start);
        
    });

program.parse(process.argv);

