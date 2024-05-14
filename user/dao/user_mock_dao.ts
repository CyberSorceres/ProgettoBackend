import { UserDao } from "./user_dao";
import { User } from "../user";

export class UserMockDao implements UserDao {
  private static users: User[] = [];
  constructor() {}
  async findById(id: any): Promise<User> {
    return UserMockDao.users.find((u) => u.Id === id);
  }
  async insertUser(user: User): Promise<boolean> {
    UserMockDao.users.push(user);
    return true;
  }
  updateUser(user: User): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  deleteUser(user: User): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}
