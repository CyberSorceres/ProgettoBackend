import type { EpicStory } from "./epic_story";

export class Progetto {
  private name: string;
  private validated: boolean;
  private epicStories: EpicStory[];
  private id: string;
  private ai: string;
  private users: string[];

  get Name(): string {
    return this.name;
  }

  set Name(value: string) {
    this.name = value;
  }

  get Validated(): boolean {
    return this.validated;
  }

  set Validated(value: boolean) {
    this.validated = value;
  }
  get Id(): string {
    return this.id;
  }
  set Id(value: string) {
    this.id = value;
  }
  get Ai(): string {
    return this.ai;
  }
  set Ai(value: string) {
    this.ai = value;
  }

  get Users() {
    return this.users;
  }
  constructor(
    name: string,
    validated: boolean,
    epicStories: EpicStory[] = [],
    id: string,
    ai: string = "",
    users: string[] = [],
  ) {
    this.name = name;
    this.validated = validated;
    this.epicStories = epicStories;
    this.id = id;
    this.ai = ai;
    this.users = users;
  }

  addEpicStory(epicStory: EpicStory) {
    this.epicStories.push(epicStory);
  }

  get EpicStories() {
    return this.epicStories;
  }
}
