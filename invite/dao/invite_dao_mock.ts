import { InviteDao } from "./invite_dao";
import { Invite } from "../invite";

export class InviteDaoMock implements InviteDao {
  private invites: Invite[] = [];

  async insertInvite(invite: Invite): Promise<boolean> {
    this.invites.push(invite);
    return true;
  }
  async removeInvite(invite: Invite): Promise<boolean> {
    this.invites = this.invites.filter((i) => i.id === invite.id);
    return true;
  }
  async getInvite(id: string): Promise<Invite> {
    return this.invites.find((i) => i.id === id);
  }
}
