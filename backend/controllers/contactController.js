const dataModel = require("../models/Model");
const sendEmail = require("../utils/sendEmail");

const contactUs = async (req, res) => {
  let { subject, message } = req.body;
  const user = await dataModel.findById(req.user._id);

  if (!user) {
    res.status(400);
    throw new Error("user not found, please login again");
  }

  if (!subject || !message) {
    res.status(400).json("please add subject and message");
  }

  const send_to = process.env.Email_User;
  const sent_from = process.env.Email_User;
  const reply_to = user.email;

  try {
    await sendEmail(subject, message, send_to, sent_from, reply_to);
    res.status(200).json({ message: "Email sent" });
  } catch {
    res.status(500);
    throw new Error("Email could not be sent, please try again");
  }
};

module.exports = { contactUs };
