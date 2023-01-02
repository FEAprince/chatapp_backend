const { responseMessages } = require("../../../helper/responseMessages");
const pagination = require("../../../helper/pagination");
const Group = require("../../Services/Group/group.modal");

exports.create = async (data, file) => {
  try {
    // console.log(data)
    const groupBody = new Group({
      groupName: data.groupName,
      groupAdmin: data.groupAdmin,
      groupImg: data.groupImg,
      groupGroup: data.groupGroup,
      groupUser: data.groupUser
    });
    const groupData = await groupBody.save();
    // const { successMail } = await email.sendForVeriy(groupData);
    if (groupData) {
      return {
        success: true,
        message: `${data.groupName} Create !`,
        data: groupData,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: "ERROR_ADDING_GROUP_DETAILS",
      data: error.message,
    };
  }
};

exports.Exists = async (where) => {
  try {
    const group = await Group.findOne(where);
    if (group) {
      return { success: true, message: "Group Found!", data: group };
    } else {
      return {
        success: false,
        message: "Group not found!",
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

exports.update = async (params_id, group) => {
  try {
    const options = { new: true };
    const result = await Group.findByIdAndUpdate(params_id, group, options);
    if (result) {
      return {
        success: true,
        message: "Group Updated",
        data: result,
      };
    } else if (!result) {
      return {
        success: false,
        message: "Group not updated",
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

exports.Img_update = async (params_id, file, body) => {
  try {

    groupInfo = { ...body, groupImg: file.path }
    const result = await Group.findByIdAndUpdate(params_id, groupInfo)
    if (result) {
      const res = await this.Exists({ _id: params_id });
      if (res) {
        return {
          success: true,
          message: "Group updated successfully",
          data: res.data,
        };
      } else {
        return {
          success: true,
          message: res.message,
          data: {},
        };
      }

    } else {
      console.error(error);
      return {
        success: false,
        message: "Group not updated ",
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

exports.softDelete = async (params_id) => {
  try {
    const group = await this.Exists({ _id: params_id });
    if (group.success) {
      const result = await Group.findByIdAndUpdate(params_id, { isActive: false })
      if (result) {
        return {
          success: true,
          message: "Group deleted",
          data: result,
        };
      } else {
        return {
          success: false,
          message: "Group not deleted",
          data: null,
        };
      }
    } else {
      return {
        success: false,
        message: "Group id not found",
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
    const respose = await pagination.list(Group, where, datum,
      ["groupAdmin", "groupUser.userId"]);
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
