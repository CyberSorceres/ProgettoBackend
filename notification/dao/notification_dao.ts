import { Notification } from "../notification";

export interface NotificationDao {
  insertNotification(notification: Notification): Promise<boolean>;
  removeNotification(id: string): Promise<boolean>;
  getNotificationsByUser(userId: string): Promise<Notification[]>;
}
