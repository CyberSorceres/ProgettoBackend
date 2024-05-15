import { Role, User } from "../user";

export interface UserDao {
  findById(id): Promise<User>;
  insertUser(user: User): Promise<boolean>;
  updateUser(user: User): Promise<boolean>;
  deleteUser(user: User): Promise<boolean>;
  addToProject(id, projectId, role: Role): Promise<boolean>;
}
