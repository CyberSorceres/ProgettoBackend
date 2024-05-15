import { Invite } from "../invite";

export interface InviteDao {
  insertInvite(invite: Invite): Promise<boolean>;
  removeInvite(invite: Invite): Promise<boolean>;
  getInvite(id: string): Promise<Invite>;
}
