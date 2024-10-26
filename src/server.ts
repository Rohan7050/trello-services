import App from './app';
import { PORT } from './config';
import { DummyController } from './controller/dummy/dummy.controller';

export const app = new App(
  [
    new DummyController()
  ],
  PORT
);

app.listen();
