const terminalCommands = {
  help: () => 'Available commands: help, date, time, clear, echo [text], apps',
  date: () => new Date().toLocaleDateString(),
  time: () => new Date().toLocaleTimeString(),
  apps: () => 'Apps: terminal, file-explorer, journal, clock, calculator, weather, eco-tips, palette',
  echo: (text) => text || ''
};

function appendTerminalLine(text) {
  const output = document.getElementById('terminal-output');
  if (!output) return;

  const line = document.createElement('div');
  line.textContent = text;
  output.appendChild(line);
  output.scrollTop = output.scrollHeight;
}

function runCommand() {
  const input = document.getElementById('terminal-input');
  const output = document.getElementById('terminal-output');
  if (!input || !output) return;

  const rawCommand = input.value.trim();
  if (!rawCommand) return;

  const [cmd, ...args] = rawCommand.toLowerCase().split(' ');
  
  appendTerminalLine(`C:\\Users\\Win11> ${rawCommand}`);

  // Handle clear specially
  if (cmd === 'clear') {
    output.textContent = 'C:\\Users\\Win11> _';
    input.value = '';
    return;
  }

  // Handle other commands
  let response = terminalCommands[cmd];
  if (response) {
    response = cmd === 'echo' ? terminalCommands.echo(rawCommand.slice(5)) : response();
  } else {
    response = `Command not found: ${rawCommand}`;
  }

  appendTerminalLine(response);
  input.value = '';
}
