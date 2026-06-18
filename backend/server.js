const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    dbName: 'three-tier-db',
  })
  .then(() => {
    console.log('✅ MongoDB connected');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });

mongoose.connection.once('open', () => {
  console.log('📦 Using DB:', mongoose.connection.name);
});

// Schema & Model
const ItemSchema = new mongoose.Schema({
  name: String,
});

const Item = mongoose.model('Item', ItemSchema);

// Root Route
app.get('/', (req, res) => {
  res.send('Three-Tier App Backend is running 🚀');
});

// Get All Items
app.get('/api/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add Item
app.post('/api/items', async (req, res) => {
  try {
    const newItem = new Item({
      name: req.body.name,
    });

    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
