const asyncHandler = require("express-async-handler");
const Order = require("../models/Order");
const { isValidObjectId, sanitizeInput } = require("../utils/validation");

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    console.log("Creating order for user:", req.user._id);
    console.log("Order data:", {
      orderItemsCount: orderItems?.length,
      shippingAddress,
      paymentMethod,
      totalPrice
    });

    if (!orderItems || orderItems.length === 0) {
      res.status(400);
      throw new Error("No order items");
    } else {
      const order = new Order({
        orderItems,
        user: req.user._id,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      });

      const createdOrder = await order.save();

      // Update product stocks
      const Product = require("../models/Product");
      for (const item of orderItems) {
        await Product.updateOne(
          { _id: item.product },
          { $inc: { countInStock: -item.qty } }
        );
      }

      console.log("Order created successfully:", createdOrder._id);
      res.status(201).json(createdOrder);
    }
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(400); // Ensure client gets 400
    throw error;
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  // Validate order ID to prevent NoSQL injection
  if (!isValidObjectId(req.params.id)) {
    res.status(400);
    throw new Error("Invalid order ID");
  }

  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  // Validate order ID to prevent NoSQL injection
  if (!isValidObjectId(req.params.id)) {
    res.status(400);
    throw new Error("Invalid order ID");
  }

  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: sanitizeInput(req.body.id),
      status: sanitizeInput(req.body.status),
      update_time: sanitizeInput(req.body.update_time),
      email_address: sanitizeInput(req.body.email_address),
    };

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  // Validate order ID to prevent NoSQL injection
  if (!isValidObjectId(req.params.id)) {
    res.status(400);
    throw new Error("Invalid order ID");
  }

  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate("user", "id name")
    .sort({ createdAt: -1 });
  res.json(orders);
});

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private
const deleteOrder = asyncHandler(async (req, res) => {
  // Validate order ID to prevent NoSQL injection
  if (!isValidObjectId(req.params.id)) {
    res.status(400);
    throw new Error("Invalid order ID");
  }

  // Validate user ID
  if (!isValidObjectId(req.user._id)) {
    res.status(400);
    throw new Error("Invalid user ID");
  }

  const order = await Order.findById(req.params.id);

  if (order) {
    // Rule: Admin cannot delete if already delivered (confirmed)
    if (req.user.isAdmin && order.isDelivered) {
      res.status(400);
      throw new Error(
        "L'administrateur ne peut pas supprimer une commande déjà confirmée (livrée)"
      );
    }

    // Rule: Only allow user to delete their own order or admin
    if (
      order.user.toString() !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      res.status(401);
      throw new Error("Non autorisé à supprimer cette commande");
    }

    // Rule: If user tries to delete a delivered order
    if (!req.user.isAdmin && order.isDelivered) {
      res.status(400);
      throw new Error(
        "Cette commande est déjà confirmée. Veuillez contacter le propriétaire pour toute modification ou suppression."
      );
    }

    await order.deleteOne();
    res.json({ message: "Commande supprimée avec succès" });
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

const getOrderSummary = asyncHandler(async (req, res) => {
  const orders = await Order.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        totalSales: { $sum: "$totalPrice" },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const users = await require("../models/User").aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const productsCount = await require("../models/Product").countDocuments();
  const ordersCount = await Order.countDocuments();
  const totalSales = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalSales: { $sum: "$totalPrice" },
      },
    },
  ]);

  res.json({
    dailySales: orders,
    dailyUsers: users,
    productsCount,
    ordersCount,
    totalSales: totalSales.length > 0 ? totalSales[0].totalSales : 0,
  });
});

// @desc    Get orders by user ID
// @route   GET /api/orders/user/:id
// @access  Private/Admin
const getOrdersByUser = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.params.id });
  res.json(orders);
});

module.exports = {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  deleteOrder,
  getOrderSummary,
  getOrdersByUser,
};
