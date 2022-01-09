const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const router = require('./routes');
const logger = require('./utils/logger');

const morganMiddleware = morgan("combined", {
    skip: (req, res) => res.statusCode < 400,
  stream: {
    write: (msg) => logger.http(msg)
  }
});


dotenv = require('dotenv');

app.use(compression());
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());
app.use(morgan('tiny'));
app.use(morganMiddleware);
app.use(bodyParser.urlencoded({ extended: true }));

app.use(router);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
});
