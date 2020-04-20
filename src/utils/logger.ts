const logger = console;
const logPrefix = `[MagicEmitter]: `;

function logError(msg: string): void {
  logger.error(`${logPrefix}${msg}`);
}

export {
  logError
};
