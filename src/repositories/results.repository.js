const { QueryTypes } = require('sequelize');
const { sequelize } = require('../models');

async function findFinishedGamePlayers(since) {
  const sql = [
    'SELECT',
    '  s.join_code AS session_code,',
    '  s.started_at,',
    '  s.ended_at,',
    '  u.school_id,',
    '  p.nickname,',
    '  p.score,',
    "  (p.current_stage = 'gate') AS completed",
    'FROM sessions AS s',
    'JOIN session_players AS p ON p.session_id = s.session_id',
    'JOIN users AS u ON u.user_id = p.user_id',
    "WHERE s.status = 'ended'",
    '  AND s.ended_at IS NOT NULL',
    '  AND (CAST(:since AS timestamptz) IS NULL',
    '       OR s.ended_at > CAST(:since AS timestamptz))',
    'ORDER BY s.ended_at, p.score DESC',
  ].join('\n');

  return sequelize.query(sql, {
    type: QueryTypes.SELECT,
    replacements: {
      since: since ? since.toISOString() : null,
    },
  });
}

module.exports = { findFinishedGamePlayers };
