import { describe, it, expect, beforeEach } from "vitest";
import { addUserStory } from "../../lambda/add_user_story";
import { deleteUserStory } from "../../lambda/delete_user_story";
import { ProgettoDaoMock } from "../../progetto/dao/progetto_dao_mock";
import { UserMockDao } from "../../user/dao/user_mock_dao";
import { Role, User } from "../../user/user";
import { Progetto } from "../../progetto/progetto";
import { EpicStory } from "../../progetto/epic_story";

describe("Test get progetti", () => {
  let progettoDao: ProgettoDaoMock;
  let userDao: UserMockDao;
  let user: User;

  beforeEach(async () => {
    progettoDao = new ProgettoDaoMock();
    userDao = new UserMockDao();
    user = new User("2", [], Role.PM);
    userDao.insertUser(user);
    await progettoDao.insertProgetto(new Progetto("test", "client", false, []));
    await progettoDao.insertEpicStory("1", new EpicStory("testdesc", []));
  });
  it("adds user story", async () => {
    expect(
      await addUserStory(progettoDao, userDao, "2", {
        description: "epic story",
        tag: "hi",
        projectId: "1",
        epicStoryId: "2",
      }),
    ).toStrictEqual({
      statusCode: 200,
      body: JSON.stringify({ ok: true }),
    });
    expect(
      (await progettoDao.findById("1")).EpicStories[0].UserStories,
    ).toHaveLength(1);
    expect(
      await deleteUserStory(progettoDao, userDao, "2", {
        projectId: "1",
        userStoryId: "3",
      }),
    ).toStrictEqual({
      statusCode: 200,
      body: JSON.stringify({ ok: true }),
    });
    expect(
      (await progettoDao.findById("1")).EpicStories[0].UserStories,
    ).toHaveLength(0);
  });
  it("returns invalid body when body is invalid", async () => {
    expect(
      await addUserStory(progettoDao, userDao, "2", {
        descr: "hi",
        project: "2",
      }),
    ).toStrictEqual({
      statusCode: 400,
      body: "invalid body",
    });
  });
});
