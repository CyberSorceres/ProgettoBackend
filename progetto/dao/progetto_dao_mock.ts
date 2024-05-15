import { EpicStory } from "../epic_story";
import { Progetto } from "../progetto";
import { UserStory } from "../user_story";
import { ProgettoDao } from "./progetto_dao";

export class ProgettoDaoMock implements ProgettoDao {
  private static progetti: Progetto[] = [];
  private static counter = 0;
  async findAll(): Promise<Progetto[]> {
    return ProgettoDaoMock.progetti;
  }
  async findById(id): Promise<Progetto> {
    return ProgettoDaoMock.progetti.find((p) => p.Id === id);
  }

  async insertProgetto(progetto: Progetto): Promise<string> {
    progetto.Id = (++ProgettoDaoMock.counter).toString();
    ProgettoDaoMock.progetti.push(progetto);
    return progetto.Id;
  }
  async updateProgetto(progetto: Progetto): Promise<boolean> {
    const i = ProgettoDaoMock.progetti.findIndex((p) => p.id === progetto.id);
    ProgettoDaoMock.progetti[i] = progetto;
    return true;
  }
  async deleteProgetto(progetto: Progetto): Promise<boolean> {
    ProgettoDaoMock.progetti = ProgettoDaoMock.progetti.filter(
      (p) => p.Id !== progetto.Id,
    );
    return true;
  }
  async insertEpicStory(id: any, epicStory: EpicStory): Promise<boolean> {
    const progetto = await this.findById(id);
    epicStory._id = (++ProgettoDaoMock.counter).toString();
    progetto.EpicStories.push(epicStory);
    return true;
  }
  async insertUserStory(
    id: any,
    epicStoryId: any,
    userStory: UserStory,
  ): Promise<boolean> {
    const progetto = await this.findById(id);
    progetto.EpicStories.find((e) => e._id === epicStoryId).UserStories.push(
      userStory,
    );
    return true;
  }
}
