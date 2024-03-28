#!/usr/bin/env node
import { program } from 'commander';
import pageLoader from '../src/index.js';

const app = (url, { output }) => {
  try {
    console.log(pageLoader(url, output));
  } catch(error) {
    console.error(error.message);
  };
};

program
  .name('page-loader')
  .description('Page loader utility')
  .version('1.0.0')
  .argument('<url>', 'An url of a website to save')
  .option('-o, --output [dir]', 'output dir', process.cwd())
  .action(app)
  .parse(process.argv);
