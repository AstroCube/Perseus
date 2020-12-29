import jwt from 'express-jwt';
import config from '../../config';
import getToken from './tokenExtractor';

const cluster = jwt({
  secret: config.jwtSecret,
  userProperty: 'token',
  getToken,
});

export default cluster;
