const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

exports.signup = (req, res, next) => {
  try {
    if (req.body) {
      const schema = Joi.object({
        userImg: Joi.string(),
        username: Joi.string().required(),
        email: Joi.string().max(50).email({ minDomainSegments: 2 }).required(),
        password: Joi.string().required(),

      });

      let data = schema.validate(req.body);
      if (data.error) {
        // return res.send(data.error);
        return res.status(400).send(data.error);
      } else {
        next();
      }
    } else {
      return res.send("ERROR HAPPEND");
    }
  } catch (error) {
    return res.send("ERROR HAPPEND");
  }
};
