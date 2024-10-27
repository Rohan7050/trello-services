import { pgConnection } from './data-source';

const { Client } = require('pg');
export class Database {
  static configs: any;

  private postgresConfig!: {
    user: string | undefined;
    host: string | undefined;
    database: string | undefined;
    password: string | undefined;
    port: string | undefined;
  };

  /**
   * A generic function to update PG Connection strings
   * @param dbName DB Name
   */
  async setPGConfig() {
    return new Promise((resolve, _) => {
      this.postgresConfig = {
        user: process.env.DB_HOST_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_HOST_PASSWORD,
        port: process.env.DB_PORT,
      };
      resolve(this.postgresConfig);
    });
  }

  async connectToPG() {
    try {
      this.setPGConfig();
      pgConnection.initialize();
      console.log('database connected');
    } catch (err) {
      console.error('Error connecting to database ' + err);
    }
  }

  /**
   * A generic function to execute POSTGRES Query
   * @param query statement to be executed
   */
  executePGQuery(query: string) {
    return new Promise((resolve, reject) => {
      const client = new Client(this.postgresConfig);
      client.connect();
      console.log(this.postgresConfig,"postgress config")
      client.query(query, (err: any, res: any) => {
        client.end();
        console.log('connection start ');
        if (res) {
          console.log('success connecting to database ', res);
          resolve(res);
        } else {
          console.log(err," inside executePGQuery___________")
          reject(err);
        }
      });
    });
  }
}

export default Database;
