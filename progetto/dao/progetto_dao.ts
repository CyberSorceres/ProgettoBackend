import { Progetto } from "../progetto";

export interface ProgettoDao {
  findAll(): Promise<Progetto[]>;
  findById(id): Promise<Progetto>;

  insertProgetto(progetto: Progetto): Promise<string>;
  updateProgetto(progetto: Progetto): Promise<boolean>;
  deleteProgetto(progetto: Progetto): Promise<boolean>;
}
