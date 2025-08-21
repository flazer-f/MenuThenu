import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from "cors";
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import xlsx from 'xlsx';
import Tesseract from 'tesseract.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI;

// Setup multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'uploads/'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// Enhanced schema with additional fields
const MenuItemSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  category: String,
  isVegetarian: Boolean,
  image: String,
  menuId: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu' }
});
const MenuItem = mongoose.model('MenuItem', MenuItemSchema);

// Menu schema to group items
const MenuSchema = new mongoose.Schema({
  name: String,
  description: String,
  template: String,
  customization: Object,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
const Menu = mongoose.model('Menu', MenuSchema);

// API Routes
// Get all menu items
app.get('/api/menu', async (req, res) => {
  try {
    const items = await MenuItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve menu items' });
  }
});

// Get a specific menu with its items
app.get('/api/menus/:id', async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id);
    if (!menu) {
      return res.status(404).json({ error: 'Menu not found' });
    }
    
    const items = await MenuItem.find({ menuId: menu._id });
    res.json({ menu, items });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve menu' });
  }
});

// Create a new menu
app.post('/api/menus', async (req, res) => {
  try {
    const newMenu = new Menu(req.body);
    await newMenu.save();
    res.status(201).json(newMenu);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create menu' });
  }
});

// Extract data from uploaded file
app.post('/api/extract-menu', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const fileExtension = path.extname(req.file.originalname).toLowerCase();
    let extractedItems = [];

    // Handle Excel files
    if (['.xlsx', '.xls', '.csv'].includes(fileExtension)) {
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = xlsx.utils.sheet_to_json(worksheet);
      
      extractedItems = data.map(row => ({
        name: row.name || row.Name || row.ITEM || row.Item || '',
        price: parseFloat(row.price || row.Price || row.PRICE || 0),
        description: row.description || row.Description || '',
        category: row.category || row.Category || 'Uncategorized',
        isVegetarian: Boolean(row.isVegetarian || row.IsVegetarian || row.Vegetarian || false)
      }));
    }
    // Handle image files
    else if (['.jpg', '.jpeg', '.png'].includes(fileExtension)) {
      const { data } = await Tesseract.recognize(filePath, 'eng');
      const text = data.text;
      
      // Simple parsing logic for OCR text - this would need to be much more sophisticated in a real app
      const lines = text.split('\n').filter(line => line.trim());
      
      extractedItems = lines.map(line => {
        // Try to extract item and price with a simple regex
        const match = line.match(/(.+?)\s+(\$?\d+\.?\d*)/);
        if (match) {
          return {
            name: match[1].trim(),
            price: parseFloat(match[2].replace('$', '')),
            description: '',
            category: 'Uncategorized',
            isVegetarian: false
          };
        }
        return null;
      }).filter(item => item !== null);
    }

    res.json({ items: extractedItems });
  } catch (err) {
    console.error('Extraction error:', err);
    res.status(500).json({ error: 'Failed to extract data from file' });
  }
});

// Add items to a menu
app.post('/api/menus/:id/items', async (req, res) => {
  try {
    const menuId = req.params.id;
    const menu = await Menu.findById(menuId);
    if (!menu) {
      return res.status(404).json({ error: 'Menu not found' });
    }

    const items = req.body.items.map(item => ({
      ...item,
      menuId: menu._id
    }));

    const savedItems = await MenuItem.insertMany(items);
    res.status(201).json(savedItems);
  } catch (err) {
    res.status(400).json({ error: 'Failed to add menu items' });
  }
});

// Update a menu item
app.patch('/api/menu/:id', async (req, res) => {
  try {
    const updatedItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ error: 'Update failed' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});