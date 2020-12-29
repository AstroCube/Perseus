import jwt from 'express-jwt';
import config from '../../config';
import getToken from './tokenExtractor';

const authentication = jwt({
  secret: config.jwtSecret,
  userProperty: 'token',
  getToken,
  credentialsRequired: false
});

export default authentication;
