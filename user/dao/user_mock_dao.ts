import { UserDao } from "./user_dao";
import { Role, User } from "../user";

export class UserMockDao implements UserDao {
  private users: User[] = [];
  constructor() {}
  async findById(id: any): Promise<User> {
    return this.users.find((u) => u.Id === id);
  }
  async insertUser(user: User): Promise<boolean> {
    this.users.push(user);
    return true;
  }
  updateUser(user: User): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  deleteUser(user: User): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  async addToProject(id, projectId): Promise<boolean> {
    (await this.findById(id)).addToProject(projectId);
    return true;
  }
}
