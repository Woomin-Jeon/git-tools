#!/usr/bin/env node

import checkout from '../src/commands/checkout.js';
import deleteBranch from '../src/commands/deleteBranch.js';

const COMMAND_MAP = {
  CHECKOUT: 'checkout',
  DELETE_BRANCH: 'delete-branch',
};

const runner = async (params) => {
  const command = params[0];

  switch (command) {
    case COMMAND_MAP.CHECKOUT:
      checkout();
      break;
    case COMMAND_MAP.DELETE_BRANCH:
      deleteBranch();
      break;
    default:
      console.log('There are no matching commands. Use the command below.');
      Object.values(COMMAND_MAP).forEach((commandName) => {
        console.log(`   $ git-tools ${commandName}`);
      });
  }
};

runner(process.argv.slice(2));
