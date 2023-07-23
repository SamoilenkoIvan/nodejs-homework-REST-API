const Contact = require('../../models/contacts');
const getContactById = async (req, res) => {
    const { id } = req.params;
    try {
      const contact = await Contact.findById(id);
      if (contact) {
        res.status(200).json(contact);
      } else {
        res.status(404).json({ message: 'Not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  module.exports = getContactById;