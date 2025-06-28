import API from '../axios-client';
import { LoginType, RegisterType } from '../types/auth.type';

export const loginMutationFunction = async (data: LoginType) => await API.post('/auth/login', data);

export const registerMutationFunction = async (data: RegisterType) =>
  await API.post('/auth/register', data);

export const logoutMutationFunction = async () => await API.post('/auth/logout');

export const resendVerificationMutationFunction = async (email: { email: string }) =>
  await API.post('/auth/resend-verification-code', email);

export const forgotPasswordMutationFunction = async (email: { email: string }) =>
  await API.post('/auth/forgot-password', email);

export const resetPasswordMutationFunction = async (data: {
  password: string;
  verificationCode: string;
}) => await API.post('/auth/reset-password', data);

export const confirmAccountMutationFunction = async (code: string) =>
  await API.post('/auth/verify-email', { code });

export const changePasswordMutationFunction = async (data: {
  currentPassword: string;
  newPassword: string;
}) => await API.patch('/auth/change-password', data);

export const changeEmailMutationFunction = async (data: { newEmail: string }) =>
  await API.post('/auth/change-email', data);

export const deleteAccountQueryFunction = async () => await API.delete('/auth/delete-account');
