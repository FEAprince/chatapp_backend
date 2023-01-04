const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const UserService = require("../../Services/User/user.service");
const userValidator = require("../../Controller/User/user.validator");
const getToken = require("../../../helper/authGaurd");
const email = require("../../../helper/email");
const userModal = require("../../Services/User/user.modal");
const path = require('path');
const User = require("../../Services/User/user.modal");

const cloudinary = require("../../../middleWare/cloudinary");
const uploader = require("../../../middleWare/multer")

router.get("/verify/:id", async (req, res) => {
  try {
    const { success, message, data } = await UserService.Exists(req.params._id);
    if (success) {
      const updateResponse = await UserService.update(req.params.id, {
        isActive: true,
      });
      if (updateResponse.success) {
        res.status(200).sendFile(path.join(__dirname, '../../../emailres.html'));

        // res.status(200).json({ ...updateResponse, data: null });
      } else {
        res.status(400).sendFile(path.join(__dirname, '../../../emailresnone.html'));
        // res.status(400).json({
        //   success: updateResponse.success,
        //   message: updateResponse.message,
        //   data: updateResponse.data,
        // });
      }
    } else {
      res.status(400).json({ success, message, data });
    }
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

router.post("/checkPassword/:id", async (req, res) => {
  try {
    const { success, message, data } = await UserService.Exists({
      _id: req.params.id,
    });
    if (success) {
      const { oldPassword } = req.body;
      const isValidPassword = await bcrypt.compare(oldPassword, data.password);
      if (isValidPassword) {
        res
          .status(200)
          .json({ success: true, message: "Password Matched", data: null });

      } else {
        res
          .status(400)
          .json({ success: false, message: "Password not matched", data: null });
      }

    } else {
      res.status(400).json({ success, message, data });
    }
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

router.post("/changePassword/:id", async (req, res) => {
  try {
    const { confirmPassword } = req.body;
    const options = { new: true };
    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(
      String(confirmPassword),
      salt
    );
    const finalBody = {
      password: encryptedPassword
    }
    const result = await User.findByIdAndUpdate(req.params.id, finalBody, options);
    if (result) {
      // const userData = await updateData.data;
      const { successMail } =
        await email.sendForPasswordUpdateSuccess(result);

      if (successMail) {
        res
          .status(200)
          .json({ success: successMail, message: "Mail sent!", data: null });
      } else {
        res
          .status(400)
          .json({ success: successMail, message: "Mail not sent!", data: null });
      }
    } else {
      res
        .status(400)
        .json({ success: false, message: "Something went wrong!", data: null });
    }
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

// router.post("/forgotPassword", async (req, res) => {
//   try {
//     // email is sent throught su req.body
//     const { success, message, data } = await UserService.Exists(req.body);

//     if (success) {
//       const userData = await data;
//       const { successMail, messageMail } = await email.sendForPasswordUpdate(
//         userData
//       );
//       if (successMail.success) {
//         res
//           .status(200)
//           .json({ success: successMail.success, message: messageMail });
//       } else {
//         res
//           .status(400)
//           .json({ success: successMail.success, message: messageMail });
//       }
//     } else {
//       res.status(400).json({ success, message, data });
//     }
//   } catch (error) {
//     res.status(400).json({ message: error });
//   }
// });

// router.post("/changeEmail/:id", async (req, res) => {
//   try {
//     const { oldEmail, newEmail } = req.body;
//     let { success, message, data } = await UserService.Exists({
//       _id: req.params.id,
//     });

//     if (success) {
//       const updated = await UserService.update(req.params.id, {
//         isActive: false,
//         email: newEmail,
//       });

//       if (updated.success) {
//         const userData = await updated.data;
//         const { successMail, messageMail } = await email.sendForEmailUpdate(
//           userData
//         );

//         if (successMail.success) {
//           res
//             .status(200)
//             .json({ success: successMail.success, message: messageMail });
//         } else {
//           res
//             .status(400)
//             .json({ success: successMail.success, message: messageMail });
//         }
//       } else {
//         return res.status(400).json({
//           success: updated.success,
//           message: updated.message,
//           data: updated.data,
//         });
//       }
//     } else {
//       res.status(400).json({ success, message, data });
//     }
//   } catch (error) {
//     res.status(400).json({ message: error });
//   }
// });

router.post("/signup", uploader.single("userImg"), async (req, res) => {
  try {

    const upload = await cloudinary.v2.uploader.upload(req.file.path);
    let { success, message, data } = await UserService.create(req.body, upload.secure_url);
    if (success) {
      return res.status(200).json({ success, message, data });
    } else {
      return res.status(400).json({ success, message, data });
    }
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    let { success, message, data } = await UserService.Exists({
      email: email,
    });
    if (success) {
      if (data.isActive) {
        const isValidPassword = await bcrypt.compare(password, data.password);
        if (!isValidPassword) {
          return res.status(400).json({
            success: false,
            message: "Passsword not matching",
            data: null,
          });
        } else {
          const token = getToken.createToken(data._id, email);
          // const result = await User.findByIdAndUpdate(data._id, { where: { userStatus: "active" } });
          const body = {
            token: token,
            ...data._doc
          };
          return res.status(200).json({ success, message, data: body });
        }
      } else {
        return res.status(400).json({
          success: false,
          message: "Please verify email address",
          data: null,
        });
      }
    } else {
      return res.status(400).json({ success, message, data });
    }


  } catch (error) {
    res.status(400).json({ message: error });
  }
});

router.get("/:id", async (req, res) => {
  try {
    let { success, message, data } = await UserService.Exists({
      _id: req.params.id,
    });
    if (success) {
      return res.status(200).json({ success, message, data });
    } else {
      return res.status(400).json({ success, message, data });
    }
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

router.put("/:id", uploader.single("userImg"), async (req, res) => {
  try {
    const upload = await cloudinary.v2.uploader.upload(req.file.path);
    if (req.file) {
      let { success, message, data } = await UserService.update(
        req.params.id,
        { ...req.body, userImg: upload.secure_url }
      );
      if (success) {
        return res.status(200).json({ success, message, data });
      } else {
        return res.status(400).json({ success, message, data });
      }
    } else {
      let { success, message, data } = await UserService.update(
        req.params.id,
        { ...req.body }
      );
      if (success) {
        return res.status(200).json({ success, message, data });
      } else {
        return res.status(400).json({ success, message, data });
      }
    }
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    let { success, message, data } = await UserService.update(
      req.params.id,
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
    let { success, message, data } = await UserService.softDelete(
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
    let { success, message, data } = await UserService.list(
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
      const result = await userModal.find({
        $or: [
          { username: { $regex: ".*" + searchText + ".*", $options: "i" } },
          { email: { $regex: ".*" + searchText + ".*", $options: "i" } }
        ],
      });
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
