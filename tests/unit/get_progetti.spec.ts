import { describe, it, expect, beforeEach } from "vitest";
import { getProgetti } from "../../lambda/get_progetti";
import { getProgetto } from "../../lambda/get_progetto";
import { getAssignedUserStory } from "../../lambda/get_assigned_user_story";
import { getUserStory } from "../../lambda/get_user_story";
import { getUserStoryByTag } from "../../lambda/get_user_story_by_tag";
import { getEpicStory } from "../../lambda/get_epic_story";
import { ProgettoDaoMock } from "../../progetto/dao/progetto_dao_mock";
import { Progetto } from "../../progetto/progetto";
import { UserMockDao } from "../../user/dao/user_mock_dao";
import { Role, User } from "../../user/user";
import { ProgettoDao } from "../../progetto/dao/progetto_dao";
import { UserDao } from "../../user/dao/user_dao";
import { EpicStory } from "../../progetto/epic_story";
import { UserStory } from "../../progetto/user_story";

describe("Test get progetti", () => {
  let progetti: Progetto[];
  let progettoDao: ProgettoDao;
  let userDao: UserDao;
  let user: User;
  beforeEach(async () => {
    progetti = [
      new Progetto("Test", false, []),
      new Progetto("Test2", true, []),
      new Progetto("Test3", true, []),
    ];
    progettoDao = new ProgettoDaoMock();
    for (const p of progetti) {
      await progettoDao.insertProgetto(p);
    }

    await progettoDao.insertEpicStory("1", new EpicStory("epic1"));
    await progettoDao.insertEpicStory("1", new EpicStory("epic2"));
    await progettoDao.insertEpicStory("2", new EpicStory("epic2"));

    await progettoDao.insertUserStory(
      "1",
      "4",
      new UserStory("TAG", "userstory1"),
    );
    await progettoDao.insertUserStory(
      "1",
      "4",
      new UserStory("TAG2", "userstory1"),
    );

    userDao = new UserMockDao();
    user = new User("2");
    user.addToProject(progetti[0].Id, Role.DEV);
    user.addToProject(progetti[1].Id, Role.PM);
    await userDao.insertUser(user);
  });
  it("returns every project", async () => {
    expect(await getProgetti(progettoDao, userDao, "2")).toStrictEqual({
      statusCode: 200,
      body: JSON.stringify(progetti.slice(0, 2)),
    });
  });
  it("returns the correct epic story", async () => {
    const res = await getEpicStory(progettoDao, userDao, "2", {
      projectId: "1",
      epicStoryId: "4",
    });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.description).toBe("epic1");
    expect(body.userStories).toHaveLength(2);
  });
  it("returns the correct epic story", async () => {
    const res = await getUserStory(progettoDao, userDao, "2", {
      projectId: "1",
      userStoryId: "8",
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.description).toBe("userstory1");
  });
  it("returns correct project", async () => {
    expect(
      await getProgetto(progettoDao, userDao, "2", {
        projectId: "1",
      }),
    ).toStrictEqual({
      statusCode: 200,
      body: JSON.stringify(await progettoDao.findById("1")),
    });
  });
  it("fails when user is not in project", async () => {
    expect(
      await getProgetto(progettoDao, userDao, "1", {
        projectId: "1",
      }),
    ).toStrictEqual({
      statusCode: 504,
      body: "Unauthorized",
    });
  });
  it("returns user stories", async () => {
    expect(await getAssignedUserStory(progettoDao, "1")).toStrictEqual({
      statusCode: 200,
      body: '[{"projectId":"1","userStories":[{"tag":"TAG","description":"userstory1","id":"7","feedbacks":[]},{"tag":"TAG2","description":"userstory1","id":"8","feedbacks":[]}]}]',
    });
  });
  it("returns user story by tag", async () => {
    expect(
      await getUserStoryByTag(progettoDao, userDao, "1", {
        tag: "TST-TAG",
      }),
    ).toStrictEqual({
      statusCode: 200,
      body: JSON.stringify({
        tag: "TAG",
        description: "userstory1",
        id: "7",
        feedbacks: [],
      }),
    });
  });
});
