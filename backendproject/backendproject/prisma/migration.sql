-- Migration Script: MongoDB to PostgreSQL
-- Run this after your Prisma migrations are complete

-- Insert Users from MongoDB
INSERT INTO users (id, name, email, password, "isAdmin", "createdAt", "updatedAt") VALUES 
('user_gopesh_gautam', 'Gopesh Gautam', 'akshit0188.be23@chitkara.edu.in', '12345678', false, '2025-05-13T12:24:54.225Z', NOW()),
('user_gopesh', 'gopesh', 'gopesh0252.be23@chitkara.edu.in', '12345678', false, '2025-05-13T12:58:58.495Z', NOW()),
('user_gopesh_2', 'Gopesh ', 'abhiney0178.be23@chitkara.edu.in', '12345678', false, '2025-05-13T13:00:19.810Z', NOW()),
('user_mridul', 'Mridul dhamija ', 'dhamijamridul@gmail.com', '123456', false, '2025-09-22T09:32:14.320Z', NOW()),
('user_keshav', 'Keshav', 'jsnadj@klfm.com', '123456', false, '2025-09-22T10:11:57.842Z', NOW()),
('user_harsh', 'Harsh', 'harsh@gmail.com', 'harsh@34', false, '2025-09-22T11:19:46.455Z', NOW())
ON CONFLICT (email) DO NOTHING;

-- Insert Categories
INSERT INTO categories (id, name, description, "createdAt", "updatedAt") VALUES 
('cat_mobile_acc', 'MOBILE_ACCESSORIES', 'Mobile phones and accessories', NOW(), NOW()),
('cat_mobile', 'MOBILE', 'Mobile phones and devices', NOW(), NOW()),
('cat_electronics', 'ELECTRONICS', 'Electronic devices and gadgets', NOW(), NOW())
ON CONFLICT (name) DO NOTHING;

