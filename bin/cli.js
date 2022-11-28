#!/usr/bin/env node

import { COMMAND } from '../src/constants/command.js';
import config from '../src/config.js';
import checkout from '../src/commands/checkout.js';
import branchDelete from '../src/commands/branchDelete.js';

const runner = async (params) => {
  const command = params.join(' ');

  switch (config.withAlias(command)) {
    case COMMAND.CHECKOUT:
      checkout();
      break;
    case COMMAND.DELETE_BRANCH:
      branchDelete();
      break;
    default:
      console.log('There are no matching commands. Use the command below.');
      Object.values(COMMAND).forEach((commandName) => {
        console.log(`   $ git-tools ${commandName}`);
      });
  }
};

runner(process.argv.slice(2));
