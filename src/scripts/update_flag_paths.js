
import fs from 'fs';
import path from 'path';

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const countriesPath = path.join(__dirname, '../data/countries.json');

function updateFlagPaths() {
  const countries = JSON.parse(fs.readFileSync(countriesPath, 'utf8'));
  const updated = countries.map(country => {
    if (country.code) {
      const code = country.code.toLowerCase();
      country.flag = `/assets/img/flags/${code}.svg`;
    }
    return country;
  });
  fs.writeFileSync(countriesPath, JSON.stringify(updated, null, 2));
  console.log('Flag paths updated successfully!');
}

updateFlagPaths();
