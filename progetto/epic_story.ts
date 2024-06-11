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

  set UserStories(value: UserStory[]) {
    this.userStories = value;
  }

  get Id() {
    return this._id;
  }

  constructor(
    description: string,
    userStories: UserStory[] = [],
    _id: string = undefined,
  ) {
    this.description = description;
    this.userStories = userStories;
    this._id = _id;
  }
}
