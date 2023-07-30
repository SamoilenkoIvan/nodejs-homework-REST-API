// mongodb+srv://samoilenkoim:eo9ommx9XWSkdNUC@cluster0.ov0kgvv.mongodb.net/db-contacts?retryWrites=true&w=majority
// eo9ommx9XWSkdNUC
const mongoose = require('mongoose');
const DB_HOST = "mongodb+srv://samoilenkoim:eo9ommx9XWSkdNUC@cluster0.ov0kgvv.mongodb.net/db-contacts?retryWrites=true&w=majority";

mongoose.connect(DB_HOST)
.then(() => console.log("Database connection successful"))
.catch(() => console.log("error.message"))


const express = require('express')
const logger = require('morgan')
const cors = require('cors')

const contactsRouter = require('./routes/api/contacts')
const usersRouter = require('./routes/api/users');
const userRoutes = require('./routes/api/users');
const app = express()
const authMiddleware = require('./middlewares/auth');
const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'
const multer = require('multer');
const path = require('path');

app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json())

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/avatars');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

app.use(express.static('public'));

app.use('/api/contacts', authMiddleware, contactsRouter);
app.use('/api/users', authMiddleware, usersRouter);
app.use('/api/users', userRoutes);
app.use((req, res) => {
  res.status(404).json({ message: 'Not found' })
})

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message })
})

module.exports = app
