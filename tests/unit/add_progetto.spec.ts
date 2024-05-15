import { describe, it, expect } from "vitest";
import { addProgetto } from "../../lambda/add_progetto";
import { ProgettoDaoMock } from "../../progetto/dao/progetto_dao_mock";
import { UserMockDao } from "../../user/dao/user_mock_dao";
import { Role, User } from "../../user/user";

describe("Test get progetti", () => {
  it("returns every project", async () => {
    const progettoDao = new ProgettoDaoMock();
    const userDao = new UserMockDao();
    const user = new User("2");
    await userDao.insertUser(user);

    expect(
      await addProgetto(progettoDao, userDao, "2", {
        name: "test project",
      }),
    ).toStrictEqual({
      statusCode: 200,
      body: JSON.stringify({ ok: true, projectId: "1" }),
    });
    expect(user.getProjectIds()).toStrictEqual(["1"]);
    expect(user.getProjectRole("1")).toBe(Role.PM);
    expect((await progettoDao.findById("1")).Name).toBe("test project");
  });
});
