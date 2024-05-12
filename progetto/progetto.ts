import type { EpicStory } from "./epic_story";

export class Progetto {
  #name: string;
  #validated: boolean;
  #epicStories: EpicStory[];
  #id: number;

  get name(): string {
    return this.#name;
  }

  set name(value: string) {
    this.#name = value;
  }

  get validated(): boolean {
    return this.#validated;
  }

  set validated(value: boolean) {
    this.#validated = value;
  }
  get id(): number {
    return this.#id;
  }
  set id(value: number) {
    this.#id = value;
  }

  constructor(name: string, validated: boolean, epicStories: EpicStory[] = []) {
    this.#name = name;
    this.#epicStories = epicStories;
  }

  addEpicStory(epicStory: EpicStory) {
    this.#epicStories.push(epicStory);
  }

  get epicStories() {
    return this.#epicStories;
  }
}
