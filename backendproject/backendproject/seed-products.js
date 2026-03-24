/**
 * Seed products into database
 * Run: node seed-products.js
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedProducts() {
  try {
    console.log('🌱 Starting product seed...\n');

    // Define categories
    const categories = [
      {
        name: 'ELECTRONICS',
        products: [
          { name: 'Sony Headphones WH-1000XM4', price: 349.99, rating: 4.8, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80', description: 'Premium noise-cancelling wireless headphones' },
          { name: 'Apple iPad Pro 12.9"', price: 1099.99, rating: 4.9, image: 'https://images.unsplash.com/photo-1611532736546-40f2d5d49a96?w=500&q=80', description: 'Latest iPad Pro with M2 chip' },
          { name: 'Samsung 65" 4K TV', price: 1299.99, rating: 4.7, image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&q=80', description: 'Ultra HD 4K Smart TV' },
          { name: 'Dell XPS 13 Laptop', price: 1499.99, rating: 4.8, image: 'https://images.unsplash.com/photo-1588872657840-790ff3e34cba?w=500&q=80', description: 'Compact high-performance laptop' },
          { name: 'Canon EOS R5 Camera', price: 3899.99, rating: 4.9, image: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=500&q=80', description: 'Professional mirrorless camera' },
          { name: 'Nikon Z9 Camera', price: 5499.99, rating: 4.9, image: 'https://images.unsplash.com/photo-1614008375890-cb53b6c5f8d5?w=500&q=80', description: 'Flagship professional camera' },
          { name: 'DJI Mavic 3 Drone', price: 2199.99, rating: 4.8, image: 'https://images.unsplash.com/photo-1553985294-91ef03e6e5a0?w=500&q=80', description: 'Advanced drone with 4K camera' },
          { name: 'Bose Smart Speaker', price: 399.99, rating: 4.6, image: 'https://images.unsplash.com/photo-1581394838336-acd977479ee7?w=500&q=80', description: 'Premium smart speaker' },
          { name: 'LG OLED 55" TV', price: 1799.99, rating: 4.9, image: 'https://images.unsplash.com/photo-1572286226235-e4582a0af4af?w=500&q=80', description: 'OLED technology with perfect blacks' },
          { name: 'Asus ROG Gaming Laptop', price: 2499.99, rating: 4.8, image: 'https://images.unsplash.com/photo-1589532537941-5bce5a4f1b74?w=500&q=80', description: 'High-end gaming laptop' },
          { name: 'Apple Watch Series 7', price: 429.99, rating: 4.7, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80', description: 'Advanced fitness tracking' },
          { name: 'Microsoft Surface Pro 9', price: 1699.99, rating: 4.7, image: 'https://images.unsplash.com/photo-1642810503372-1c9def163546?w=500&q=80', description: '2-in-1 laptop and tablet' },
          { name: 'Google Pixel 8 Pro', price: 999.99, rating: 4.8, image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80', description: 'Flagship Android smartphone' },
          { name: 'OnePlus 12 Pro', price: 799.99, rating: 4.7, image: 'https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=500&q=80', description: 'Flagship killer smartphone' },
          { name: 'Samsung Galaxy Tab S9', price: 799.99, rating: 4.7, image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&q=80', description: 'Premium Android tablet' },
          { name: 'Razer Blade 14 Gaming Laptop', price: 2299.99, rating: 4.8, image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&q=80', description: 'Compact gaming powerhouse' },
          { name: 'HP Spectre x360 Laptop', price: 1899.99, rating: 4.7, image: 'https://images.unsplash.com/photo-1585394838338-aeb8552a2e84?w=500&q=80', description: 'Convertible ultrabook' },
          { name: 'Lenovo ThinkPad X1', price: 1599.99, rating: 4.7, image: 'https://images.unsplash.com/photo-1588872657840-790ff3e34cba?w=500&q=80', description: 'Business laptop excellence' },
          { name: 'MacBook Pro 16" M3 Max', price: 3499.99, rating: 4.9, image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&q=80', description: 'Professional Apple laptop' },
          { name: 'iMac 27" with M3 Max', price: 3199.99, rating: 4.8, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80', description: 'All-in-one desktop computer' },
          { name: 'LG UltraWide Gaming Monitor', price: 799.99, rating: 4.7, image: 'https://images.unsplash.com/photo-1527328957896-4f53e19175a5?w=500&q=80', description: '38" ultrawide gaming monitor' },
          { name: 'ASUS ProArt Display', price: 1299.99, rating: 4.8, image: 'https://images.unsplash.com/photo-1508884675319-9b13ffb474aa?w=500&q=80', description: 'Professional color-accurate monitor' },
          { name: 'Corsair K95 Mechanical Keyboard', price: 229.99, rating: 4.8, image: 'https://images.unsplash.com/photo-1587829191301-72d660a9b3b3?w=500&q=80', description: 'Premium mechanical gaming keyboard' },
          { name: 'Logitech MX Master 3S Mouse', price: 99.99, rating: 4.8, image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&q=80', description: 'Professional productivity mouse' },
          { name: 'Keychron K8 Pro Keyboard', price: 159.99, rating: 4.7, image: 'https://images.unsplash.com/photo-1587829191301-72d660a9b3b3?w=500&q=80', description: 'Wireless mechanical keyboard' }
        ]
      },
      {
        name: 'MOBANDACCESS',
        products: [
          { name: 'iPhone 15 Pro Max', price: 1199.99, rating: 4.9, image: 'https://images.unsplash.com/photo-1592286927505-1fed5dab97c5?w=500&q=80', description: 'Latest Apple flagship phone' },
          { name: 'Samsung Galaxy S24 Ultra', price: 1299.99, rating: 4.9, image: 'https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=500&q=80', description: 'Ultimate Android phone' },
          { name: 'OtterBox Defender Case', price: 49.99, rating: 4.8, image: 'https://images.unsplash.com/photo-1589532537941-5bce5a4f1b74?w=500&q=80', description: 'Heavy-duty phone protection' },
          { name: 'Spigen Ultra Hybrid Case', price: 19.99, rating: 4.7, image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80', description: 'Slim protective phone case' },
          { name: 'Anker PowerCore 20000 Battery', price: 39.99, rating: 4.8, image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&q=80', description: '20000mAh portable power bank' },
          { name: 'Belkin Wireless Car Mount', price: 49.99, rating: 4.6, image: 'https://images.unsplash.com/photo-1610137277996-72c2c3b2dc2c?w=500&q=80', description: 'MagSafe car phone holder' },
          { name: 'Apple AirPods Pro 2', price: 249.99, rating: 4.8, image: 'https://images.unsplash.com/photo-1606376795612-96e5ae63fe63?w=500&q=80', description: 'Premium wireless earbuds' },
          { name: 'Samsung Galaxy Buds 3', price: 179.99, rating: 4.7, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80', description: 'Wireless earbuds with ANC' },
          { name: 'Jabra Elite 85t Earbuds', price: 229.99, rating: 4.7, image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&q=80', description: 'Professional-grade earbuds' },
          { name: 'Google Pixel Buds Pro', price: 199.99, rating: 4.6, image: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=500&q=80', description: 'Google AI-powered earbuds' },
          { name: 'Anker Soundcore Space A40', price: 99.99, rating: 4.5, image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&q=80', description: 'Budget-friendly ANC earbuds' },
          { name: 'Nothing Ear (a) Buds', price: 99.99, rating: 4.6, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80', description: 'Transparent design earbuds' },
          { name: 'Xiaomi 14 Ultra', price: 1199.99, rating: 4.8, image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80', description: 'Premium smartphone camera' },
          { name: 'OnePlus 12', price: 799.99, rating: 4.7, image: 'https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=500&q=80', description: 'Fast flagship killer' },
          { name: 'Google Pixel 8', price: 799.99, rating: 4.8, image: 'https://images.unsplash.com/photo-1592286927505-1fed5dab97c5?w=500&q=80', description: 'Computational photography phone' },
          { name: 'Samsung Galaxy A54', price: 449.99, rating: 4.6, image: 'https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=500&q=80', description: 'Mid-range Samsung phone' },
          { name: 'Motorola Edge 50 Pro', price: 599.99, rating: 4.6, image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80', description: 'Motorola flagship phone' },
          { name: 'Realme GT 6 Pro', price: 699.99, rating: 4.6, image: 'https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=500&q=80', description: 'Fast performance phone' },
          { name: 'Nothing Phone (2)', price: 799.99, rating: 4.6, image: 'https://images.unsplash.com/photo-1592286927505-1fed5dab97c5?w=500&q=80', description: 'Transparent design smartphone' },
          { name: 'Fairphone 5', price: 649.99, rating: 4.5, image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80', description: 'Sustainable modular phone' },
          { name: 'Spigen Glass Screen Protector', price: 9.99, rating: 4.7, image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&q=80', description: 'Tempered glass screen protection' },
          { name: 'ESR Magnetic Phone Mount', price: 19.99, rating: 4.6, image: 'https://images.unsplash.com/photo-1610137277996-72c2c3b2dc2c?w=500&q=80', description: 'Magnetic car dashboard mount' },
          { name: 'Nillkin Clear Case', price: 12.99, rating: 4.5, image: 'https://images.unsplash.com/photo-1589532537941-5bce5a4f1b74?w=500&q=80', description: 'Crystal clear phone case' },
          { name: 'Mophie Juice Pack Wireless Charger', price: 79.99, rating: 4.6, image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&q=80', description: 'Wireless charging case' },
          { name: 'Anker Nano Charger USB-C', price: 29.99, rating: 4.8, image: 'https://images.unsplash.com/photo-1609107768357-87bc3e61d17b?w=500&q=80', description: 'Fast USB-C charger' }
        ]
      }
    ];

    let totalProducts = 0;

    for (const category of categories) {
      console.log(`📁 Processing category: ${category.name}`);

      // Find or create category
      let dbCategory = await prisma.category.findFirst({
        where: { name: category.name }
      });

      if (!dbCategory) {
        dbCategory = await prisma.category.create({
          data: { name: category.name }
        });
        console.log(`   ✅ Created category: ${category.name}`);
      } else {
        console.log(`   ℹ️  Category already exists: ${category.name}`);
      }

      // Create products
      for (const productData of category.products) {
        try {
          const product = await prisma.product.create({
            data: {
              name: productData.name,
              price: productData.price,
              rating: productData.rating,
              image: productData.image,
              description: productData.description,
              stock: Math.floor(Math.random() * 100) + 10, // Random stock 10-110
              categoryId: dbCategory.id
            }
          });
          console.log(`   ✅ Created: ${productData.name}`);
          totalProducts++;
        } catch (error) {
          if (error.code === 'P2002') {
            console.log(`   ⏭️  Skipped: ${productData.name} (already exists)`);
          } else {
            console.error(`   ❌ Error creating ${productData.name}:`, error.message);
          }
        }
      }
      console.log();
    }

    console.log(`\n🎉 Seed completed!`);
    console.log(`📊 Total products created/updated: ${totalProducts}`);
    console.log(`\n✅ Your database is now populated with sample data!`);

  } catch (error) {
    console.error('❌ Seed error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedProducts();
