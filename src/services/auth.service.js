const userRepository = require('../repositories/user.repository');
const password = require('../security/password');
const token = require('../security/token');
const env = require('../config/env');
const { unauthorized } = require('../errors/app-error');

function toPublicUser(user) {
  return {
    user_id: user.user_id,
    school_id: user.school_id,
    full_name: user.full_name,
    email: user.email,
    role: user.role,
  };
}

async function register(data) {
  const passwordHash = await password.hash(data.password);

  const user = await userRepository.create({
    school_id: data.school_id,
    full_name: data.full_name,
    email: data.email,
    password_hash: passwordHash,
    role: 'PLAYER',
  });

  return { user: toPublicUser(user) };
}

async function login(data) {
  const user = await userRepository.findForLogin(data.school_id);
  const passwordMatches = await password.matches(
    data.password,
    user ? user.password_hash : null
  );

  if (!passwordMatches) {
    throw unauthorized(
      'School ID or password is incorrect.',
      'INVALID_CREDENTIALS'
    );
  }

  return {
    token: token.issue(user),
    token_type: 'Bearer',
    expires_in: env.jwt.expiresIn,
    user: toPublicUser(user),
  };
}

module.exports = { register, login, toPublicUser };