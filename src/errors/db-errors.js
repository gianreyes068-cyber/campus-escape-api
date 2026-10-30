// Reads the name of a database constraint that an insert, update, or delete broke.
// Returns null when the error is not a constraint violation.
const {
  UniqueConstraintError,
  ForeignKeyConstraintError,
} = require('sequelize');

function constraintOf(error) {
  const databaseError = error.parent || error.original || {};

  const isSequelizeConstraintError =
    error instanceof UniqueConstraintError ||
    error instanceof ForeignKeyConstraintError;

  // PostgreSQL uses SQLSTATE codes beginning with 23 for integrity constraints.
  const isPostgresConstraintError =
    typeof databaseError.code === 'string' &&
    databaseError.code.startsWith('23');

  if (isSequelizeConstraintError || isPostgresConstraintError) {
    return databaseError.constraint || error.index || 'unknown';
  }

  return null;
}

module.exports = { constraintOf };