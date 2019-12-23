const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
const bodyParser = require('body-parser')

const usersRouter = require('./routes/users');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/users', usersRouter);

require('dotenv').config();

const port = process.env.PORT || 8080;
const db = mongoose.connection;

app.listen(port, () => console.log(`Server listening on port ${port}!`));

mongoose.connect(process.env.ATLAS_URI, { useNewUrlParser: true, useUnifiedTopology: true });
db.once('open', function () {
    console.log('Database connected successfully');
});