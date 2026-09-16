const fs = require('fs');
let ev = fs.readFileSync('src/components/EmergencyView.tsx', 'utf8');
ev = ev.replace(/const CITY_SCAMS: any = \{.*\};/g, 'const CITY_SCAMS: Record<string, {title: string; desc: string; solution: string;}[]> = { ROMA: [], LONDRES: [], BARCELONA: [], MADRID: [] };');
fs.writeFileSync('src/components/EmergencyView.tsx', ev);
