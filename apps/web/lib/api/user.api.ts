import API from '../axios-client';
import { EditProfileFormValues } from '../schemas/edit-profile-schema';

export const uploadAvatarMutationFunction = async (avatar: string) => {
  await API.post('/user/upload-avatar', {
    avatar,
  });
};

export const editProfileMutationFunction = async (data: Partial<EditProfileFormValues>) => {
  await API.post('/user/edit-profile', data);
};

export const editNotificationPreferencesMutationFunction = async (notificationPreferences: {
  email?: boolean;
  push?: boolean;
}) => {
  await API.post('/user/edit-notification-preferences', notificationPreferences);
};
