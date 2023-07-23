const express = require("express");
const router = express.Router();
const contacts = require("../../controllers/contacts");

router.get("/", contacts.listContacts);
router.get("/:id", contacts.getContactById);
router.post("/", contacts.addContact);
router.delete("/:id", contacts.removeContact);
router.put("/:id", contacts.updateContact);
router.patch("/:contactId/favorite", contacts.updateStatusContact);

module.exports = router;
