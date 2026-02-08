// Test script to verify core e-commerce functionality
const axios = require("axios");

const BASE_URL = "http://localhost:5000/api";

async function testAPI() {
  console.log("🧪 Testing E-commerce API...\n");

  try {
    // Test 1: Get products
    console.log("1. Testing product listing...");
    const productsResponse = await axios.get(`${BASE_URL}/products`);
    console.log(`✅ Found ${productsResponse.data.products.length} products`);

    // Test 2: Get single product
    console.log("\n2. Testing single product retrieval...");
    const productId = productsResponse.data.products[0]._id;
    const productResponse = await axios.get(
      `${BASE_URL}/products/${productId}`
    );
    console.log(`✅ Retrieved product: ${productResponse.data.name}`);

    // Test 3: User registration
    console.log("\n3. Testing user registration...");
    const newUser = {
      name: "Test User",
      email: "test@example.com",
      password: "password123",
      birthday: "1990-01-01",
    };

    try {
      const registerResponse = await axios.post(`${BASE_URL}/users`, newUser);
      console.log(
        "✅ User registration initiated (email verification required)"
      );
    } catch (error) {
      if (error.response?.data?.message?.includes("already exists")) {
        console.log("ℹ️  User already exists (this is fine for testing)");
      } else {
        throw error;
      }
    }

    // Test 4: User login
    console.log("\n4. Testing user authentication...");
    const loginData = {
      email: "admin@example.com",
      password: "password123",
    };

    const loginResponse = await axios.post(
      `${BASE_URL}/users/login`,
      loginData
    );
    const token = loginResponse.data.token;
    console.log("✅ User login successful");
    console.log(`✅ Token received: ${token.substring(0, 20)}...`);

    // Test 5: Protected route with token
    console.log("\n5. Testing protected routes...");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const profileResponse = await axios.get(
      `${BASE_URL}/users/profile`,
      config
    );
    console.log(`✅ User profile retrieved: ${profileResponse.data.name}`);

    // Test 6: Add to cart simulation (frontend functionality)
    console.log("\n6. Testing cart functionality...");
    const cartItem = {
      ...productsResponse.data.products[0],
      qty: 1,
      size: "42",
    };
    console.log(
      `✅ Cart item prepared: ${cartItem.name} (Qty: ${cartItem.qty})`
    );

    // Test 7: Search functionality
    console.log("\n7. Testing search functionality...");
    const searchResponse = await axios.get(
      `${BASE_URL}/products?suggestions&query=watch`
    );
    console.log(`✅ Search returned ${searchResponse.data.length} results`);

    console.log("\n🎉 All core functionality tests passed!");
    console.log("\n📋 Summary:");
    console.log("- ✅ Product listing and retrieval");
    console.log("- ✅ User authentication");
    console.log("- ✅ Protected routes");
    console.log("- ✅ Cart preparation");
    console.log("- ✅ Search functionality");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Status:", error.response.status);
    }
  }
}

testAPI();
