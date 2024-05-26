import { describe, it, expect, beforeEach } from "vitest";
import { ProgettoDaoMock } from "../../progetto/dao/progetto_dao_mock";
import { UserMockDao } from "../../user/dao/user_mock_dao";
import { Role, User } from "../../user/user";
import { Progetto } from "../../progetto/progetto";
import { invite } from "../../lambda/invite";
import { acceptInvite } from "../../lambda/accept_invite";
import { InviteDaoMock } from "../../invite/dao/invite_dao_mock";

describe("invite tests", () => {
  let progettoDao: ProgettoDaoMock;
  let userDao: UserMockDao;
  let inviteDao: InviteDaoMock;
  let user: User;

  beforeEach(async () => {
    progettoDao = new ProgettoDaoMock();
    userDao = new UserMockDao();
    inviteDao = new InviteDaoMock();
    user = new User("2");
    await userDao.insertUser(user);
    await progettoDao.insertProgetto(new Progetto("test", false, []));
  });

  it("fails is user is not PM", async () => {
    await userDao.addToProject("2", "1", Role.DEV);
    expect(
      await invite(userDao, user.Id, inviteDao, {
        projectId: "1",
        role: Role.DEV,
      }),
    ).toStrictEqual({
      statusCode: 501,
      body: "Unauthorized",
    });
  });
  it("fails if body is invalid", async () => {
    await userDao.addToProject("2", "1", Role.PM);
    expect(
      await invite(userDao, user.Id, inviteDao, {
        projectsId: "1",
        role: Role.DEV,
      }),
    ).toStrictEqual({
      statusCode: 400,
      body: "invalid body",
    });
  });

  it("creates an invite", async () => {
    await userDao.addToProject("2", "1", Role.PM);
    const res = await invite(userDao, user.Id, inviteDao, {
      projectId: "1",
      role: Role.DEV,
    });
    expect(res.statusCode).toBe(200);
    const id = JSON.parse(res.body).invite.id;
    const user2 = new User("3");
    await userDao.insertUser(user2);
    console.log(id);
    expect(
      await acceptInvite(userDao, "3", progettoDao, inviteDao, id),
    ).toStrictEqual({
      body: JSON.stringify({ ok: true }),
      statusCode: 200,
    });
    expect((await progettoDao.findById("1")).Users).toStrictEqual(["3"]);
    expect(user2.getProjectRole("1")).toBe(Role.DEV);
  });
});
