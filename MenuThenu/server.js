import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from "cors";
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import xlsx from 'xlsx';
import Tesseract from 'tesseract.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY || 'your-spoonacular-api-key';
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || 'your-unsplash-access-key';

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
  ingredients: [{
    name: String,
    amount: String
  }],
  menuId: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu' }
});

// User schema to manage menus created by users
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  menus: [{
    menuId: String,
    menuName: String,
    collectionName: String,
    createdAt: { type: Date, default: Date.now }
  }]
});
const User = mongoose.model('User', UserSchema);

// Menu schema to store menu configuration
const MenuSchema = new mongoose.Schema({
  name: String,
  description: String,
  template: String,
  userId: String, // Reference to the user who created this menu
  collectionName: String, // Name of the collection storing this menu's items
  subdomain: {
    type: String,
    unique: true,
    sparse: true, // Allows null values (for menus without a subdomain)
    lowercase: true,
    trim: true,
    match: [/^[a-z0-9-]+$/, 'Subdomain can only contain lowercase letters, numbers, and hyphens']
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  customization: {
    font: String,
    color: {
      background: String,
      text: String,
      accent: String,
      secondaryText: String
    },
    backgroundImage: {
      url: String,
      display: {
        type: String,
        enum: ['tile', 'fullscreen', 'none'],
        default: 'none'
      },
      opacity: {
        type: Number,
        min: 0,
        max: 1,
        default: 1
      }
    }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
const Menu = mongoose.model('Menu', MenuSchema);

// Add index for efficient subdomain lookup
MenuSchema.index({ subdomain: 1 });

// Function to create a dynamic model for menu items
const getMenuItemsModel = (collectionName) => {
  // Check if this model already exists to prevent overwriting
  if (mongoose.models[collectionName]) {
    return mongoose.model(collectionName);
  }
  
  // Create a new model with the MenuItemSchema
  return mongoose.model(collectionName, MenuItemSchema);
};

// Authentication middleware
const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Authentication failed' });
  }
};

// Subdomain middleware - parse the subdomain from the hostname
app.use((req, res, next) => {
  const hostname = req.hostname || '';
  const parts = hostname.split('.');
  
  // Check if we have a subdomain (e.g., restaurant.menuthenu.com)
  // In development, you might have localhost, so check the length
  if (parts.length > 2) { // For production with domain like xxx.menuthenu.com
    req.subdomain = parts[0];
  } else if (parts.length === 2 && parts[1] === 'localhost') { // For testing with xxx.localhost
    req.subdomain = parts[0];
  } else {
    req.subdomain = null;
  }
  
  next();
});

// Helper function to search food image from Unsplash API
async function searchFoodImage(foodName) {
  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(foodName + " food")}&per_page=1`,
      {
        headers: {
          'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
        }
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch image from Unsplash');
    }
    
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      return data.results[0].urls.regular;
    }
    
    // Fallback to a default food image
    return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c';
  } catch (error) {
    console.error('Error fetching food image:', error);
    // Return a fallback image
    return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c';
  }
}

// Helper function to get ingredients from Spoonacular API
async function getFoodIngredients(foodName) {
  try {
    // First search for recipes matching the food name
    const searchResponse = await fetch(
      `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(foodName)}&number=1&apiKey=${SPOONACULAR_API_KEY}`
    );
    
    if (!searchResponse.ok) {
      throw new Error('Failed to search recipe');
    }
    
    const searchData = await searchResponse.json();
    if (!searchData.results || searchData.results.length === 0) {
      throw new Error('No recipes found');
    }
    
    const recipeId = searchData.results[0].id;
    
    // Then get detailed information about the recipe including ingredients
    const recipeResponse = await fetch(
      `https://api.spoonacular.com/recipes/${recipeId}/information?includeNutrition=true&apiKey=${SPOONACULAR_API_KEY}`
    );
    
    if (!recipeResponse.ok) {
      throw new Error('Failed to get recipe information');
    }
    
    const recipeData = await recipeResponse.json();
    
    // Extract ingredients and nutrition data
    const ingredients = recipeData.extendedIngredients.map(ingredient => ({
      name: ingredient.name,
      amount: `${ingredient.amount} ${ingredient.unit}`
    }));
    
    const nutrition = {
      calories: recipeData.nutrition?.nutrients.find(n => n.name === "Calories")?.amount || 0,
      protein: recipeData.nutrition?.nutrients.find(n => n.name === "Protein")?.amount || 0,
      carbs: recipeData.nutrition?.nutrients.find(n => n.name === "Carbohydrates")?.amount || 0,
      fat: recipeData.nutrition?.nutrients.find(n => n.name === "Fat")?.amount || 0,
      fiber: recipeData.nutrition?.nutrients.find(n => n.name === "Fiber")?.amount || 0,
      sugar: recipeData.nutrition?.nutrients.find(n => n.name === "Sugar")?.amount || 0
    };
    
    return { ingredients, nutrition };
  } catch (error) {
    console.error('Error fetching food ingredients:', error);
    // Return a simplified fallback data
    return {
      ingredients: [
        { name: "Ingredients data unavailable", amount: "" }
      ],
      nutrition: {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
        sugar: 0
      }
    };
  }
}

