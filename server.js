require('dotenv').config();

const app = require('./src/app');
const connectDB = require('./src/config/db');

connectDB();

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Hello from Node.js App Engine!');
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});