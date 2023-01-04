const express = require("express");
const router = express.Router();
const GroupService = require("../Group/group.service");
const groupValidator = require("../../Services/Group/group.validator");
const groupModel = require("../../Services/Group/group.modal");
const cloudinary = require("../../../middleWare/cloudinary");
const uploader = require("../../../middleWare/multer");

router.post("/create", uploader.single("groupImg"), async (req, res) => {
  try {
    const upload = await cloudinary.v2.uploader.upload(req.file.path);
    const body = {
      ...req.body,
      groupUser: JSON.parse(req.body.groupUser)
    }
    let { success, message, data } = await GroupService.create(body, upload.secure_url);
    if (success) {
      return res.status(200).json({ success, message, data });
    } else {
      return res.status(400).json({ success, message, data });
    }
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

router.patch("/:id", async (req, res) => {
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

router.put("/:id", uploader.single("groupImg"), async (req, res) => {
  try {
    const upload = await cloudinary.v2.uploader.upload(req.file.path);
    const body = {
      ...req.body,
      groupUser: JSON.parse(req.body.groupUser),
      groupImg: upload.secure_url
    }
    let { success, message, data } = await GroupService.update(req.params.id, body);
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