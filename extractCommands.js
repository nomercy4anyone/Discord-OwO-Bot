const requireDir = require('require-dir');
const CommandInterface = require('./commands/CommandInterface');

const dir = requireDir('./commands/commandList', { recurse: true });

const output = [];

function scan(obj) {
  for (const key in obj) {
    const val = obj[key];

    if (val instanceof CommandInterface) {
      output.push({
        main: val.alias?.[0],
        aliases: val.alias || []
      });
    } 
    else if (Array.isArray(val)) {
      val.forEach(v => v instanceof CommandInterface && output.push({
        main: v.alias?.[0],
        aliases: v.alias || []
      }));
    } 
    else if (typeof val === 'object') {
      scan(val);
    }
  }
}

scan(dir);

output
  .sort((a, b) => a.main.localeCompare(b.main))
  .forEach(cmd => {
    console.log(
      `${cmd.main.padEnd(15)} | ${cmd.aliases.join(', ')}`
    );
  });
