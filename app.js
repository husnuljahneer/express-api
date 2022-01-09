const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const csurf = require('csurf');

dotenv = require('dotenv');

app.use(csurf({ cookie: true }));
app.use(compression());
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());
app.use(morgan('tiny'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
});
