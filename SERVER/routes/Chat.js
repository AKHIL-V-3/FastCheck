const express = require('express');
const app = express();
var router = express.Router();
const chatController = require("../Controllers/Chatcontroller");
const { verifyHost } = require('../Controllers/Hostcontroller');



router.post("/",chatController.addConversation)
router.post("/message",chatController.addMessage)

router.get("/gethost/:hostId",chatController.getHost)
router.get("/getallcommunicatedusers/:userId",chatController.getAllHosts)

router.get("/:currentUserId",chatController.getConversation)
router.get("/host/:userId",chatController.getConversation)
router.get("/message/:conversationId",chatController.getMessage)
router.get("/gethostdata/:coversationId",chatController.getSelecedHost)
router.get("/getuser/:coversationId",chatController.getSelecedUser)
router.get("/lastmessage/:conversationId",chatController.getLastMessages)





module.exports = router;
