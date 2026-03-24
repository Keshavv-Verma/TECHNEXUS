const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function verifyData() {
  console.log('🔍 Verifying migrated data...\n');

  try {
    // Check users
    console.log('👤 USERS:');
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        isAdmin: true,
        createdAt: true
      }
    });
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email}) - Admin: ${user.isAdmin}`);
    });

    // Check categories with product count
    console.log('\n📁 CATEGORIES:');
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      }
    });
    
    categories.forEach((category, index) => {
      console.log(`${index + 1}. ${category.name} - ${category._count.products} products`);
    });

    // Check products with categories and specifications
    console.log('\n📱 PRODUCTS:');
    const products = await prisma.product.findMany({
      include: {
        category: true,
        specifications: true
      }
    });
    
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   Category: ${product.category.name}`);
      console.log(`   Price: ₹${product.price} | Rating: ${product.rating} | Stock: ${product.stock}`);
      console.log(`   Specifications: ${product.specifications.length} items`);
      console.log('');
    });

    // Test authentication (simulate login)
    console.log('🔐 TESTING AUTHENTICATION:');
    const testUser = await prisma.user.findFirst({
      where: {
        email: 'KeshavVerma@gmail.com',
        password: '123456'
      }
    });
    
    if (testUser) {
      console.log(`✅ Login test successful for: ${testUser.name}`);
    } else {
      console.log('❌ Login test failed');
    }

    // Test product search (simulate category search)
    console.log('\n🔍 TESTING PRODUCT SEARCH:');
    const mobileProducts = await prisma.product.findMany({
      where: {
        category: {
          name: {
            contains: 'MOBILE',
            mode: 'insensitive'
          }
        }
      },
      include: {
        category: true
      }
    });
    
    console.log(`Found ${mobileProducts.length} mobile products:`);
    mobileProducts.forEach(product => {
      console.log(`- ${product.name} (₹${product.price})`);
    });

    console.log('\n✅ All data verification completed successfully!');
    console.log('\n📊 SUMMARY:');
    console.log(`Total Users: ${users.length}`);
    console.log(`Total Categories: ${categories.length}`);
    console.log(`Total Products: ${products.length}`);
    console.log(`Total Specifications: ${products.reduce((sum, p) => sum + p.specifications.length, 0)}`);

  } catch (error) {
    console.error('❌ Error during verification:', error);
  }
}

verifyData()
  .finally(async () => {
    await prisma.$disconnect();
  });