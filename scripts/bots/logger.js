// Structured logging — plan 3.1.6
// Custom implementation producing pino-equivalent JSON lines
// (timestamp, level, context) WITHOUT a new npm dependency.
function write(level, context, args) {
  const message = args
    .map(a => (a && typeof a === 'object' ? JSON.stringify(a) : String(a)))
    .join(' ');
  const line = JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    context,
    message,
  });
  if (level === 'error') {
    console.error(line);
  } else {
    console.log(line);
  }
}

module.exports = {
  info: (context, ...args) => write('info', context, args),
  warn: (context, ...args) => write('warn', context, args),
  error: (context, ...args) => write('error', context, args),
};
