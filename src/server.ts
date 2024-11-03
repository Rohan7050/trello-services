import App from './app';
import { DummyController } from './controller/dummy/dummy.controller';
import {config} from 'dotenv';
import path from 'path';
import { UserController } from './controller/user/user.controller';
import { ProjectController } from './controller/project/project.controller';
import { TableController } from './controller/table/table.controller';
import { CardController } from './controller/card/card.controller';
import { SecurityController } from './controller/security/security.controller';
const parentDir = path.resolve(__dirname, '..');

const env = process.env.NODE_ENV || 'development';
config({
  path: `${parentDir}\\.env.${env}`
});

export const app = new App(
  [
    new SecurityController(),
    new DummyController(),
    new UserController(),
    new ProjectController(),
    new TableController(),
    new CardController()
  ],
  process.env.PORT || 3000
);

app.listen();
