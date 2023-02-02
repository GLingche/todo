import express, { Express } from 'express';
import { TodoServer } from './setupServer';
import databaseConnection from './setupDatabase';
import { config } from './config';
class Application {
  public initialize(): void {
    this.loadConfig();
    databaseConnection();
    const app: Express = express();
    const server: TodoServer = new TodoServer(app);
    server.start();
  }

  private loadConfig(): void {
    config.validateConfig();
    config.cloudinaryConfig();
  }
}

const application: Application = new Application();
application.initialize();
