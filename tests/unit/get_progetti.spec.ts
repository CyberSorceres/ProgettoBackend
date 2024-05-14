import { describe, it, expect } from "vitest";
import { getProgetti } from "../../lambda/get_progetti";
import { ProgettoDaoMock } from "../../progetto/dao/progetto_dao_mock";
import { Progetto } from "../../progetto/progetto";
import { UserMockDao } from "../../user/dao/user_mock_dao";
import { Role, User } from "../../user/user";

describe("Test get progetti", () => {
  it("returns every project", async () => {
    const progetti = [
      new Progetto("Test", false, []),
      new Progetto("Test2", true, []),
      new Progetto("Test3", true, []),
    ];
    const progettoDao = new ProgettoDaoMock();
    for (const p of progetti) {
      await progettoDao.insertProgetto(p);
    }

    const userDao = new UserMockDao();
    const user = new User("2");
    user.addToProject(progetti[0].Id, Role.DEV);
    user.addToProject(progetti[1].Id, Role.PM);
    await userDao.insertUser(user);

    expect(await getProgetti(progettoDao, userDao, "2")).toStrictEqual({
      statusCode: 200,
      body: JSON.stringify(progetti.slice(0, 2)),
    });
  });
});
