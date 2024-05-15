import { Role } from "../user/user";

export interface Invite {
  /**
   * uuid-4 id
   */
  id: string;
  projectId: string;
  role: Role;
}
