const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting data migration from MongoDB to PostgreSQL...');

  // First, create users from MongoDB data
  const users = [
    {
      name: "Keshav Verma",
      email: "keshav0462.be23@chitkara.edu.in",
      password: "12345678",
      isAdmin: false,
      createdAt: new Date("2025-05-13T12:24:54.225Z")
    },
    {
      name: "Keshav",
      email: "gopesh0252.be23@chitkara.edu.in",
      password: "12345678",
      isAdmin: false,
      createdAt: new Date("2025-05-13T12:58:58.495Z")
    },
    {
      name: "Keshav ",
      email: "abhiney0178.be23@chitkara.edu.in",
      password: "12345678",
      isAdmin: false,
      createdAt: new Date("2025-05-13T13:00:19.810Z")
    },
    {
      name: "Mridul dhamija ",
      email: "dhamijamridul@gmail.com",
      password: "123456",
      isAdmin: false,
      createdAt: new Date("2025-09-22T09:32:14.320Z")
    },
    {
      name: "Keshav",
      email: "jsnadj@klfm.com",
      password: "123456",
      isAdmin: false,
      createdAt: new Date("2025-09-22T10:11:57.842Z")
    },
    {
      name: "Harsh",
      email: "harsh@gmail.com",
      password: "harsh@34",
      isAdmin: false,
      createdAt: new Date("2025-09-22T11:19:46.455Z")
    }
  ];

  console.log('👤 Creating users...');
  for (const userData of users) {
    try {
      const user = await prisma.user.upsert({
        where: { email: userData.email },
        update: {},
        create: userData
      });
      console.log(`✅ Created user: ${user.name} (${user.email})`);
    } catch (error) {
      console.error(`❌ Error creating user: ${userData.name}`, error.message);
    }
  }

  // Create categories if they don't exist
  const categories = [
    { name: 'MOBILE_ACCESSORIES', description: 'Mobile phones and accessories' },
    { name: 'MOBILE', description: 'Mobile phones and devices' },
    { name: 'ELECTRONICS', description: 'Electronic devices and gadgets' }
  ];

  console.log('📁 Creating categories...');
  for (const categoryData of categories) {
    await prisma.category.upsert({
      where: { name: categoryData.name },
      update: {},
      create: categoryData
    });
  }

  // Get category IDs for products
  const mobileCategory = await prisma.category.findUnique({
    where: { name: 'MOBILE_ACCESSORIES' }
  });
  const mobileSimpleCategory = await prisma.category.findUnique({
    where: { name: 'MOBILE' }
  });
  const electronicsCategory = await prisma.category.findUnique({
    where: { name: 'ELECTRONICS' }
  });

  // Product data from your MongoDB
  const products = [
    {
      name: "Samsung Galaxy M14 5G (ICY Silver, 6GB, 128GB Storage)",
      price: 14990,
      rating: 4,
      image: "https://m.media-amazon.com/images/I/81ZSn2rk9WL.AC_UY327_FMwebp_QL65.jpg",
      categoryId: mobileCategory.id,
      subcategory: "Smartphone",
      description: "A powerful 5G smartphone with excellent performance.",
      stock: 50,
      createdAt: new Date("2025-04-18T12:00:00Z")
    },
    {
      name: "Zebronics Zeb-Transformer-M Wireless Keyboard Mouse Combo",
      price: 1099,
      rating: 4,
      image: "https://m.media-amazon.com/images/I/61KZWPeNgHL.AC_UL480_FMwebp_QL65.jpg",
      categoryId: electronicsCategory.id,
      subcategory: "Keyboard & Mouse",
      description: "Wireless keyboard and mouse combo for work and gaming.",
      stock: 32,
      createdAt: new Date("2024-12-10T09:30:00Z")
    },
    {
      name: "Sounce Study from Home Kit with Webcam",
      price: 259,
      rating: 3,
      image: "https://m.media-amazon.com/images/I/61+XjHbWrZL.AC_UL480_FMwebp_QL65.jpg",
      categoryId: electronicsCategory.id,
      subcategory: "Webcam Kit",
      description: "Basic home setup kit for online learning.",
      stock: 87,
      createdAt: new Date("2024-12-27T10:20:00Z")
    },
    {
      name: "Redmi 12C (Matte Black, 4GB RAM, 64GB Storage)",
      price: 8499,
      rating: 4,
      image: "https://m.media-amazon.com/images/I/81YEyQqHjPL.AC_UY327_FMwebp_QL65.jpg",
      categoryId: mobileCategory.id,
      subcategory: "Smartphone",
      description: "Affordable smartphone with essential features.",
      stock: 60,
      createdAt: new Date("2025-04-18T14:00:00Z")
    },
    {
      name: "OnePlus Nord CE 3 Lite 5G (Pastel Lime, 8GB RAM, 128GB Storage)",
      price: 19999,
      rating: 4,
      image: "https://m.media-amazon.com/images/I/61QRgOgBx0L.AC_UY327_FMwebp_QL65.jpg",
      categoryId: mobileCategory.id,
      subcategory: "Smartphone",
      description: "The OnePlus Nord CE 3 Lite offers a smooth 5G experience.",
      stock: 30,
      createdAt: new Date("2025-04-18T12:30:00Z")
    },
    {
      name: "iQOO Z7s 5G by vivo (Norway Blue, 8GB RAM, 128GB Storage)",
      price: 18999,
      rating: 4,
      image: "https://m.media-amazon.com/images/I/61JS7lF2aqL.AC_UY327_FMwebp_QL65.jpg",
      categoryId: mobileCategory.id,
      subcategory: "Smartphone",
      description: "A 5G smartphone offering a smooth user experience.",
      stock: 25,
      createdAt: new Date("2025-04-18T13:30:00Z")
    },
    {
      name: "I Phone 13 Pro max",
      price: 94995,
      rating: 4,
      image: "https://www.google.com/imgres?q=iphone%2013%20pro%20max&imgurl=https%3",
      categoryId: mobileSimpleCategory.id,
      subcategory: "Smartphone",
      description: "IPhone",
      stock: 0,
      createdAt: new Date("2025-05-13T02:55:24.363Z")
    },
    {
      name: "pc",
      price: 100000,
      rating: 4,
      image: "https://m.media-amazon.com/images/I/61-XXPIOivL._AC_UF1000,1000_QL80_.jpg",
      categoryId: mobileSimpleCategory.id,
      subcategory: "Computer",
      description: "pc",
      stock: 0,
      createdAt: new Date("2025-05-13T06:24:31.500Z")
    },
    {
      name: "PC",
      price: 1000000,
      rating: 4,
      image: "https://media.istockphoto.com/id/506040816/photo/modern-desktop-pc-wit",
      categoryId: electronicsCategory.id,
      subcategory: "Computer",
      description: "pc",
      stock: 0,
      createdAt: new Date("2025-05-13T16:27:45.373Z")
    }
  ];

  console.log('📱 Creating products...');
  for (const productData of products) {
    try {
      const product = await prisma.product.create({
        data: productData,
        include: {
          category: true
        }
      });
      console.log(`✅ Created: ${product.name}`);
    } catch (error) {
      console.error(`❌ Error creating product: ${productData.name}`, error.message);
    }
  }

  // Add some sample specifications for products
  console.log('🔧 Adding product specifications...');
  const createdProducts = await prisma.product.findMany();
  
  // Add specifications for smartphones
  const smartphones = createdProducts.filter(p => p.subcategory === 'Smartphone');
  for (const smartphone of smartphones) {
    const specs = [
      { key: 'Display', value: '6.6 inch HD+ Display' },
      { key: 'Processor', value: 'Octa-core processor' },
      { key: 'RAM', value: smartphone.name.includes('6GB') ? '6GB' : smartphone.name.includes('8GB') ? '8GB' : '4GB' },
      { key: 'Storage', value: smartphone.name.includes('128GB') ? '128GB' : '64GB' },
      { key: 'Connectivity', value: smartphone.name.includes('5G') ? '5G' : '4G LTE' }
    ];

    for (const spec of specs) {
      try {
        await prisma.productSpecification.create({
          data: {
            key: spec.key,
            value: spec.value,
            productId: smartphone.id
          }
        });
      } catch (error) {
        // Ignore duplicate key errors
        if (!error.message.includes('unique constraint')) {
          console.error(`Error adding spec for ${smartphone.name}:`, error.message);
        }
      }
    }
  }

  // Add specifications for electronics
  const electronics = createdProducts.filter(p => p.subcategory !== 'Smartphone');
  for (const electronic of electronics) {
    let specs = [];
    
    if (electronic.subcategory === 'Keyboard & Mouse') {
      specs = [
        { key: 'Connectivity', value: 'Wireless 2.4GHz' },
        { key: 'Battery', value: 'AA batteries' },
        { key: 'Compatibility', value: 'Windows, Mac, Linux' },
        { key: 'Range', value: '10 meters' }
      ];
    } else if (electronic.subcategory === 'Webcam Kit') {
      specs = [
        { key: 'Resolution', value: 'HD 720p' },
        { key: 'Connectivity', value: 'USB 2.0' },
        { key: 'Compatibility', value: 'Windows, Mac' },
        { key: 'Frame Rate', value: '30 fps' }
      ];
    }

    for (const spec of specs) {
      try {
        await prisma.productSpecification.create({
          data: {
            key: spec.key,
            value: spec.value,
            productId: electronic.id
          }
        });
      } catch (error) {
        if (!error.message.includes('unique constraint')) {
          console.error(`Error adding spec for ${electronic.name}:`, error.message);
        }
      }
    }
  }

  console.log('🎉 Data migration completed successfully!');
  
  // Display summary
  const totalUsers = await prisma.user.count();
  const totalProducts = await prisma.product.count();
  const totalCategories = await prisma.category.count();
  const totalSpecs = await prisma.productSpecification.count();
  
  console.log(`\n📊 Migration Summary:`);
  console.log(`Users: ${totalUsers}`);
  console.log(`Categories: ${totalCategories}`);
  console.log(`Products: ${totalProducts}`);
  console.log(`Specifications: ${totalSpecs}`);
}

main()
  .catch((e) => {
    console.error('❌ Migration failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });