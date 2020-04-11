import axios from 'axios';

const baseUrl = `${process.env.BACKEND_API_URL}`;

export const getUserDataByAddress = publicAddress =>
  axios.get(`${baseUrl}/users?publicAddress=${publicAddress}`);

export const login = publicAddress =>
  axios.post(`${baseUrl}/users/login`, {
    publicAddress,
  });

export const authenticateUser = (signature, publicAddress) =>
  axios.post(`${baseUrl}/users/auth`, {
    signature,
    publicAddress,
  });

export const userSignUp = (publicAddress, role) =>
  axios.post(`${baseUrl}/users/signUp`, {
    publicAddress,
    role,
  });

export const createEvent = (address, name, imageUrl) => {
  axios.post(`${baseUrl}/eventOrganiser/createEvent`, {
    address,
    name,
    imageUrl,
  });
};

export const getMyTickets = address =>
  axios.get(`${baseUrl}/ticket/currentOwner/${address}`);

export const getEventbyEventId = eventId =>
  axios.get(`${baseUrl}/eventOrganiser/eventId/${eventId}`);

export const getTicketsByAddressAndEventId = (address, eventId) =>
  axios.get(`${baseUrl}/ticket/currentOwner/${address}/eventId/${eventId}`);
