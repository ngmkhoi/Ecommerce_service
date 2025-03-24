const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json())

routes(app);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Kết nối MongoDB thành công!'))
    .catch(err => console.error('❌ Lỗi kết nối MongoDB:', err));



app.listen(3001, () => console.log('🚀 Server is running on port 3001'));
