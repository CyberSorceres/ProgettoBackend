import type { EpicStory } from "./epic_story";

export class Progetto {
  private name: string;
  private start_date: string;
  private business_requirements: string;
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

  get StartDate(): string {
    return this.start_date;
  }

  set StartDate(value: string) {
    this.start_date = value;
  }

  get BusinessRequirements(): string {
    return this.business_requirements;
  }

  set BusinessRequirements(value: string) {
    this.business_requirements = value;
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
    business_requirement:string,
    epicStories: EpicStory[] = [],
    id: string,
    ai: string = "",
    users: string[] = [],
  ) {
    this.name = name;
    this.validated = validated;
    this.business_requirements=business_requirement;
    this.start_date= (new Date()).toString();
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