// API Routes
// User registration
app.post('/api/users/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ username }, { email }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already in use' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      menus: []
    });
    
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// User login
app.post('/api/users/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get all menu items for a specific menu
app.get('/api/menus/:id/items', async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id);
    if (!menu) {
      return res.status(404).json({ error: 'Menu not found' });
    }
    
    const MenuItems = getMenuItemsModel(menu.collectionName);
    const items = await MenuItems.find();
    res.json(items);
  } catch (err) {
    console.error('Error fetching menu items:', err);
    res.status(500).json({ error: 'Failed to retrieve menu items' });
  }
});

// Create a new menu with its own collection
app.post('/api/menus', auth, async (req, res) => {
  try {
    // Get user from the auth middleware
    const userId = req.userId;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Generate a unique collection name based on menu name and timestamp
    const sanitizedMenuName = req.body.name.replace(/\s+/g, '_').toLowerCase();
    const timestamp = Date.now();
    const collectionName = `menu_${sanitizedMenuName}_${timestamp}`;
    
    // Create the menu document
    const newMenu = new Menu({
      ...req.body,
      userId,
      collectionName
    });
    
    await newMenu.save();
    
    // Update the user's menus array
    user.menus.push({
      menuId: newMenu._id,
      menuName: newMenu.name,
      collectionName
    });
    
    await user.save();
    
    res.status(201).json(newMenu);
  } catch (err) {
    console.error('Error creating menu:', err);
    res.status(400).json({ error: 'Failed to create menu' });
  }
});

// Add items to a specific menu collection
app.post('/api/menus/:id/items', async (req, res) => {
  try {
    const menuId = req.params.id;
    const menu = await Menu.findById(menuId);
    if (!menu) {
      return res.status(404).json({ error: 'Menu not found' });
    }

    // Get the dynamic model for this menu's collection
    const MenuItems = getMenuItemsModel(menu.collectionName);
    
    // Add the items to the collection
    const savedItems = await MenuItems.insertMany(req.body.items);
    res.status(201).json(savedItems);
  } catch (err) {
    console.error('Error adding menu items:', err);
    res.status(400).json({ error: 'Failed to add menu items' });
  }
});

// Get all menus for a specific user
app.get('/api/users/:username/menus', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Get all menu details
    const menuIds = user.menus.map(menu => menu.menuId);
    const menus = await Menu.find({ _id: { $in: menuIds } });
    
    res.json(menus);
  } catch (err) {
    console.error('Error fetching user menus:', err);
    res.status(500).json({ error: 'Failed to retrieve user menus' });
  }
});

// Update a menu item in its specific collection
app.patch('/api/menus/:menuId/items/:itemId', async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.menuId);
    if (!menu) {
      return res.status(404).json({ error: 'Menu not found' });
    }
    
    const MenuItems = getMenuItemsModel(menu.collectionName);
    const updatedItem = await MenuItems.findByIdAndUpdate(
      req.params.itemId,
      req.body,
      { new: true }
    );
    
    if (!updatedItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    
    res.json(updatedItem);
  } catch (err) {
    console.error('Error updating item:', err);
    res.status(400).json({ error: 'Update failed' });
  }
});

