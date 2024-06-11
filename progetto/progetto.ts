import type { EpicStory } from "./epic_story";

export class Progetto {
  private name: string;
  private tag: string;
  private validated: boolean;
  private epicStories: EpicStory[];
  private id: string;
  private ai: string;
  private users: string[];
  private cliente: string;
  private date: Date;

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
  get Tag(): string {
    return this.tag;
  }
  set Tag(value: string) {
    this.tag = value;
  }
  get Users() {
    return this.users;
  }
  get Cliente() {
    return this.cliente;
  }
  set Cliente(value: string) {
    this.cliente = value;
  }
  get Date() {
    return this.date;
  }
  set Date(value: Date) {
    this.date = value;
  }
  constructor(
    name: string,
    cliente: string,
    validated: boolean,
    epicStories: EpicStory[] = [],
    id: string = undefined,
    ai: string = "",
    users: string[] = [],
    date: Date = new Date(),
  ) {
    this.name = name;
    this.validated = validated;
    this.epicStories = epicStories;
    this.id = id;
    this.ai = ai;
    this.users = users;
    this.tag = this.createTag(this.name);
    this.date = date;
    this.cliente = cliente;
  }

  private createTag(name: string): string {
    const res = name.replace(/[aeiou]/gi, "").slice(0, 5);
    return (
      res + name.replace(/[^aeiou]/gi, "").slice(0, res.length - 5)
    ).toUpperCase();
  }

  addEpicStory(epicStory: EpicStory) {
    this.epicStories.push(epicStory);
  }

  get EpicStories() {
    return this.epicStories;
  }
}
