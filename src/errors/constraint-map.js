// A database rule was broken -> what the client should hear.
// The key is the constraint name from YOUR migration.

module.exports = {
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