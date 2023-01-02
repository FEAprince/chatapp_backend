const { responseMessages } = require("../../../helper/responseMessages");
const pagination = require("../../../helper/pagination");
const Group = require("../../Services/Group/group.modal");

exports.create = async (data) => {
  try {
    const gropData = new Group({
      groupName: data.groupName,
      groupAdmin: data.groupAdmin,
      groupUsers: data.groupUsers,
    });
    console.log(gropData)
    const groupData = await gropData.save();
    // const { successMail } = await email.sendForVeriy(userData);
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

