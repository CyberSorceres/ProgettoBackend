export enum NotificationType {
  BUSINESS,
  OTHER,
}

export interface Notification {
  userId: string;
  title: string;
  message: string;
  read: boolean;
  type: NotificationType;
}
