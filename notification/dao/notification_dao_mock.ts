import { NotificationDao } from "./notification_dao";
import { Notification } from "../notification";

export class NotificationDaoMock implements NotificationDao {
  private notifications: (Notification & { id: string })[] = [];
  private counter = 0;

  async insertNotification(notification: Notification): Promise<boolean> {
    this.notifications.push({
      ...notification,
      id: (++this.counter).toString(),
    });
    return true;
  }
  async removeNotification(id: string): Promise<boolean> {
    this.notifications = this.notifications.filter((i) => i.id === id);
    return true;
  }
  async getNotificationsByUser(userId: string): Promise<Notification[]> {
    return this.notifications.filter((n) => n.userId === userId);
  }
}
