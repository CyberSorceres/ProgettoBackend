import { EpicStory } from "../epic_story";
import { Progetto } from "../progetto";
import { UserStory, Feedback } from "../user_story";
import { ProgettoDao } from "./progetto_dao";

export class ProgettoDaoMock implements ProgettoDao {
  private progetti: Progetto[] = [];
  private counter = 0;
  async findAll(): Promise<Progetto[]> {
    return this.progetti;
  }
  async findById(id): Promise<Progetto> {
    return this.progetti.find((p) => p.Id === id);
  }

  async insertProgetto(progetto: Progetto): Promise<string> {
    progetto.Id = (++this.counter).toString();
    this.progetti.push(progetto);
    return progetto.Id;
  }
  async updateProgetto(progetto: Progetto): Promise<boolean> {
    const i = this.progetti.findIndex((p) => p.id === progetto.id);
    this.progetti[i] = progetto;
    return true;
  }
  async deleteProgetto(progetto: Progetto): Promise<boolean> {
    this.progetti = this.progetti.filter((p) => p.Id !== progetto.Id);
    return true;
  }
  async insertEpicStory(id: any, epicStory: EpicStory): Promise<boolean> {
    const progetto = await this.findById(id);
    epicStory._id = (++this.counter).toString();
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
    userStory.Id = (++this.counter).toString();
    return true;
  }

  async assignDev(id, userStoryId, userId): Promise<boolean> {
    const userStory = await this.getUserStory(id, userStoryId);
    if (!userStory) return false;
    userStory.Assigned = userId;
    return true;
  }
  async setUnitTest(id, userStoryId, unitTest: string): Promise<boolean> {
    const userStory = await this.getUserStory(id, userStoryId);
    if (!userStory) return false;
    userStory.UnitTest = unitTest;
    return true;
  }
  async getEpicStory(id, epicStoryId): Promise<EpicStory> {
    const project = await this.findById(id);
    return project.EpicStories.find((e) => e.Id === epicStoryId);
  }
  async getUserStory(id, userStoryId): Promise<UserStory> {
    const project = await this.findById(id);
    return project.EpicStories.map((e) =>
      e.UserStories.find((u) => u.Id === userStoryId),
    ).find((u) => u);
  }
  async insertFeedback(id, userStoryId, feedback: Feedback): Promise<boolean> {
    const userStory = await this.getUserStory(id, userStoryId);
    if (!userStory) return false;
    userStory.Feedbacks.push(feedback);
    return true;
  }
  async deleteUserStory(id, userStoryId): Promise<boolean> {
    const project = await this.findById(id);
    const epic = project.EpicStories.find((e) =>
      e.UserStories.find((u) => u.Id === userStoryId),
    );
    epic.UserStories = epic.UserStories.filter((u) => u.Id !== userStoryId);
    return true;
  }
  async getUserStoryByUser(
    userId,
  ): Promise<{ projectId: string; userStories: UserStory[] }[]> {
    const res: Array<{ projectId: string; userStories: UserStory[] }> = [];
    for (const progetto of this.progetti) {
      const element = { projectId: progetto.Id, userStories: [] };
      for (const epicStory of progetto.EpicStories) {
        for (const userStory of epicStory.UserStories) {
          element.userStories.push(userStory);
        }
      }
      if (element.userStories.length) {
        res.push(element);
      }
    }
    return res;
  }
  async addToProject(id, userId): Promise<boolean> {
    (await this.findById(id)).Users.push(userId);
    return true;
  }
  async setUserStoryState(
    id: string,
    userStoryId: string,
    passing: boolean,
  ): Promise<boolean> {
    (await this.getUserStory(id, userStoryId)).Passing = passing;
    return true;
  }
}
