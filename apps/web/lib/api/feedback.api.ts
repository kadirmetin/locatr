import API from '../axios-client';

export const feedbackMutationFunction = async (data: {
  name: string;
  email: string;
  feedback: object;
}) => await API.post('/feedback', data);
