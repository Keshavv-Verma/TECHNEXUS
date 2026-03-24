/**
 * Fix category names for products with incorrect categories
 * Run: node fix-categories.js
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixCategories() {
  try {
    console.log('🔧 Starting category fix...\n');

    // Find or create MOBANDACCESS category
    let mobCategory = await prisma.category.findFirst({
      where: { name: 'MOBANDACCESS' }
    });

    if (!mobCategory) {
      mobCategory = await prisma.category.create({
        data: { name: 'MOBANDACCESS' }
      });
      console.log('✅ Created MOBANDACCESS category');
    } else {
      console.log('ℹ️  MOBANDACCESS category already exists');
    }

    // Find MOBILE category (incorrect name)
    const mobileCategory = await prisma.category.findFirst({
      where: { name: 'MOBILE' }
    });

    if (mobileCategory) {
      // Count products with MOBILE category
      const mobileProducts = await prisma.product.findMany({
        where: { categoryId: mobileCategory.id }
      });

      console.log(`\n📊 Found ${mobileProducts.length} products with incorrect 'MOBILE' category`);

      if (mobileProducts.length > 0) {
        // Update all products from MOBILE to MOBANDACCESS
        const updated = await prisma.product.updateMany({
          where: { categoryId: mobileCategory.id },
          data: { categoryId: mobCategory.id }
        });

        console.log(`✅ Updated ${updated.count} products to 'MOBANDACCESS' category`);

        // Delete the old MOBILE category
        await prisma.category.delete({
          where: { id: mobileCategory.id }
        });
        console.log('🗑️  Deleted incorrect MOBILE category');
      }
    } else {
      console.log('ℹ️  No products with incorrect MOBILE category found');
    }

    console.log('\n🎉 Category fix completed!');
    console.log('✅ All products should now appear in the correct category pages');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixCategories();
