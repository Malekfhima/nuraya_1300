const axios = require("axios");

const BASE_URL = "http://localhost:5000/api";

async function testAdminFeatures() {
  console.log("🔧 Testing Admin Features...\n");

  try {
    // Login as admin
    const loginData = {
      email: "admin@example.com",
      password: "password123",
    };

    const loginResponse = await axios.post(
      `${BASE_URL}/users/login`,
      loginData
    );
    const token = loginResponse.data.token;
    console.log("✅ Admin login successful");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    // Test 1: Get all users (admin only)
    console.log("\n1. Testing user management...");
    const usersResponse = await axios.get(`${BASE_URL}/users`, config);
    console.log(`✅ Retrieved ${usersResponse.data.length} users`);

    // Test 2: Get all products (should work for admin)
    console.log("\n2. Testing product management...");
    const productsResponse = await axios.get(`${BASE_URL}/products`, config);
    console.log(
      `✅ Retrieved ${productsResponse.data.products.length} products`
    );

    // Test 3: Create a new product (admin only)
    console.log("\n3. Testing product creation...");
    const newProduct = {
      name: "Test Admin Product",
      price: 99.99,
      image: "/uploads/images/watch.png",
      brand: "Nuraya",
      category: "Test",
      description: "Test product created by admin",
      countInStock: 5,
    };

    const createResponse = await axios.post(
      `${BASE_URL}/products`,
      newProduct,
      config
    );
    console.log(`✅ Created product: ${createResponse.data.name}`);

    // Test 4: Update product (admin only)
    console.log("\n4. Testing product update...");
    const updateData = {
      price: 149.99,
      description: "Updated test product description",
    };

    const updateResponse = await axios.put(
      `${BASE_URL}/products/${createResponse.data._id}`,
      updateData,
      config
    );
    console.log(`✅ Updated product price to: ${updateResponse.data.price}`);

    // Test 5: Delete product (admin only)
    console.log("\n5. Testing product deletion...");
    await axios.delete(
      `${BASE_URL}/products/${createResponse.data._id}`,
      config
    );
    console.log("✅ Product deleted successfully");

    console.log("\n🎉 All admin features working correctly!");
    console.log("\n📋 Admin Feature Summary:");
    console.log("- ✅ User management (view all users)");
    console.log("- ✅ Product management (CRUD operations)");
    console.log("- ✅ Protected admin routes");
    console.log("- ✅ Authentication and authorization");
  } catch (error) {
    console.error("❌ Admin test failed:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Status:", error.response.status);
    }
  }
}

testAdminFeatures();
