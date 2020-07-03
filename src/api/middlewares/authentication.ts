import jwt from 'express-jwt';
import config from '../../config';

const getTokenFromHeader = req => {
  console.log("Llega hasta aquí");
  if (
      (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token') ||
      (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')
  ) {
    return req.headers.authorization.split(' ')[1];
  }

  return null;
};

const authentication = jwt({
  secret: config.jwtSecret,
  userProperty: 'token',
  getToken: getTokenFromHeader,
  credentialsRequired: false
});

export default authentication;
