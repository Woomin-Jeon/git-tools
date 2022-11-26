#!/usr/bin/env node

import checkout from '../src/commands/checkout.js';
import deleteBranch from '../src/commands/deleteBranch.js';

const runner = async (params) => {
  const command = params[0];

  if (command === 'checkout') {
    checkout();
  }

  if (command === 'deleteBranch') {
    deleteBranch();
  }
};

runner(process.argv.slice(2));
