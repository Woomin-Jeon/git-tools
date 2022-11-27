import readline from 'readline';
import ansiEscapes from 'ansi-escapes';

export const stdin = (onKeyPress) => {
  const processInit = () => {
    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);
    process.stdout.write(ansiEscapes.cursorHide);
  };

  const processExit = () => {
    process.stdout.write(ansiEscapes.cursorShow);
    process.exit();
  };

  processInit();
  process.stdin.on('keypress', (_, key) => {
    onKeyPress({ key, processExit });
  });
};

export const xxx = 'xxx';
