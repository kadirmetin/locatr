export type UserType =
  | {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
      isEmailVerified: boolean;
      avatar?: string;
      bio?: string;
      createdAt: Date;
      updatedAt: Date;
      userPreferences: {
        enable2FA: boolean;
        emailNotification: boolean;
        pushNotification: boolean;
      };
    }
  | undefined;
