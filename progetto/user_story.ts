import { User } from "../user/user";

export interface Feedback {
  creatorId: string;
  description: string;
}

export enum UserStoryStatus {
  TODO,
  PASSING,
  DELETED,
}

export class UserStory {
  private tag: string;
  private description: string;
  private assigned?: User;
  private unitTest?: string;
  private id: string;
  private feedbacks: Feedback[];
  private passing: UserStoryStatus;

  get Description(): string {
    return this.description;
  }
  set Description(value: string) {
    this.description = value;
  }
  get UnitTest(): string {
    return this.unitTest;
  }
  set UnitTest(value: string) {
    this.unitTest = value;
  }

  get Tag(): string {
    return this.tag;
  }
  set Tag(value: string) {
    this.tag = value;
  }

  get Assigned(): User {
    return this.assigned;
  }
  set Assigned(value: User) {
    this.assigned = value;
  }

  get Id(): string {
    return this.id;
  }
  set Id(value: string) {
    this.id = value;
  }
  get Passing(): boolean {
    return this.passing;
  }
  set Passing(value: boolean) {
    this.passing = value;
  }

  get Feedbacks() {
    return this.feedbacks;
  }

  constructor(
    tag: string,
    description: string,
    assigned?: User,
    unitTest?: string,
    id?: string,
    feedbacks: Feedback[] = [],
  ) {
    this.tag = tag;
    this.description = description;
    this.assigned = assigned;
    this.unitTest = unitTest;
    this.id = id;
    this.feedbacks = feedbacks;
  }
}
