import { UserStory } from "./user_story";

export class EpicStory {
  #description: string;
  #userStories: UserStory[];
  get description(): string {
    return this.#description;
  }
  set description(value: string) {
    this.#description = value;
  }

  addUserStory(userStory: UserStory) {
    this.#userStories.push(userStory);
  }

  get userStories() {
    return this.#userStories;
  }

  constructor(description: string, userStories: UserStory[]) {
    this.#description = description;
    this.#userStories = userStories;
  }
}
