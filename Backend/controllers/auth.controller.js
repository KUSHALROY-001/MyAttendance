const authSessionController = require("./auth/authSession.controller");
const authRegistrationController = require("./auth/authRegistration.controller");
const authProfileController = require("./auth/authProfile.controller");
const authOptionsController = require("./auth/authOptions.controller");

module.exports = {
  ...authSessionController,
  ...authRegistrationController,
  ...authProfileController,
  ...authOptionsController,
};
