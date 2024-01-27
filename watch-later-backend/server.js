// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const env = require('dotenv')
require('dotenv').config();
const watchLaterRoutes = require('./routes/watchLaterRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.DB_PATH).then(res => console.log("connected to database")).catch(err => console.log(err))

app.use('/api/watch-later', watchLaterRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
