import API from "~/lib/axios-client";
import { setAccessToken } from "~/lib/getAccessToken";
import { LoginType, RegisterType } from "~/lib/types/auth.type";

export const loginMutationFunction = async (data: LoginType) => {
  const response = await API.post("/auth/login", data);

  const token = response.data.data?.accessToken;

  if (token) {
    await setAccessToken(token);
  }

  return response;
};

export const registerMutationFunction = async (data: RegisterType) =>
  await API.post("/auth/register", data);

export const logoutMutationFunction = async () =>
  await API.post("/auth/logout");

export const resendVerificationCodeMutationFunction = async (email: {
  email: string;
}) => await API.post("/auth/resend-verification-code", email);

export const loginVerifyMfaMutationFunction = async (data: {
  code: string;
  email: string;
}) => {
  const response = await API.post("/mfa/verify-login", data);

  const token = response.data?.accessToken;

  if (token) {
    await setAccessToken(token);
  }

  return response.data;
};