-- Insert Products
INSERT INTO products (id, name, description, price, rating, image, subcategory, stock, "categoryId", "createdAt", "updatedAt") VALUES 
(
  'prod_samsung_m14',
  'Samsung Galaxy M14 5G (ICY Silver, 6GB, 128GB Storage)',
  'A powerful 5G smartphone with excellent performance.',
  14990,
  4,
  'https://m.media-amazon.com/images/I/81ZSn2rk9WL.AC_UY327_FMwebp_QL65.jpg',
  'Smartphone',
  50,
  'cat_mobile_acc',
  '2025-04-18T12:00:00Z',
  NOW()
),
(
  'prod_zebronics_combo',
  'Zebronics Zeb-Transformer-M Wireless Keyboard Mouse Combo',
  'Wireless keyboard and mouse combo for work and gaming.',
  1099,
  4,
  'https://m.media-amazon.com/images/I/61KZWPeNgHL.AC_UL480_FMwebp_QL65.jpg',
  'Keyboard & Mouse',
  32,
  'cat_electronics',
  '2024-12-10T09:30:00Z',
  NOW()
),
(
  'prod_sounce_kit',
  'Sounce Study from Home Kit with Webcam',
  'Basic home setup kit for online learning.',
  259,
  3,
  'https://m.media-amazon.com/images/I/61+XjHbWrZL.AC_UL480_FMwebp_QL65.jpg',
  'Webcam Kit',
  87,
  'cat_electronics',
  '2024-12-27T10:20:00Z',
  NOW()
),
(
  'prod_redmi_12c',
  'Redmi 12C (Matte Black, 4GB RAM, 64GB Storage)',
  'Affordable smartphone with essential features.',
  8499,
  4,
  'https://m.media-amazon.com/images/I/81YEyQqHjPL.AC_UY327_FMwebp_QL65.jpg',
  'Smartphone',
  60,
  'cat_mobile_acc',
  '2025-04-18T14:00:00Z',
  NOW()
),
(
  'prod_oneplus_nord',
  'OnePlus Nord CE 3 Lite 5G (Pastel Lime, 8GB RAM, 128GB Storage)',
  'The OnePlus Nord CE 3 Lite offers a smooth 5G experience.',
  19999,
  4,
  'https://m.media-amazon.com/images/I/61QRgOgBx0L.AC_UY327_FMwebp_QL65.jpg',
  'Smartphone',
  30,
  'cat_mobile_acc',
  '2025-04-18T12:30:00Z',
  NOW()
),
(
  'prod_iqoo_z7s',
  'iQOO Z7s 5G by vivo (Norway Blue, 8GB RAM, 128GB Storage)',
  'A 5G smartphone offering a smooth user experience.',
  18999,
  4,
  'https://m.media-amazon.com/images/I/61JS7lF2aqL.AC_UY327_FMwebp_QL65.jpg',
  'Smartphone',
  25,
  'cat_mobile_acc',
  '2025-04-18T13:30:00Z',
  NOW()
),
(
  'prod_iphone_13_pro',
  'I Phone 13 Pro max',
  'IPhone',
  94995,
  4,
  'https://www.google.com/imgres?q=iphone%2013%20pro%20max&imgurl=https%3',
  'Smartphone',
  0,
  'cat_mobile',
  '2025-05-13T02:55:24.363Z',
  NOW()
),
(
  'prod_pc_mobile',
  'pc',
  'pc',
  100000,
  4,
  'https://m.media-amazon.com/images/I/61-XXPIOivL._AC_UF1000,1000_QL80_.jpg',
  'Computer',
  0,
  'cat_mobile',
  '2025-05-13T06:24:31.500Z',
  NOW()
),
(
  'prod_pc_electronics',
  'PC',
  'pc',
  1000000,
  4,
  'https://media.istockphoto.com/id/506040816/photo/modern-desktop-pc-wit',
  'Computer',
  0,
  'cat_electronics',
  '2025-05-13T16:27:45.373Z',
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Insert Product Specifications for Samsung Galaxy M14
INSERT INTO product_specifications (id, key, value, "productId", "createdAt", "updatedAt") VALUES 
('spec_samsung_display', 'Display', '6.6 inch HD+ Display', 'prod_samsung_m14', NOW(), NOW()),
('spec_samsung_processor', 'Processor', 'Octa-core processor', 'prod_samsung_m14', NOW(), NOW()),
('spec_samsung_ram', 'RAM', '6GB', 'prod_samsung_m14', NOW(), NOW()),
('spec_samsung_storage', 'Storage', '128GB', 'prod_samsung_m14', NOW(), NOW()),
('spec_samsung_connectivity', 'Connectivity', '5G', 'prod_samsung_m14', NOW(), NOW())
ON CONFLICT ("productId", key) DO NOTHING;

-- Insert Product Specifications for Redmi 12C
INSERT INTO product_specifications (id, key, value, "productId", "createdAt", "updatedAt") VALUES 
('spec_redmi_display', 'Display', '6.6 inch HD+ Display', 'prod_redmi_12c', NOW(), NOW()),
('spec_redmi_processor', 'Processor', 'Octa-core processor', 'prod_redmi_12c', NOW(), NOW()),
('spec_redmi_ram', 'RAM', '4GB', 'prod_redmi_12c', NOW(), NOW()),
('spec_redmi_storage', 'Storage', '64GB', 'prod_redmi_12c', NOW(), NOW()),
('spec_redmi_connectivity', 'Connectivity', '4G LTE', 'prod_redmi_12c', NOW(), NOW())
ON CONFLICT ("productId", key) DO NOTHING;

-- Insert Product Specifications for OnePlus Nord
INSERT INTO product_specifications (id, key, value, "productId", "createdAt", "updatedAt") VALUES 
('spec_oneplus_display', 'Display', '6.6 inch HD+ Display', 'prod_oneplus_nord', NOW(), NOW()),
('spec_oneplus_processor', 'Processor', 'Octa-core processor', 'prod_oneplus_nord', NOW(), NOW()),
('spec_oneplus_ram', 'RAM', '8GB', 'prod_oneplus_nord', NOW(), NOW()),
('spec_oneplus_storage', 'Storage', '128GB', 'prod_oneplus_nord', NOW(), NOW()),
('spec_oneplus_connectivity', 'Connectivity', '5G', 'prod_oneplus_nord', NOW(), NOW())
ON CONFLICT ("productId", key) DO NOTHING;

-- Insert Product Specifications for Zebronics Combo
INSERT INTO product_specifications (id, key, value, "productId", "createdAt", "updatedAt") VALUES 
('spec_zebronics_connectivity', 'Connectivity', 'Wireless 2.4GHz', 'prod_zebronics_combo', NOW(), NOW()),
('spec_zebronics_battery', 'Battery', 'AA batteries', 'prod_zebronics_combo', NOW(), NOW()),
('spec_zebronics_compatibility', 'Compatibility', 'Windows, Mac, Linux', 'prod_zebronics_combo', NOW(), NOW()),
('spec_zebronics_range', 'Range', '10 meters', 'prod_zebronics_combo', NOW(), NOW())
ON CONFLICT ("productId", key) DO NOTHING;

-- Insert Product Specifications for Sounce Kit
INSERT INTO product_specifications (id, key, value, "productId", "createdAt", "updatedAt") VALUES 
('spec_sounce_resolution', 'Resolution', 'HD 720p', 'prod_sounce_kit', NOW(), NOW()),
('spec_sounce_connectivity', 'Connectivity', 'USB 2.0', 'prod_sounce_kit', NOW(), NOW()),
('spec_sounce_compatibility', 'Compatibility', 'Windows, Mac', 'prod_sounce_kit', NOW(), NOW()),
('spec_sounce_framerate', 'Frame Rate', '30 fps', 'prod_sounce_kit', NOW(), NOW())
ON CONFLICT ("productId", key) DO NOTHING;

-- Verify the data
SELECT 'Users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Categories' as table_name, COUNT(*) as count FROM categories
UNION ALL
SELECT 'Products' as table_name, COUNT(*) as count FROM products  
UNION ALL
SELECT 'Product Specifications' as table_name, COUNT(*) as count FROM product_specifications;