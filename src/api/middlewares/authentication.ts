import jwt from 'express-jwt';
import config from '../../config';

const getTokenFromHeader = req => {
  try {
    if (
        (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token') ||
        (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')
    ) {
      return req.headers.authorization.split(' ')[1];
    }
  } catch (e) {
    console.log(e);
  }
  return null;
};

function authentication(optional?: boolean) {
  return async (req, res, next) => {
    return jwt({
      secret: config.jwtSecret,
      userProperty: 'token',
      getToken: getTokenFromHeader(optional),
    });
  };
}

export default authentication;
