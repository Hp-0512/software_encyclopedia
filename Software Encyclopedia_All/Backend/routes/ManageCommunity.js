
const express = require("express");
const router = express.Router();
const controller = require("../controllers/communityController");

router.post("/join", controller.joinGroup);
router.get("/members", controller.getMembers);
router.delete("/remove/:id", controller.removeMember);
router.post("/message", controller.sendMessage);
router.get("/messages/:categoryId", controller.getMessages);
router.get("/membership/:userId/:categoryId", controller.checkMembership);

module.exports = router;
