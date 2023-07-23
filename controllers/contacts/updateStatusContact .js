const Contact = require('../models/contacts');

const updateStatusContact = async (req, res) => {
    const { contactId } = req.params;
    const { favorite } = req.body;
    if (favorite === undefined) {
      res.status(400).json({ message: 'Missing field favorite' });
    } else {
      try {
        const contact = await Contact.findByIdAndUpdate(
          contactId,
          { favorite },
          { new: true }
        );
        if (contact) {
          res.status(200).json(contact);
        } else {
          res.status(404).json({ message: 'Not found' });
        }
      } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };
  module.exports = updateStatusContact;