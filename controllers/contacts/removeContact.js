const Contact = require('../../models/contacts');

const removeContact = async (req, res) => {
    const { id } = req.params;
    try {
      const contact = await Contact.findByIdAndRemove(id);
      if (contact) {
        res.status(200).json({ message: 'Contact deleted' });
      } else {
        res.status(404).json({ message: 'Not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  module.exports = removeContact;