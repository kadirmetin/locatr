import API from '../axios-client';

export const getAllLocationsQueryFunction = async () => {
  const { data } = await API.get('/location/get-all-locations');

  return data.locations;
};

export const getRecentActivities = async () => {
  const { data } = await API.get('/location/recent-activities');

  return data;
};
