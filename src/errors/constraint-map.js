// A database rule was broken -> what the client should hear.
// The key is the constraint name from YOUR migration.

module.exports = {
  uq_users_school_id: {
    status: 409,
    code: 'SCHOOL_ID_TAKEN',
    message: 'That school ID is already registered.',
  },

  uq_users_email: {
    status: 409,
    code: 'EMAIL_TAKEN',
    message: 'That email is already registered.',
  },

  sessions_question_set_id_fkey: {
    status: 409,
    code: 'QUESTION_SET_IN_USE',
    message: 'This question set cannot be deleted because a session uses it.',
  },

  uq_session_players_nickname: {
    status: 409,
    code: 'NICKNAME_TAKEN',
    message: 'That nickname is already used in this session.',
  },
};