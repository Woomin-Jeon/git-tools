#!/usr/bin/env node

import { COMMAND } from '../src/constants/command.js';
import checkout from '../src/commands/checkout.js';
import deleteBranch from '../src/commands/deleteBranch.js';

const runner = async (params) => {
  const command = params[0];

  switch (command) {
    case COMMAND.CHECKOUT:
      checkout();
      break;
    case COMMAND.DELETE_BRANCH:
      deleteBranch();
      break;
    default:
      console.log('There are no matching commands. Use the command below.');
      Object.values(COMMAND).forEach((commandName) => {
        console.log(`   $ git-tools ${commandName}`);
      });
  }
};

runner(process.argv.slice(2));
