const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const JWT_SECRET = 'your-secret-key';

// Get products by category
router.get('/products/category/:category', async (req, res) => {
  try {
    const categoryName = req.params.category.toUpperCase();
    console.log('Searching for category:', categoryName);
    
    // First find the category (SQLite is case-sensitive by default, so use exact match)
    const category = await prisma.category.findFirst({
      where: {
        name: categoryName
      }
    });
    
    console.log('Found category:', category);
    
    if (!category) {
      console.log('Category not found');
      return res.json([]);
    }
    
    // Then find products for that category
    const products = await prisma.product.findMany({
      where: {
        categoryId: category.id
      },
      include: {
        category: true,
        specifications: true
      }
    });
    
    console.log(`Found ${products.length} products for category ${categoryName}`);
    res.json(products);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get single product by ID
router.get('/products/:id', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: {
        category: true,
        specifications: true,
        reviews: {
          include: {
            user: {
              select: { id: true, name: true }
            }
          }
        }
      }
    });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Add middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Add middleware to check admin
const checkAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Add new product (allow authenticated users)
router.post('/products', verifyToken, async (req, res) => {
  try { 
    console.log('Received product data:', req.body);
    console.log('User:', req.user);
    
    // First, find or create category
    let category = await prisma.category.findFirst({
      where: { name: req.body.category.toUpperCase() }
    });
    
    if (!category) {
      category = await prisma.category.create({
        data: { name: req.body.category.toUpperCase() }
      });
    }
    
    const product = await prisma.product.create({
      data: {
        name: req.body.name,
        price: Number(req.body.price),
        rating: Number(req.body.rating) || 4,
        image: req.body.image,
        description: req.body.description,
        subcategory: req.body.subcategory,
        stock: req.body.stock || 0,
        categoryId: category.id
      },
      include: {
        category: true,
        specifications: true
      }
    });

    console.log('Saved product:', product);
    res.status(201).json(product);
  } catch (error) {
    console.error('Error saving product:', error);
    res.status(500).json({ error: 'Error saving product: ' + error.message });
  }
});

// Delete product
router.delete('/products/:id', async (req, res) => {
  try {
    console.log('Deleting product:', req.params.id);
    const deleted = await prisma.product.delete({
      where: { id: req.params.id }
    });
    console.log("Product deleted successfully:", deleted.name);
    res.json({ message: 'Product deleted successfully', product: deleted });
  } catch (error) {
    console.error('Error deleting product:', error.message);
    res.status(500).json({ error: 'Error deleting product: ' + error.message });
  }
});


// User signup
router.post('/signup', async (req, res) => {
  try {
    const user = await prisma.user.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      }
    });
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error creating user:', error);
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Error creating user' });
  }
});

// User login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Admin login check
    if (email === 'admin@g.com' && password === '123') {
      const token = jwt.sign(
        { isAdmin: true },
        JWT_SECRET,
        { expiresIn: '1h' }
      );
      return res.json({ 
        token, 
        isAdmin: true,
        message: 'Admin login successful' 
      });
    }
    
    // Regular user login
    const user = await prisma.user.findFirst({
      where: {
        email: email,
        password: password
      }
    });
    
    if (user) {
      const token = jwt.sign(
        { userId: user.id, isAdmin: user.isAdmin },
        JWT_SECRET,
        { expiresIn: '1h' }
      );
      res.json({ 
        token, 
        isAdmin: user.isAdmin,
        message: 'Login successful' 
      });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Error during login' });
  }
});

router.get('/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        specifications: true
      }
    });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Error fetching products' });
  }
});

router.get('/categories', async (req, res) => {
  try {
    const { populate: category } = req.query;
    if (!category) {
      const products = await prisma.product.findMany({
        include: {
          category: true,
          specifications: true
        }
      });
      return res.json(products);
    }
    if (category) {
      const products = await prisma.product.findMany({
        where: {
          category: {
            name: {
              contains: category.toUpperCase(),
              mode: 'insensitive'
            }
          }
        },
        include: {
          category: true,
          specifications: true
        }
      });
      return res.json(products);
    }

  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Error fetching products' });
  }
});

// Around line 159, fix the variable declaration issue
router.get('/api/products', async (req, res) => {
  try {
    let products; // Declare variable first
    
    const { search, category, populate } = req.query;
    let whereClause = {};
    
    // Build where clause
    if (category) {
      whereClause.category = {
        name: {
          equals: category,
          mode: 'insensitive'
        }
      };
    }
    
    if (search) {
      whereClause.OR = [
        { 
          name: { 
            contains: search, 
            mode: 'insensitive' 
          } 
        },
        { 
          description: { 
            contains: search, 
            mode: 'insensitive' 
          } 
        }
      ];
    }
    
    const includeClause = {
      category: true,
      specifications: true
    };
    
    if (populate) {
      includeClause.reviews = {
        include: {
          user: {
            select: { id: true, name: true }
          }
        }
      };
    }
    
    products = await prisma.product.findMany({
      where: whereClause,
      include: includeClause
    });
    
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Fix category-specific products route
router.get('/api/products/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { populate } = req.query;
    
    let products;
    const whereClause = { 
      category: {
        name: {
          equals: category.toUpperCase(),
          mode: 'insensitive'
        }
      }
    };
    
    const includeClause = {
      category: true,
      specifications: true
    };
    
    if (populate) {
      includeClause.reviews = {
        include: {
          user: {
            select: { id: true, name: true }
          }
        }
      };
    }
    
    products = await prisma.product.findMany({
      where: whereClause,
      include: includeClause
    });
    
    res.json(products);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({ error: 'Failed to fetch products by category' });
  }
});

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

module.exports = router;
