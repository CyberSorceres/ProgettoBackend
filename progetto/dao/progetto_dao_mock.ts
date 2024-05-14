import { Progetto } from "../progetto";
import { ProgettoDao } from "./progetto_dao";

export class ProgettoDaoMock implements ProgettoDao {
  private static progetti: Progetto[] = [];
  private static counter = 0;
  async findAll(): Promise<Progetto[]> {
    return ProgettoDaoMock.progetti;
  }
  async findById(id): Promise<Progetto> {
    return ProgettoDaoMock.progetti.find((p) => p.id === id);
  }

  async insertProgetto(progetto: Progetto): Promise<boolean> {
    progetto.id = ++ProgettoDaoMock.counter;
    ProgettoDaoMock.progetti.push(progetto);
    return true;
  }
  async updateProgetto(progetto: Progetto): Promise<boolean> {
    const i = ProgettoDaoMock.progetti.findIndex((p) => p.id === progetto.id);
    ProgettoDaoMock.progetti[i] = progetto;
    return true;
  }
  async deleteProgetto(progetto: Progetto): Promise<boolean> {
    ProgettoDaoMock.progetti = ProgettoDaoMock.progetti.filter(
      (p) => p.id !== progetto.id,
    );
    return true;
  }
}
