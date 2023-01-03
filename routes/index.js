const userController = require("../api/Controller/User/user.controller");
const groupController = require("../api/Controller/Group/group.controller");
const { isApiKey } = require("../middleWare/auth");
const initialize = (app) => {
  app.use("/api/v1/group", groupController);
  app.use("/api/v1/user", userController);
};
module.exports = { initialize };
