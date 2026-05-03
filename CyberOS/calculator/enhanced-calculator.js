// Enhanced Calculator
let calcDisplay = '0';
let calcMemory = 0;
let calcHistory = [];
let calcMode = 'standard';
let lastOperand = null;
let lastOperation = null;

const scientificFunctions = {
  sin: (x) => Math.sin(x * Math.PI / 180),
  cos: (x) => Math.cos(x * Math.PI / 180),
  tan: (x) => Math.tan(x * Math.PI / 180),
  sqrt: (x) => Math.sqrt(x),
  log: (x) => Math.log10(x),
  ln: (x) => Math.log(x),
  exp: (x) => Math.exp(x),
  fact: (x) => {
    if (x < 0) return NaN;
    if (x === 0) return 1;
    let result = 1;
    for (let i = 2; i <= x; i++) result *= i;
    return result;
  }
};

function updateCalcDisplay() {
  const display = document.getElementById('calc-expression');
  const result = document.getElementById('calc-result');
  if (display) display.value = calcDisplay;
  if (result) result.textContent = `Memory: ${calcMemory}`;
}

function appendCalcNumber(num) {
  if (calcDisplay === '0' && num !== '.') {
    calcDisplay = String(num);
  } else if (num === '.' && calcDisplay.includes('.')) {
    return;
  } else {
    calcDisplay += num;
  }
  updateCalcDisplay();
}

function appendCalcOperation(op) {
  try {
    if (lastOperation && lastOperand !== null) {
      const current = parseFloat(calcDisplay);
      let result = 0;
      
      switch (lastOperation) {
        case '+': result = lastOperand + current; break;
        case '-': result = lastOperand - current; break;
        case '*': result = lastOperand * current; break;
        case '/': result = lastOperand / current; break;
        case '%': result = lastOperand % current; break;
        case '**': result = Math.pow(lastOperand, current); break;
        default: result = current;
      }
      
      calcDisplay = String(result);
    }
    
    lastOperand = parseFloat(calcDisplay);
    lastOperation = op;
    calcDisplay = '0';
    updateCalcDisplay();
  } catch (e) {
    calcDisplay = 'Error';
    updateCalcDisplay();
  }
}

function calcEquals() {
  try {
    if (lastOperation && lastOperand !== null) {
      const current = parseFloat(calcDisplay);
      let result = 0;
      
      switch (lastOperation) {
        case '+': result = lastOperand + current; break;
        case '-': result = lastOperand - current; break;
        case '*': result = lastOperand * current; break;
        case '/': 
          if (current === 0) {
            calcDisplay = 'Cannot divide by zero';
            updateCalcDisplay();
            return;
          }
          result = lastOperand / current;
          break;
        case '%': result = lastOperand % current; break;
        case '**': result = Math.pow(lastOperand, current); break;
        default: result = current;
      }
      
      calcHistory.push(`${lastOperand} ${lastOperation} ${current} = ${result}`);
      calcDisplay = String(result);
      lastOperand = null;
      lastOperation = null;
    }
    updateCalcDisplay();
  } catch (e) {
    calcDisplay = 'Error';
    updateCalcDisplay();
  }
}

function calcScientific(func) {
  try {
    const value = parseFloat(calcDisplay);
    if (scientificFunctions[func]) {
      const result = scientificFunctions[func](value);
      calcHistory.push(`${func}(${value}) = ${result}`);
      calcDisplay = String(result);
      updateCalcDisplay();
    }
  } catch (e) {
    calcDisplay = 'Error';
    updateCalcDisplay();
  }
}

function calcMemoryAdd() {
  const value = parseFloat(calcDisplay);
  calcMemory += value;
  updateCalcDisplay();
}

function calcMemorySubtract() {
  const value = parseFloat(calcDisplay);
  calcMemory -= value;
  updateCalcDisplay();
}

function calcMemoryRecall() {
  calcDisplay = String(calcMemory);
  updateCalcDisplay();
}

function calcMemoryClear() {
  calcMemory = 0;
  updateCalcDisplay();
}

function calcClear() {
  calcDisplay = '0';
  lastOperand = null;
  lastOperation = null;
  updateCalcDisplay();
}

function toggleCalcMode() {
  calcMode = calcMode === 'standard' ? 'scientific' : 'standard';
  const scientificPanel = document.querySelector('.scientific-panel');
  if (scientificPanel) {
    scientificPanel.style.display = calcMode === 'scientific' ? 'grid' : 'none';
  }
}

function showCalcHistory() {
  if (calcHistory.length === 0) {
    alert('No calculation history.');
    return;
  }
  alert('Calculation History:\\n' + calcHistory.slice(-10).join('\\n'));
}

function calcBackspace() {
  if (calcDisplay.length > 1) {
    calcDisplay = calcDisplay.slice(0, -1);
  } else {
    calcDisplay = '0';
  }
  updateCalcDisplay();
}

function calcPercent() {
  try {
    const value = parseFloat(calcDisplay);
    calcDisplay = String(value / 100);
    updateCalcDisplay();
  } catch (e) {
    calcDisplay = 'Error';
    updateCalcDisplay();
  }
}

function calcToggleSign() {
  const value = parseFloat(calcDisplay);
  calcDisplay = String(-value);
  updateCalcDisplay();
}

// Legacy functions for compatibility
function calculateExpression() {
  calcEquals();
}

function clearCalculator() {
  calcClear();
}

document.addEventListener('DOMContentLoaded', updateCalcDisplay);
