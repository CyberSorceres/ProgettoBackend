import { describe, it, expect, beforeEach } from "vitest";
import { getNotifications } from "../../lambda/get_notifications";
import { NotificationDaoMock } from "../../notification/dao/notification_dao_mock";

describe("notification tests", () => {
  let notificationDao: NotificationDaoMock;
  beforeEach(async () => {
    notificationDao = new NotificationDaoMock();
  });
  it("returns notifications", async () => {
    expect(await getNotifications(notificationDao, "1")).toStrictEqual({
      statusCode: 200,
      body: JSON.stringify([]),
    });
    await notificationDao.insertNotification({
      userId: "1",
      message: "hi",
    });
    await notificationDao.insertNotification({
      userId: "2",
      message: "hi to another user",
    });
    await notificationDao.insertNotification({
      userId: "1",
      message: "hello",
    });
    expect(await getNotifications(notificationDao, "1")).toStrictEqual({
      statusCode: 200,
      body: JSON.stringify(["hi", "hello"]),
    });
  });
});
