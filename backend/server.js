const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/courses', require('./src/routes/courses'));
app.use('/api/notes', require('./src/routes/notes'));
app.use('/api/summaries', require('./src/routes/summaries'));

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
