import { execSync } from 'child_process';

export const exec = (command) => {
  try {
    execSync(command);
  } catch (error) {
    const childProcessErrorMessage = error.stderr.toString();
    console.error(childProcessErrorMessage);
  }
};
