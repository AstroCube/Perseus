import jwt from 'express-jwt';
import config from '../../config';

const getTokenFromHeader = req => {
  if (
    (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token') ||
    (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')
  ) {
    return req.headers.authorization.split(' ')[1];
  }

  return null;
};

function authentication(optional?: boolean) {
  try {
    return jwt({
      secret: config.jwtSecret,
      userProperty: 'token',
      getToken: getTokenFromHeader,
    });
  } catch (e) {
    if (e.message !== 'UnauthorizedError' || optional) throw e;
  }
}

export default authentication;
