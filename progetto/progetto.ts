import type { EpicStory } from "./epic_story";

export class Progetto {
  private name: string;
  private validated: boolean;
  private epicStories: EpicStory[];
  private id: string;

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

  constructor(name: string, validated: boolean, epicStories: EpicStory[] = []) {
    this.name = name;
    this.validated = validated;
    this.epicStories = epicStories;
  }

  addEpicStory(epicStory: EpicStory) {
    this.epicStories.push(epicStory);
  }

  get EpicStories() {
    return this.epicStories;
  }
}
