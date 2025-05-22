const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/passenger', require('./routes/passengerRoutes'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server active on port ${PORT}`));