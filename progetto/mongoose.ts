import { createConnection, Connection, Schema } from "mongoose";
import { Progetto } from "./progetto";

export class Mongoose {
  #connection: Connection;

  get connection(): Connection {
    return this.connection;
  }

  async connect() {
    this.#connection = await createConnection("").asPromise();
  }
}
