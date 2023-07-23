const Contact = require('../models/contacts');
const addContact = async (req, res) => {
  const { name, email, phone } = req.body;
  const { error } = contactValidation.validate(req.body);
  if (error) {
    res.status(400).json({ message: error.details[0].message });
  } else {
    try {
      const newContact = await Contact.create(req.body);
      res.status(201).json(newContact);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};
module.exports = addContact;