// Delete a menu and its collection
app.delete('/api/menus/:id', async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id);
    if (!menu) {
      return res.status(404).json({ error: 'Menu not found' });
    }
    
    // Find the user who owns this menu
    const user = await User.findById(menu.userId);
    if (user) {
      // Remove the menu from the user's menus array
      user.menus = user.menus.filter(m => m.menuId.toString() !== req.params.id);
      await user.save();
    }
    
    // Delete the menu document
    await Menu.findByIdAndDelete(req.params.id);
    
    // Drop the collection (optional - you might want to keep the data)
    try {
      await mongoose.connection.db.dropCollection(menu.collectionName);
    } catch (dropErr) {
      console.warn(`Collection ${menu.collectionName} could not be dropped: ${dropErr.message}`);
    }
    
    res.json({ message: 'Menu deleted successfully' });
  } catch (err) {
    console.error('Error deleting menu:', err);
    res.status(500).json({ error: 'Failed to delete menu' });
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

    // Process the Excel/CSV files
    if (['.xlsx', '.xls', '.csv'].includes(fileExtension)) {
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = xlsx.utils.sheet_to_json(worksheet);
      
      // Process each item - but limit concurrent API requests
      const processedItems = [];
      for (const row of data) {
        const itemName = row.name || row.Name || row.ITEM || row.Item || '';
        if (!itemName) continue;

        try {
          // Get food image
          const imageUrl = await searchFoodImage(itemName);
          
          // Get food ingredients and nutrition
          const { ingredients, nutrition } = await getFoodIngredients(itemName);

          // Add to processed items
          processedItems.push({
            name: itemName,
            price: parseFloat(row.price || row.Price || row.PRICE || 0),
            description: row.description || row.Description || '',
            category: row.category || row.Category || 'Uncategorized',
            isVegetarian: Boolean(row.isVegetarian || row.IsVegetarian || row.Vegetarian || false),
            image: imageUrl,
            ingredients: ingredients,
            nutrition: nutrition
          });
        } catch (itemError) {
          console.error(`Error processing item ${itemName}:`, itemError);
        }
      }
      
      extractedItems = processedItems;
    }
    // Handle image files (OCR)
    else if (['.jpg', '.jpeg', '.png'].includes(fileExtension)) {
      const { data } = await Tesseract.recognize(filePath, 'eng');
      const text = data.text;
      
      // Parse OCR text
      const lines = text.split('\n').filter(line => line.trim());
      
      // Process each detected item - limit concurrent API requests
      const processedItems = [];
      for (const line of lines) {
        const match = line.match(/(.+?)\s+(\$?\d+\.?\d*)/);
        if (!match) continue;
        
        const itemName = match[1].trim();
        try {
          // Get food image
          const imageUrl = await searchFoodImage(itemName);
          
          // Get food ingredients and nutrition
          const { ingredients, nutrition } = await getFoodIngredients(itemName);

          // Add to processed items
          processedItems.push({
            name: itemName,
            price: parseFloat(match[2].replace('$', '')),
            description: 'Extracted from image',
            category: 'Uncategorized',
            isVegetarian: false,
            image: imageUrl,
            ingredients: ingredients,
            nutrition: nutrition
          });
        } catch (itemError) {
          console.error(`Error processing item ${itemName}:`, itemError);
        }
      }
      
      extractedItems = processedItems;
    }

    res.json({ items: extractedItems });
  } catch (err) {
    console.error('Extraction error:', err);
    res.status(500).json({ error: 'Failed to extract data from file' });
  }
});

// New endpoint to get food data for a single item
app.get('/api/food-data/:foodName', async (req, res) => {
  try {
    const foodName = req.params.foodName;
    
    // Get food image
    const imageUrl = await searchFoodImage(foodName);
    
    // Get food ingredients and nutrition
    const { ingredients, nutrition } = await getFoodIngredients(foodName);
    
    res.json({
      image: imageUrl,
      ingredients,
      nutrition
    });
  } catch (err) {
    console.error('Error fetching food data:', err);
    res.status(500).json({ error: 'Failed to fetch food data' });
  }
});

