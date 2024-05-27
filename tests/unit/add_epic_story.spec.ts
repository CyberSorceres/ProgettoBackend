import { describe, it, expect, beforeEach } from "vitest";
import { addEpicStory } from "../../lambda/add_epic_story";
import { ProgettoDaoMock } from "../../progetto/dao/progetto_dao_mock";
import { UserMockDao } from "../../user/dao/user_mock_dao";
import { Role, User } from "../../user/user";
import { Progetto } from "../../progetto/progetto";

describe("Test add epic story", () => {
  let progettoDao: ProgettoDaoMock;
  let userDao: UserMockDao;
  let user: User;

  beforeEach(async () => {
    progettoDao = new ProgettoDaoMock();
    userDao = new UserMockDao();
    user = new User("2");
    await userDao.insertUser(user);
    await progettoDao.insertProgetto(new Progetto("test", false, []));
  });
  it("adds an epic story", async () => {
    // It should fail when the user is not a PM
    expect(
      await addEpicStory(progettoDao, userDao, "2", {
        description: "epic story",
        projectId: "1",
      }),
    ).toStrictEqual({
      statusCode: 501,
      body: "Unauthorized",
    });
    await userDao.addToProject("2", "1", Role.PM);
    expect(
      await addEpicStory(progettoDao, userDao, "2", {
        description: "epic story",
        projectId: "1",
      }),
    ).toStrictEqual({
      statusCode: 200,
      body: JSON.stringify({ ok: true, id: true }),
    });
    expect((await progettoDao.findById("1")).EpicStories).toHaveLength(1);
  });
  it("returns invalid body when body is invalid", async () => {
    expect(
      await addEpicStory(progettoDao, userDao, "2", {
        descr: "hi",
        project: "2",
      }),
    ).toStrictEqual({
      statusCode: 400,
      body: "invalid body",
    });
  });
});
