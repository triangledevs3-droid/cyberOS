function calculateExpression() {
  const input = document.getElementById('calc-expression');
  const result = document.getElementById('calc-result');
  if (!input || !result) return;

  const expr = input.value.trim();
  if (!expr) {
    result.textContent = 'Enter a valid expression first.';
    return;
  }

  const safe = expr.replace(/[^0-9+\-*/().\s]/g, '');
  if (!/^[0-9+\-*/().\s]+$/.test(safe)) {
    result.textContent = 'Invalid characters. Use numbers and + - * / only.';
    return;
  }

  try {
    const ans = Function(`"use strict"; return (${safe})`)();
    result.textContent = Number.isFinite(ans) ? `Result: ${ans}` : 'Cannot calculate.';
  } catch (e) {
    result.textContent = 'Syntax error. Check expression.';
  }
}

function clearCalculator() {
  const input = document.getElementById('calc-expression');
  const result = document.getElementById('calc-result');
  if (input) input.value = '';
  if (result) result.textContent = 'Result will appear here.';
}
