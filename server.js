const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const color = require('colour');
const fileUpload = require('express-fileupload');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/err');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const helmet = require('helmet');
const ratelimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const path = require('path');

const cookieParser = require('cookie-parser');

// Route files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const user = require('./routes/user');
const reviews = require('./routes/reviews');

// Load env vars
dotenv.config({ path: './config/config.env' });

// connect to DB
connectDB();

// express
const app = express();

// Body parser
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use(fileUpload());

app.use(cookieParser());

app.use(mongoSanitize());

app.use(helmet());

app.use(xss());

app.use(hpp());

app.use(cors());

const limiter = ratelimit({
  windowMs: 10 * 60 * 1000,
  max: 1,
});
app.use(limiter);

// MountRouter
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', user);
app.use('/api/v1/reviews', reviews);

app.use(errorHandler);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server Running in ${process.env.NODE_ENV} mode on the port ${PORT}`.yellow
      .bold
  )
);

// Handele unhandled promise rejections
process.on('unhandleRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // close server
  server.close(() => process.exit(1));
});
