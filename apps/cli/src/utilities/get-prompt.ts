import Handlebars from 'handlebars';
import { fs } from 'zx';

export const getPrompt = () =>
  Handlebars.compile(fs.readFileSync('./src/prompt.hbs', 'utf-8'))({});
