/**
 * SQLite to MySQL Database Migration Script
 * This script exports data from SQLite and imports it into MySQL
 * 
 * Setup steps:
 * 1. Make sure MySQL is running
 * 2. Update DATABASE_URL in .env with your MySQL connection
 * 3. Run: node migrate-to-mysql.js
 */

const { PrismaClient: PrismaClientSqlite } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

async function migrateToMySQL() {
  const sqliteDbPath = path.join(__dirname, 'prisma', 'dev.db');
  
  // Check if SQLite database exists
  if (!fs.existsSync(sqliteDbPath)) {
    console.log('❌ SQLite database not found at:', sqliteDbPath);
    process.exit(1);
  }

  console.log('🔄 Starting SQLite to MySQL migration...\n');
  
  try {
    // Connect to SQLite to export data
    console.log('📖 Reading data from SQLite...');
    
    // Read all data using SQL directly from SQLite file
    const sqlite3 = require('sqlite3').verbose();
    const sqliteDb = new sqlite3.Database(sqliteDbPath);
    
    const exportedData = {
      categories: [],
      users: [],
      products: [],
      cartItems: [],
      orders: [],
      reviews: [],
      specifications: []
    };

    // Helper function to get all rows from a table
    const getAllRows = (tableName) => {
      return new Promise((resolve, reject) => {
        sqliteDb.all(`SELECT * FROM ${tableName}`, (err, rows) => {
          if (err) reject(err);
          else resolve(rows || []);
        });
      });
    };

    try {
      // Export all tables
      console.log('  ⬇️  Exporting Categories...');
      exportedData.categories = await getAllRows('categories');
      console.log(`     ✅ ${exportedData.categories.length} categories exported`);

      console.log('  ⬇️  Exporting Users...');
      exportedData.users = await getAllRows('users');
      console.log(`     ✅ ${exportedData.users.length} users exported`);

      console.log('  ⬇️  Exporting Products...');
      exportedData.products = await getAllRows('products');
      console.log(`     ✅ ${exportedData.products.length} products exported`);

      console.log('  ⬇️  Exporting Cart Items...');
      exportedData.cartItems = await getAllRows('cart_items');
      console.log(`     ✅ ${exportedData.cartItems.length} cart items exported`);

      console.log('  ⬇️  Exporting Orders...');
      exportedData.orders = await getAllRows('orders');
      console.log(`     ✅ ${exportedData.orders.length} orders exported`);

      console.log('  ⬇️  Exporting Reviews...');
      exportedData.reviews = await getAllRows('reviews');
      console.log(`     ✅ ${exportedData.reviews.length} reviews exported`);

      console.log('  ⬇️  Exporting Specifications...');
      exportedData.specifications = await getAllRows('product_specifications');
      console.log(`     ✅ ${exportedData.specifications.length} specifications exported`);

    } finally {
      sqliteDb.close();
    }

    // Save exported data to JSON
    const exportFile = path.join(__dirname, 'migration-data.json');
    fs.writeFileSync(exportFile, JSON.stringify(exportedData, null, 2));
    console.log(`\n✅ Data exported to migration-data.json\n`);

    // Now connect to MySQL and import data
    console.log('📥 Importing data to MySQL...\n');
    
    const prismaMysql = new PrismaClientSqlite();

    try {
      // Import Categories
      if (exportedData.categories.length > 0) {
        console.log('  ⬆️  Importing Categories...');
        for (const category of exportedData.categories) {
          await prismaMysql.category.upsert({
            where: { id: category.id },
            update: { name: category.name },
            create: { id: category.id, name: category.name }
          });
        }
        console.log(`     ✅ ${exportedData.categories.length} categories imported`);
      }

      // Import Users
      if (exportedData.users.length > 0) {
        console.log('  ⬆️  Importing Users...');
        for (const user of exportedData.users) {
          await prismaMysql.user.upsert({
            where: { id: user.id },
            update: {
              name: user.name,
              email: user.email,
              password: user.password,
              isAdmin: Boolean(user.isAdmin)
            },
            create: {
              id: user.id,
              name: user.name,
              email: user.email,
              password: user.password,
              isAdmin: Boolean(user.isAdmin)
            }
          });
        }
        console.log(`     ✅ ${exportedData.users.length} users imported`);
      }

      // Import Products
      if (exportedData.products.length > 0) {
        console.log('  ⬆️  Importing Products...');
        for (const product of exportedData.products) {
          await prismaMysql.product.upsert({
            where: { id: product.id },
            update: {
              name: product.name,
              price: product.price,
              rating: product.rating,
              image: product.image,
              description: product.description,
              stock: product.stock,
              subcategory: product.subcategory,
              categoryId: product.categoryId
            },
            create: {
              id: product.id,
              name: product.name,
              price: product.price,
              rating: product.rating,
              image: product.image,
              description: product.description,
              stock: product.stock,
              subcategory: product.subcategory,
              categoryId: product.categoryId
            }
          });
        }
        console.log(`     ✅ ${exportedData.products.length} products imported`);
      }

      // Import Cart Items
      if (exportedData.cartItems.length > 0) {
        console.log('  ⬆️  Importing Cart Items...');
        for (const item of exportedData.cartItems) {
          await prismaMysql.cartItem.upsert({
            where: { id: item.id },
            update: {
              quantity: item.quantity,
              productId: item.productId,
              userId: item.userId
            },
            create: {
              id: item.id,
              quantity: item.quantity,
              productId: item.productId,
              userId: item.userId
            }
          });
        }
        console.log(`     ✅ ${exportedData.cartItems.length} cart items imported`);
      }

      // Import Orders
      if (exportedData.orders.length > 0) {
        console.log('  ⬆️  Importing Orders...');
        for (const order of exportedData.orders) {
          await prismaMysql.order.upsert({
            where: { id: order.id },
            update: {
              totalAmount: order.totalAmount,
              status: order.status,
              userId: order.userId
            },
            create: {
              id: order.id,
              totalAmount: order.totalAmount,
              status: order.status,
              userId: order.userId
            }
          });
        }
        console.log(`     ✅ ${exportedData.orders.length} orders imported`);
      }

      // Import Reviews
      if (exportedData.reviews.length > 0) {
        console.log('  ⬆️  Importing Reviews...');
        for (const review of exportedData.reviews) {
          await prismaMysql.review.upsert({
            where: { id: review.id },
            update: {
              rating: review.rating,
              comment: review.comment,
              productId: review.productId,
              userId: review.userId
            },
            create: {
              id: review.id,
              rating: review.rating,
              comment: review.comment,
              productId: review.productId,
              userId: review.userId
            }
          });
        }
        console.log(`     ✅ ${exportedData.reviews.length} reviews imported`);
      }

      // Import Specifications
      if (exportedData.specifications.length > 0) {
        console.log('  ⬆️  Importing Specifications...');
        for (const spec of exportedData.specifications) {
          await prismaMysql.productSpecification.upsert({
            where: { id: spec.id },
            update: {
              key: spec.key,
              value: spec.value,
              productId: spec.productId
            },
            create: {
              id: spec.id,
              key: spec.key,
              value: spec.value,
              productId: spec.productId
            }
          });
        }
        console.log(`     ✅ ${exportedData.specifications.length} specifications imported`);
      }

      console.log('\n🎉 Migration completed successfully!');
      console.log('\n📋 Summary:');
      console.log(`   • Categories: ${exportedData.categories.length}`);
      console.log(`   • Users: ${exportedData.users.length}`);
      console.log(`   • Products: ${exportedData.products.length}`);
      console.log(`   • Cart Items: ${exportedData.cartItems.length}`);
      console.log(`   • Orders: ${exportedData.orders.length}`);
      console.log(`   • Reviews: ${exportedData.reviews.length}`);
      console.log(`   • Specifications: ${exportedData.specifications.length}`);
      console.log('\n✅ Your MySQL database is now ready!');

    } finally {
      await prismaMysql.$disconnect();
    }

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

migrateToMySQL();
