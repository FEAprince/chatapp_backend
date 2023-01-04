const User = require("../User/user.modal");
const { responseMessages } = require("../../../helper/responseMessages");
const pagination = require("../../../helper/pagination");
const bcrypt = require("bcryptjs");
const email = require("../../../helper/email");

exports.create = async (user, imgUrl) => {
  try {
    const existEmail = await User.findOne({ email: user.email.trim() });
    if (existEmail == null) {
      const existUser = await User.findOne({ username: user.username });
      if (existUser == null) {
        const salt = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash(user.password, salt);
        const info = new User({
          userImg: imgUrl,
          username: user.username,
          email: user.email,
          password: encryptedPassword
        });
        const userData = await info.save();

        const { successMail } = await email.sendForVeriy(userData);
        if (successMail) {
          return {
            success: true,
            message: "User register successfully",
            data: userData,
          };
        } else {
          await User.findByIdAndDelete(userData.id);
          return {
            success: false,
            message: "",
            data: "",
          };
        }
      } else {
        return {
          success: false,
          message: "Username already exists!",
          data: null,
        };
      }
    } else {
      return {
        success: false,
        message: "User Email already exists!",
        data: null,
      }; ss
    }
  } catch (error) {
    return {
      success: false,
      message: "ERROR_ADDING_USER_DETAILS",
      data: error.message,
    };
  }
};

exports.Exists = async (where) => {
  try {
    const user = await User.findOne(where);
    if (user) {
      return { success: true, message: "User Found!", data: user };
    } else {
      return {
        success: false,
        message: "User not found!",
        data: null,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error,
      data: null,
    };
  }
};

exports.update = async (params_id, user) => {
  try {
    const options = { new: true };
    const salt = await bcrypt.genSalt(10);
    if (user.password) {
      const encryptedPassword = await bcrypt.hash(user.password, salt);
      const finalBody = {
        ...user,
        password: encryptedPassword
      }
      const result = await User.findByIdAndUpdate(params_id, finalBody, options);
      if (result) {
        const user = await User.findOne({ where: params_id });
        return {
          success: true,
          message: "User Updated",
          data: result,
        };
      } else if (!result) {
        return {
          success: false,
          message: "User not updated",
          data: null,
        };
      }
    } else {
      const result = await User.findByIdAndUpdate(params_id, user, options);
      if (result) {
        const user = await User.findOne({ where: params_id });

        return {
          success: true,
          message: "User Updated",
          data: result,
        };
      } else if (!result) {
        return {
          success: false,
          message: "User not updated",
          data: null,
        };
      }
    }
  } catch (error) {
    return {
      success: false,
      message: error,
      data: null,
    };
  }
};

exports.updateWithNoImage = async (params_id, user) => {
  try {
    const options = { new: true };
    if (user.password) {
      const salt = await bcrypt.genSalt(10);
      const encryptedPassword = await bcrypt.hash(String(user.password), salt);
      let finalBody = {
        ...user,
        password: encryptedPassword
      }
      const result = await User.findByIdAndUpdate(params_id, finalBody, options);
      if (result) {
        return {
          success: true,
          message: "User Updated",
          data: result,
        };
      } else if (!result) {
        return {
          success: false,
          message: "User not updated",
          data: null,
        };
      }
    } else {
      const result = await User.findByIdAndUpdate(params_id, user, options);
      if (result) {
        return {
          success: true,
          message: "User Updated",
          data: result,
        };
      } else if (!result) {
        return {
          success: false,
          message: "User not updated",
          data: null,
        };
      }
    }
  } catch (error) {
    return {
      success: false,
      message: error,
      data: null,
    };
  }
};

exports.softDelete = async (params_id) => {
  try {
    const user = await this.Exists({ _id: params_id });
    if (user.success) {
      const result = await User.findByIdAndUpdate(params_id, { isActive: false })
      if (result) {
        return {
          success: true,
          message: "User deleted",
          data: result,
        };
      } else {
        return {
          success: false,
          message: "User not deleted",
          data: null,
        };
      }
    } else {
      return {
        success: false,
        message: "User id not found",
        data: null,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error,
      data: null,
    };
  }
};

exports.list = async (where, datum) => {
  try {
    const respose = await pagination.list(User, where, datum);
    if (respose) {
      return {
        success: true,
        message: responseMessages.dataFound,
        data: respose,
      };
    } else {
      return {
        success: false,
        message: responseMessages.dataNotFound,
        data: respose,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error,
      data: null,
    };
  }
};

