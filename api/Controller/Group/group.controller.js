const express = require("express");
const router = express.Router();
const GroupService = require("../Group/group.service");
const groupValidator = require("../../Services/Group/group.validator");


// const path = require('path');
// const multer = require("multer");


// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "public/img/groupimg");
//   },
//   filename: function (req, file, cb) {
//     cb(null, "user-" + Date.now() + "." + file.originalname.split(".")[1]);
//   },
// });

// const uploadImg = multer({ storage: storage }).single("userImg");


router.post("/create", groupValidator.group, async (req, res) => {
  try {
    let { success, message, data } = await GroupService.create(req.body);
    if (success) {
      return res.status(200).json({ success, message, data });
    } else {
      return res.status(400).json({ success, message, data });
    }
  } catch (error) {
    res.status(400).json({ message: error });
  }
});



module.exports = router;