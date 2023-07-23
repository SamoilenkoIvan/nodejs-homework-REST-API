const Contact = require('../models/contacts');
const listContacts = async (req, res) => {
    try {
      const contacts = await Contact.find();
      res.status(200).json(contacts);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  module.exports = listContacts;