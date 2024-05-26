import { EpicStory } from "../epic_story";
import { Progetto } from "../progetto";
import { Feedback, UserStory } from "../user_story";

export interface ProgettoDao {
  findAll(): Promise<Progetto[]>;
  findById(id): Promise<Progetto>;

  insertProgetto(progetto: Progetto): Promise<string>;
  updateProgetto(progetto: Progetto): Promise<boolean>;
  deleteProgetto(progetto: Progetto): Promise<boolean>;
  insertEpicStory(id, epicStory: EpicStory): Promise<boolean>;
  insertUserStory(id, epicStoryId, userStory: UserStory): Promise<boolean>;
  assignDev(id, userStoryId, userId): Promise<boolean>;
  setUnitTest(id, userStoryId, unitTest: string): Promise<boolean>;
  getEpicStory(id, epicStoryId): Promise<EpicStory>;
  getUserStory(id, userStoryId): Promise<UserStory>;
  insertFeedback(id, userStoryId, feedback: Feedback): Promise<boolean>;
  deleteUserStory(id, userStoryId): Promise<boolean>;
  getUserStoryByUser(
    userId,
  ): Promise<{ projectId: string; userStories: UserStory[] }[]>;
  addToProject(id, userId): Promise<boolean>;
}
