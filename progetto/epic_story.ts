import { UserStory } from "./user_story";

export class EpicStory {
  description: string;
  userStories: UserStory[];
  _id;

  get Description(): string {
    return this.description;
  }
  set Description(value: string) {
    this.description = value;
  }

  addUserStory(userStory: UserStory) {
    this.userStories.push(userStory);
  }

  get UserStories() {
    return this.userStories;
  }

  constructor(description: string, userStories: UserStory[], _id: string = "") {
    this.description = description;
    this.userStories = userStories;
    this._id = _id;
  }
}
