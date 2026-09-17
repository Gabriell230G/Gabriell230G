import { execFileSync } from 'node:child_process';
const run = (f) => execFileSync(process.execPath, [`.github/scripts/${f}`], { stdio: 'inherit' });
run('generate-header.mjs');
run('generate-timeline.mjs');
try { run('generate-stats.mjs'); }
catch { console.error('stats pulado (sem token ou sem rede); os SVG antigos foram mantidos'); }
