import jwt from 'express-jwt';

const getTokenFromHeader = req => {
  if (
    (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token') ||
    (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')
  ) {
    return req.headers.authorization.split(' ')[1];
  }
  return null;
};

const authentication = jwt({
  userProperty: 'token',
  getToken: getTokenFromHeader,
});

export default authentication;
