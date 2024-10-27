import App from './app';
import { DummyController } from './controller/dummy/dummy.controller';
import {config} from 'dotenv';
import path from 'path';
const parentDir = path.resolve(__dirname, '..');

const env = process.env.NODE_ENV || 'development';
config({
  path: `${parentDir}\\.env.${env}`
});

export const app = new App(
  [
    new DummyController()
  ],
  process.env.PORT || 3000
);

app.listen();
