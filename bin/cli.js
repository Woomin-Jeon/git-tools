#!/usr/bin/env node

import checkout from '../src/commands/checkout.js';

const runner = async (params) => {
  const command = params[0];

  if (command === 'checkout') {
    checkout();
  }
};

runner(process.argv.slice(2));
