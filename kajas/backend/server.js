const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const emailRoute = require('./routes/emailRoute');
const userRoutes = require('./routes/userRoutes');
const resetRoute = require('./routes/resetRoute');
const profileRoute = require('./routes/profileRoute');
const cors = require('cors');


const app = express();
const port = 4000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api', authRoutes);
app.use(emailRoute);
app.use('/api/users', userRoutes);
app.use(resetRoute);
app.use('/api', profileRoute);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});