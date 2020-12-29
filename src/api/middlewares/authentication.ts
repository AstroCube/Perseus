import jwt from 'express-jwt';
import config from '../../config';

const getTokenFromHeader = req => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return null;
  }
  const authHeaderParts = authHeader.split(' ');
  const keyword = authHeaderParts[0];

  if (keyword === 'Token' || keyword === 'Bearer') {
    return authHeaderParts[1];
  } else {
    return null;
  }
};

const authentication = jwt({
  secret: config.jwtSecret,
  userProperty: 'token',
  getToken: getTokenFromHeader,
  credentialsRequired: false
});

export default authentication;
