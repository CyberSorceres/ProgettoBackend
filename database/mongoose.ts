import { createConnection, Connection } from "mongoose";

export class Mongoose {
  #connection: Connection;

  get connection(): Connection {
    return this.#connection;
  }

  async connect(url: string) {
    this.#connection = await createConnection(url).asPromise();
  }

  private constructor() {}

  static create(url?: string) {
    const mongoose = new Mongoose();
    if (url) {
      mongoose.connect(url);
    }
    return mongoose;
  }
}
