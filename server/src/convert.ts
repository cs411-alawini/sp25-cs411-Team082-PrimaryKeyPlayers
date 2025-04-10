import fs from 'fs';
import csv from 'csv-parser';
import path from 'path';

const results: any[] = [];

// 👇 Set the CSV file name and output file name
const inputFilePath = path.join(__dirname, '../../Data/per_game_2024_2025.csv');
const outputFilePath = path.join(__dirname, '../../Data/playerStatsData.ts');

fs.createReadStream(inputFilePath)
  .pipe(csv())
  .on('data', (row) => {
    const cleaned: any = {};

    for (const [key, value] of Object.entries(row)) {
      if (key.startsWith('_')) continue; // skip blank columns

      // Try converting to a number if it looks numeric
      const strValue = value as string;
      const num = Number(strValue);
      cleaned[key] = isNaN(num) || strValue.trim() === '' ? value : num;
    }

    results.push(cleaned);
  })
  .on('end', () => {
    const output = `export const playerStatsData = ${JSON.stringify(results, null, 2)};\n`;
    fs.writeFileSync(outputFilePath, output);
    console.log(`✅ Conversion complete. Output written to: ${outputFilePath}`);
  });