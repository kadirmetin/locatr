import API from '../axios-client';
import { mfaType } from '../types/mfa.type';

export const mfaSetupQueryFunction = async () => {
  const response = await API.get<mfaType>('/mfa/setup');
  return response.data;
};

export const mfaVerifyMutationFunction = async (data: { code: string; secretKey: string }) =>
  await API.post('/mfa/verify', data);

export const mfaDisableMutationFunction = async () => await API.put('/mfa/revoke');

export const mfaVerifyLoginMutationFunction = async (data: { code: string; email: string }) =>
  await API.post('/mfa/verify-login', data);
