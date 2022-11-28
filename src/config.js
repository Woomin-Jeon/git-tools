import { COMMAND } from './constants/command.js';

const alias = {
  co: COMMAND.CHECKOUT,
  'b -D': COMMAND.DELETE_BRANCH,
};

const config = {
  withAlias: (command) => {
    const matchedAlias = alias[command];
    if (matchedAlias) {
      return matchedAlias;
    }

    return command;
  },
};

export default config;
