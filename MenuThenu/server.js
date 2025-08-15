import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';

const app = express();

const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI;

// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// Example schema and model
const MenuItemSchema = new mongoose.Schema({
  name: String,
  price: Number,
});
const MenuItem = mongoose.model('MenuItem', MenuItemSchema);

// Example route: Get all menu items
app.get('/api/menu', async (req, res) => {
  const items = await MenuItem.find();
  res.json(items);
});

// Example route: Add a menu item
app.post('/api/menu', async (req, res) => {
  const newItem = new MenuItem(req.body);
  await newItem.save();
  res.status(201).json(newItem);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});