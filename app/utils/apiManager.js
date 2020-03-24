import axios from 'axios';

const baseUrl = `${process.env.BACKEND_API_URL}`;

export const getUserDataByAddress = publicAddress =>
  axios.get(`${baseUrl}/users?publicAddress=${publicAddress}`);
