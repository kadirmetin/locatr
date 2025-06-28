export type SessionResponseType = {
  message: string;
  sessions: SessionType[];
};

export type SessionType = {
  _id: string;
  userId: string;
  userAgent: string;
  ip?: string;
  location?: string;
  createdAt: string;
  expiredAt: string;
  lastActive?: string;
  isCurrent: boolean;
};

export type sessionItemType = SessionType & {
  device?: string;
  deviceType?: string;
};
