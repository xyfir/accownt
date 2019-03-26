import { promisify } from 'util';
import { readFile } from 'fs';

const _readFile = promisify(readFile);

export async function buildTemplate({
  name,
  file,
  value,
  fallback
}: {
  name: string;
  file?: string;
  value: string;
  fallback: string;
}): Promise<string> {
  let template: string;
  try {
    if (!file) throw Error();
    template = await _readFile(file, 'utf8');
  } catch (err) {}
  return (template || fallback).replace(new RegExp(`%${name}%`, 'g'), value);
}