// Upload background image
app.post('/api/upload-background', upload.single('backgroundImage'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }
    
    // Return the URL to the uploaded image
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ url: imageUrl });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Upload menu item image
app.post('/api/upload-item-image', upload.single('itemImage'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }
    
    // Return the URL to the uploaded image
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ url: imageUrl });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Route to serve published menus via subdomain
app.get('/', async (req, res) => {
  // If no subdomain or it's 'www', serve the main application
  if (!req.subdomain || req.subdomain === 'www') {
    return res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  }
  
  try {
    // Find the menu by subdomain
    const menu = await Menu.findOne({ subdomain: req.subdomain, isPublished: true });
    
    if (!menu) {
      return res.status(404).send('Menu not found');
    }
    
    // Get the menu items
    const MenuItems = getMenuItemsModel(menu.collectionName);
    const items = await MenuItems.find();
    
    // Serve a specialized page for the published menu
    // For simplicity, we'll render a basic HTML template,
    // but you might want to use a templating engine like EJS, Handlebars, etc.
    const html = generateMenuHtml(menu, items);
    res.send(html);
  } catch (err) {
    console.error('Error serving subdomain:', err);
    res.status(500).send('Error loading menu');
  }
});

// Function to generate HTML for a published menu
function generateMenuHtml(menu, items) {
  const bgImage = menu.customization?.backgroundImage?.url 
    ? `background-image: url('${menu.customization.backgroundImage.url}');
       background-size: ${menu.customization.backgroundImage.display === 'fullscreen' ? 'cover' : 'repeat'};
       background-repeat: ${menu.customization.backgroundImage.display === 'fullscreen' ? 'no-repeat' : 'repeat'};
       opacity: ${menu.customization.backgroundImage.opacity || 1};`
    : '';
    
  const bgColor = menu.customization?.color?.background || '#ffffff';
  const textColor = menu.customization?.color?.text || '#000000';
  const accentColor = menu.customization?.color?.accent || '#3b82f6';
  const secondaryTextColor = menu.customization?.color?.secondaryText || '#666666';
  const fontFamily = menu.customization?.font || 'sans-serif';
  
  // Group items by category
  const categories = {};
  items.forEach(item => {
    const category = item.category || 'Uncategorized';
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push(item);
  });
  
  // Build the HTML with menu customizations
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${menu.name}</title>
      <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
      <style>
        body {
          font-family: ${fontFamily}, sans-serif;
          background-color: ${bgColor};
          color: ${textColor};
        }
        .bg-image {
          ${bgImage}
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
        }
        .accent-color {
          color: ${accentColor};
        }
        .accent-bg {
          background-color: ${accentColor};
        }
        .secondary-text {
          color: ${secondaryTextColor};
        }
        .menu-header {
          padding: 2rem 0;
          text-align: center;
        }
        .menu-title {
          font-size: 2.5rem;
          font-weight: bold;
          color: ${accentColor};
        }
        .category-title {
          font-size: 1.75rem;
          margin: 1.5rem 0;
          color: ${accentColor};
          border-bottom: 2px solid ${accentColor};
          padding-bottom: 0.5rem;
        }
        .menu-item {
          margin-bottom: 1.5rem;
          padding: 1rem;
          border-radius: 0.5rem;
          background-color: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(5px);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .item-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 0.5rem;
        }
        .item-name {
          font-weight: bold;
          font-size: 1.25rem;
        }
        .item-price {
          font-weight: bold;
          color: ${accentColor};
        }
        .item-description {
          font-size: 0.875rem;
          color: ${secondaryTextColor};
        }
        .veg-badge {
          display: inline-block;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background-color: #22c55e;
          margin-left: 6px;
        }
        footer {
          text-align: center;
          padding: 2rem;
          font-size: 0.75rem;
          color: ${secondaryTextColor};
        }
      </style>
    </head>
    <body>
      <div class="bg-image"></div>
      <div class="container mx-auto px-4 py-8">
        <header class="menu-header">
          <h1 class="menu-title">${menu.name}</h1>
          ${menu.description ? `<p class="mt-2 secondary-text">${menu.description}</p>` : ''}
        </header>
        
        <main>
          ${Object.entries(categories).map(([category, categoryItems]) => `
            <section>
              <h2 class="category-title">${category}</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                ${categoryItems.map(item => `
                  <div class="menu-item">
                    <div class="item-header">
                      <h3 class="item-name">
                        ${item.name}
                        ${item.isVegetarian ? '<span class="veg-badge"></span>' : ''}
                      </h3>
                      <span class="item-price">$${item.price.toFixed(2)}</span>
                    </div>
                    ${item.description ? `<p class="item-description">${item.description}</p>` : ''}
                  </div>
                `).join('')}
              </div>
            </section>
          `).join('')}
        </main>
        
        <footer>
          <p>Menu powered by MenuThenu</p>
        </footer>
      </div>
    </body>
    </html>
  `;
}

// Add endpoint to claim/set a subdomain for a menu
app.post('/api/menus/:id/subdomain', auth, async (req, res) => {
  try {
    const { subdomain } = req.body;
    
    if (!subdomain) {
      return res.status(400).json({ error: 'Subdomain is required' });
    }
    
    // Validate subdomain format (lowercase letters, numbers, hyphens)
    const subdomainRegex = /^[a-z0-9-]+$/;
    if (!subdomainRegex.test(subdomain)) {
      return res.status(400).json({ 
        error: 'Subdomain can only contain lowercase letters, numbers, and hyphens' 
      });
    }
    
    // Check if the subdomain is already taken
    const existingMenu = await Menu.findOne({ subdomain });
    if (existingMenu && existingMenu._id.toString() !== req.params.id) {
      return res.status(400).json({ error: 'This subdomain is already taken' });
    }
    
    // Update the menu with the subdomain
    const menu = await Menu.findByIdAndUpdate(
      req.params.id,
      { 
        subdomain,
        updatedAt: Date.now()
      },
      { new: true }
    );
    
    if (!menu) {
      return res.status(404).json({ error: 'Menu not found' });
    }
    
    res.json(menu);
  } catch (err) {
    console.error('Error setting subdomain:', err);
    res.status(500).json({ error: 'Failed to set subdomain' });
  }
});

// Add endpoint to publish/unpublish a menu
app.post('/api/menus/:id/publish', auth, async (req, res) => {
  try {
    const { isPublished } = req.body;
    
    // Update the menu's published status
    const menu = await Menu.findByIdAndUpdate(
      req.params.id,
      { 
        isPublished: Boolean(isPublished),
        updatedAt: Date.now()
      },
      { new: true }
    );
    
    if (!menu) {
      return res.status(404).json({ error: 'Menu not found' });
    }
    
    // If publishing and no subdomain is set, generate one based on menu name
    if (isPublished && !menu.subdomain) {
      // Create a URL-friendly version of the menu name
      let autoSubdomain = menu.name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric chars with hyphens
        .replace(/^-+|-+$/g, ''); // Remove leading and trailing hyphens
      
      // Check if this subdomain is available
      let isUnique = false;
      let counter = 1;
      let testSubdomain = autoSubdomain;
      
      while (!isUnique) {
        const existing = await Menu.findOne({ subdomain: testSubdomain });
        if (!existing) {
          isUnique = true;
        } else {
          testSubdomain = `${autoSubdomain}-${counter}`;
          counter++;
        }
      }
      
      // Update with the auto-generated subdomain
      menu.subdomain = testSubdomain;
      await menu.save();
    }
    
    res.json(menu);
  } catch (err) {
    console.error('Error publishing menu:', err);
    res.status(500).json({ error: 'Failed to update published status' });
  }
});

// Endpoint to render menu HTML for printing
app.get('/api/menus/:id/render', async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id);
    if (!menu) {
      return res.status(404).json({ error: 'Menu not found' });
    }
    
    // Get the menu items
    const MenuItems = getMenuItemsModel(menu.collectionName);
    const items = await MenuItems.find();
    
    // Generate HTML for the menu using the same function as for subdomains
    const html = generateMenuHtml(menu, items);
    
    // Set content type to HTML and send response
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (err) {
    console.error('Error rendering menu:', err);
    res.status(500).json({ error: 'Failed to render menu' });
  }
});

// List all menus
app.get('/api/menus', async (req, res) => {
  try {
    const menus = await Menu.find();
    res.json(menus);
  } catch (err) {
    console.error('Error fetching menus:', err);
    res.status(500).json({ error: 'Failed to fetch menus' });
  }
});

// Test endpoint
app.get('/test', (req, res) => res.send('ok'));

// Serve static files - make sure this comes AFTER the subdomain route handler
app.use(express.static(path.join(__dirname, 'dist')));


// ******Error  in this part*******
// For client-side routing, send back the index.html for any other routes 
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});


// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});