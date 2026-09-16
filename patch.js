const fs = require('fs');

let ev = fs.readFileSync('src/components/EmergencyView.tsx', 'utf8');
ev = ev.replace(/import \{ CONSULATES, GENERAL_EMERGENCIES, CITY_SCAMS \} from '\.\.\/data';/g, 'const CONSULATES: any[] = [];\nconst GENERAL_EMERGENCIES: any = {};\nconst CITY_SCAMS: any = {};');
fs.writeFileSync('src/components/EmergencyView.tsx', ev);

let gv = fs.readFileSync('src/components/GuideView.tsx', 'utf8');
gv = gv.replace(/import \{ VEGGIE_SUPERMARKET_GUIDE, OFFICIAL_AUDIOGUIDES \} from '\.\.\/data';/g, 'const VEGGIE_SUPERMARKET_GUIDE: any = {};\nconst OFFICIAL_AUDIOGUIDES: any[] = [];');
fs.writeFileSync('src/components/GuideView.tsx', gv);
