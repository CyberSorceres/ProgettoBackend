import { describe, it, expect, beforeEach } from "vitest";
import { setUnitTest } from "../../lambda/set_unit_test";
import { assignDev } from "../../lambda/assign_dev";
import { ProgettoDaoMock } from "../../progetto/dao/progetto_dao_mock";
import { UserMockDao } from "../../user/dao/user_mock_dao";
import { Role, User } from "../../user/user";
import { Progetto } from "../../progetto/progetto";
import { EpicStory } from "../../progetto/epic_story";
import { UserStory } from "../../progetto/user_story";

describe("Test set unit test", () => {
  let progettoDao: ProgettoDaoMock;
  let userDao: UserMockDao;
  let user: User;
  let userStory: UserStory;

  beforeEach(async () => {
    progettoDao = new ProgettoDaoMock();
    userDao = new UserMockDao();
    user = new User("2");
    await userDao.insertUser(user);
    await progettoDao.insertProgetto(new Progetto("test", false, []));
    await progettoDao.insertEpicStory("1", new EpicStory("descr"));
    userStory = new UserStory("tag", "desc");
    await progettoDao.insertUserStory("1", "2", userStory);
  });
  it("fails when user is not PM", async () => {
    expect(
      await setUnitTest(progettoDao, userDao, "2", {
        projectId: "1",
        userStoryId: "3",
        unitTest: "function test(){}",
      }),
    ).toStrictEqual({
      statusCode: 504,
      body: "Unauthorized",
    });
    expect(
      await assignDev(progettoDao, userDao, "2", {
        projectId: "1",
        userStoryId: "3",
        devId: "4",
      }),
    ).toStrictEqual({
      statusCode: 504,
      body: "Unauthorized",
    });
  });
  it("sets unit test", async () => {
    await userDao.addToProject("2", "1", Role.PM);
    console.log(progettoDao);
    expect(
      await setUnitTest(progettoDao, userDao, "2", {
        projectId: "1",
        userStoryId: "3",
        unitTest: "function test(){}",
      }),
    ).toStrictEqual({
      statusCode: 200,
      body: JSON.stringify({ ok: true }),
    });
    expect(userStory.UnitTest).toBe("function test(){}");

    expect(
      await assignDev(progettoDao, userDao, "2", {
        projectId: "1",
        userStoryId: "3",
        devId: "4",
      }),
    ).toStrictEqual({
      statusCode: 200,
      body: JSON.stringify({ ok: true }),
    });
    expect(userStory.Assigned).toBe("4");
  });
});
