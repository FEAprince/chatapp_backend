const express = require("express");
const router = express.Router();
const GroupService = require("../Group/group.service");
const groupValidator = require("../../Services/Group/group.validator");
const groupModel = require("../../Services/Group/group.modal")

const path = require('path');
const multer = require("multer");


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/img/groupimg");
  },
  filename: function (req, file, cb) {
    cb(null, "user-" + Date.now() + "." + file.originalname.split(".")[1]);
  },
});

const uploadImg = multer({ storage: storage }).single("userImg");


router.post("/create", async (req, res) => {
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

router.patch("/:id", uploadImg, async (req, res) => {
  try {
    let { success, message, data } = await GroupService.Img_update(
      req.params.id,
      req.file,
      req.body
    );
    if (success) {
      return res.status(200).json({ success, message, data });
    } else {
      return res.status(400).json({ success, message, data });
    }
  } catch (error) {
    res.status(400).json({ message: error });
  }

});

router.delete("/:id", async (req, res) => {
  try {
    let { success, message, data } = await GroupService.softDelete(
      req.params.id
    );
    if (success) {
      return res.status(200).json({ success, message, data });
    } else {
      return res.status(400).json({ success, message, data });
    }
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

router.post("/list", async (req, res) => {
  try {
    let { success, message, data } = await GroupService.list(
      req.body.where,
      req.body.pagination
    );
    if (success) {
      return res.status(200).json({ success, message, data });
    } else {
      return res.status(400).json({ success, message, data });
    }
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

router.post("/search", async (req, res) => {
  try {
    let searchText = req.body.searchText;
    if (searchText.length > 2) {
      const result = await groupModel.find({
        $or: [
          { groupName: { $regex: ".*" + searchText + ".*", $options: "i" } }
        ],

      }).populate(["groupAdmin", "groupUser.userId"]);
      if (result.length > 0) {
        return res.status(200).json({
          success: true,
          message: "Data Found Successfully",
          data: result,
        });
      } else {
        return res
          .status(400)
          .json({ success: false, message: "Data not found", data: [] });
      }
    } else {
      return res.status(400).json({
        success: true,
        message: "Data not found!",
        data: null,
      });
    }


  } catch (error) {
    res.status(400).json({ message: error });
  }
});

module.exports = router;