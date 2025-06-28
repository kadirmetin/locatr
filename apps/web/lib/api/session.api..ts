import API from '../axios-client';
import { SessionResponseType } from '../types/session.type';

export const getSessionQueryFunction = async () => await API.get('/session/');

export const getAllSessionsQueryFunction = async () => {
  const response = await API.get<SessionResponseType>('/session/all');

  return response.data;
};

export const deleteSessionMutationFunction = async (id: string) => {
  await API.delete(`/session/delete`, {
    data: {
      sessionId: id,
    },
  });
};

export const deleteAllSessionsMutationFunction = async ({
  userId,
  currentSessionId,
}: {
  userId: string;
  currentSessionId: string;
}) => {
  await API.delete(`/session/deleteAll`, {
    data: {
      userId,
      currentSessionId,
    },
  });
};
