const Contact = require('../../models/contacts');
const updateContact = async (req, res) => {
    const { id } = req.params;
    const { name, email, phone } = req.body;
    const { error } = contactValidation.validate(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
    } else {
      try {
        const contact = await Contact.findByIdAndUpdate(
          id,
          { name, email, phone },
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
module.exports = updateContact;