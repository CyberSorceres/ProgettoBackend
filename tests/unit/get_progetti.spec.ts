import { describe, it, expect } from "vitest";
import { getProgetti } from "../../lambda/get_progetti";
import { ProgettoDaoMock } from "../../progetto/dao/progetto_dao_mock";
import { Progetto } from "../../progetto/progetto";

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
    expect(await getProgetti(progettoDao)).toStrictEqual({
      statusCode: 200,
      body: JSON.stringify(progetti),
    });
  });
});
