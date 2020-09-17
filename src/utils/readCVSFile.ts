import fs from 'fs';
import path from 'path';

import csvParse from 'csv-parse';
import uploadConfig from '../config/upload';

import AppError from '../errors/AppError';

const parseStream = csvParse({
  from_line: 2,
  ltrim: true,
  rtrim: true,
});

const readCVSFile = async (filename: string): Promise<any[]> => {
  const csvFilePath = path.join(uploadConfig.directory, filename);

  const exists = await fs.promises.stat(csvFilePath);

  if (!exists) {
    throw new AppError('File uploaded not found', 500);
  }

  const readCSVStream = fs.createReadStream(csvFilePath);

  const parseCSV = readCSVStream.pipe(parseStream);

  const lines: any[] = [];

  parseCSV.on('data', line => {
    lines.push(line);
  });

  await new Promise(resolve => {
    parseCSV.on('end', resolve);
  });

  return lines;
};

export default readCVSFile;
