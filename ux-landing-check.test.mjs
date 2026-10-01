import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const html = readFileSync(new URL('./index.html', import.meta.url), 'utf8');
const css = readFileSync(new URL('./style.css', import.meta.url), 'utf8');
const js = readFileSync(new URL('./main.js', import.meta.url), 'utf8');

const mustContain = [
  'Distribuidores Logísticos de Combustible',
  'Agenda una demo operativa',
  'Del nivel crítico a la entrega confirmada',
  'data-segment-tab',
  'distribution-tabs',
  '100%',
  '40%',
  '0 pedidos sin estado',
];

for (const text of mustContain) {
  assert(
    html.includes(text) || js.includes(text) || css.includes(text),
    `Expected landing to include: ${text}`,
  );
}

assert.match(js, /querySelectorAll\('\[data-segment-tab\]'\)/);
assert.match(css, /\.distribution-tabs/);
