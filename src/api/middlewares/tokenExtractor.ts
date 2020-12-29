/**
 * Function that extract the token from
 * the given request
 * @param req The request to extract the
 * token from
 */
export default function extract(req) {
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
}
