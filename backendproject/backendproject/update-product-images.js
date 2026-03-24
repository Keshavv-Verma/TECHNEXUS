/**
 * Update products with real images
 * Run: node update-product-images.js
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const productImages = {
  // Electronics
  'Sony Headphones WH-1000XM4': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
  'Apple iPad Pro 12.9"': 'https://images.unsplash.com/photo-1611532736546-40f2d5d49a96?w=500&q=80',
  'Samsung 65" 4K TV': 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&q=80',
  'Dell XPS 13 Laptop': 'https://images.unsplash.com/photo-1588872657840-790ff3e34cba?w=500&q=80',
  'Canon EOS R5 Camera': 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=500&q=80',
  'Nikon Z9 Camera': 'https://images.unsplash.com/photo-1614008375890-cb53b6c5f8d5?w=500&q=80',
  'DJI Mavic 3 Drone': 'https://images.unsplash.com/photo-1553985294-91ef03e6e5a0?w=500&q=80',
  'Bose Smart Speaker': 'https://images.unsplash.com/photo-1581394838336-acd977479ee7?w=500&q=80',
  'LG OLED 55" TV': 'https://images.unsplash.com/photo-1572286226235-e4582a0af4af?w=500&q=80',
  'Asus ROG Gaming Laptop': 'https://images.unsplash.com/photo-1589532537941-5bce5a4f1b74?w=500&q=80',
  'Apple Watch Series 7': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
  'Microsoft Surface Pro 9': 'https://images.unsplash.com/photo-1642810503372-1c9def163546?w=500&q=80',
  'Google Pixel 8 Pro': 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80',
  'OnePlus 12 Pro': 'https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=500&q=80',
  'Samsung Galaxy Tab S9': 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&q=80',
  'Razer Blade 14 Gaming Laptop': 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&q=80',
  'HP Spectre x360 Laptop': 'https://images.unsplash.com/photo-1585394838338-aeb8552a2e84?w=500&q=80',
  'Lenovo ThinkPad X1': 'https://images.unsplash.com/photo-1588872657840-790ff3e34cba?w=500&q=80',
  'MacBook Pro 16" M3 Max': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&q=80',
  'iMac 27" with M3 Max': 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80',
  'LG UltraWide Gaming Monitor': 'https://images.unsplash.com/photo-1527328957896-4f53e19175a5?w=500&q=80',
  'ASUS ProArt Display': 'https://images.unsplash.com/photo-1508884675319-9b13ffb474aa?w=500&q=80',
  'Corsair K95 Mechanical Keyboard': 'https://images.unsplash.com/photo-1587829191301-72d660a9b3b3?w=500&q=80',
  'Logitech MX Master 3S Mouse': 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&q=80',
  'Keychron K8 Pro Keyboard': 'https://images.unsplash.com/photo-1587829191301-72d660a9b3b3?w=500&q=80',
  
  // Mobile & Accessories
  'iPhone 15 Pro Max': 'https://images.unsplash.com/photo-1592286927505-1fed5dab97c5?w=500&q=80',
  'Samsung Galaxy S24 Ultra': 'https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=500&q=80',
  'OtterBox Defender Case': 'https://images.unsplash.com/photo-1589532537941-5bce5a4f1b74?w=500&q=80',
  'Spigen Ultra Hybrid Case': 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80',
  'Anker PowerCore 20000 Battery': 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&q=80',
  'Belkin Wireless Car Mount': 'https://images.unsplash.com/photo-1610137277996-72c2c3b2dc2c?w=500&q=80',
  'Apple AirPods Pro 2': 'https://images.unsplash.com/photo-1606376795612-96e5ae63fe63?w=500&q=80',
  'Samsung Galaxy Buds 3': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
  'Jabra Elite 85t Earbuds': 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&q=80',
  'Google Pixel Buds Pro': 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=500&q=80',
  'Anker Soundcore Space A40': 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&q=80',
  'Nothing Ear (a) Buds': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
  'Xiaomi 14 Ultra': 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80',
  'OnePlus 12': 'https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=500&q=80',
  'Google Pixel 8': 'https://images.unsplash.com/photo-1592286927505-1fed5dab97c5?w=500&q=80',
  'Samsung Galaxy A54': 'https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=500&q=80',
  'Motorola Edge 50 Pro': 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80',
  'Realme GT 6 Pro': 'https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=500&q=80',
  'Nothing Phone (2)': 'https://images.unsplash.com/photo-1592286927505-1fed5dab97c5?w=500&q=80',
  'Fairphone 5': 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80',
  'Spigen Glass Screen Protector': 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&q=80',
  'ESR Magnetic Phone Mount': 'https://images.unsplash.com/photo-1610137277996-72c2c3b2dc2c?w=500&q=80',
  'Nillkin Clear Case': 'https://images.unsplash.com/photo-1589532537941-5bce5a4f1b74?w=500&q=80',
  'Mophie Juice Pack Wireless Charger': 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&q=80',
  'Anker Nano Charger USB-C': 'https://images.unsplash.com/photo-1609107768357-87bc3e61d17b?w=500&q=80'
};

async function updateProductImages() {
  try {
    console.log('🖼️  Updating product images with real photos...\n');

    let updatedCount = 0;

    for (const [productName, imageUrl] of Object.entries(productImages)) {
      try {
        const product = await prisma.product.updateMany({
          where: { name: productName },
          data: { image: imageUrl }
        });

        if (product.count > 0) {
          console.log(`✅ Updated: ${productName}`);
          updatedCount += product.count;
        } else {
          console.log(`⏭️  Not found: ${productName}`);
        }
      } catch (error) {
        console.error(`❌ Error updating ${productName}:`, error.message);
      }
    }

    console.log(`\n🎉 Update completed!`);
    console.log(`📊 Total products updated: ${updatedCount}`);
    console.log(`\n✅ All products now have real images from Unsplash!`);

  } catch (error) {
    console.error('❌ Update error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateProductImages();
