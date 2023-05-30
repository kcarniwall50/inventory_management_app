const express = require("express");
const protector = require("../middleware/protector");
const { contactUs } = require("../controllers/contactController");
const router = express.Router();

//contact us
router.post("/help/contactUs", protector, contactUs);

module.exports = router;
