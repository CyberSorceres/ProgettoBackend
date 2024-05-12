export class UserStory {
  #tag: string;
  #description: string;
  get description(): string {
    return this.#description;
  }
  set description(value: string) {
    this.#description = value;
  }

  get tag(): string {
    return this.#tag;
  }
  set tag(value: string) {
    this.#tag = value;
  }

  constructor(tag: string, description: string) {
    this.#tag = tag;
    this.#description = description;
  }
}
