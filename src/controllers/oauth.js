const models = require("../db/models").models,
  generator = require("../utils/generator"),
  config = require("../../config");

function createGrantCode(clientId, userId) {
  return models.GrantCode.create({
    code: generator.genNcharAlphaNum(config.GRANT_TOKEN_SIZE),
    clientId: clientId,
    userId: userId
  });
}
function createAuthToken(clientId, userId = null) {
  return models.AuthToken.create({
    token: generator.genNcharAlphaNum(config.AUTH_TOKEN_SIZE),
    scope: ["*"],
    explicit: false,
    clientId: clientId,
    userId: userId
  });
}

function findGrantCode(code) {
  return models.GrantCode.findOne({
    where: { code: code },
    include: [models.Client]
  });
}

function findOrCreateAuthToken(grantCode) {
  return models.AuthToken.findCreateFind({
    where: {
      clientId: grantCode.clientId,
      userId: grantCode.userId,
      explicit: true
    },
    defaults: {
      token: generator.genNcharAlphaNum(config.AUTH_TOKEN_SIZE),
      scope: ["*"],
      explicit: true,
      clientId: grantCode.clientId,
      userId: grantCode.userId
    }
  });
}

function findAuthToken(clientId, userId) {
  return models.AuthToken.findOne({
    where: {
      clientId: clientId,
      userId: userId
    }
  });
}

function findAllAuthTokens(clientId) {
  return models.AuthToken.findAll({
    where: { userId: clientId },
    include: [models.Client]
  });
}

function deleteAuthToken(token) {
  return models.AuthToken.destroy({
    where: {
      token: token
    }
  });
}

module.exports = {
  createGrantCode,
  createAuthToken,
  findGrantCode,
  findAuthToken,
  findOrCreateAuthToken,
  deleteAuthToken,
  findAllAuthTokens
};
