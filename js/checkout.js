// ================================
// Import saveOrder from db.js
// ================================

import { saveOrder } from "./db.js";

// ================================
// Get Cart from LocalStorage
// ================================

const getCart = () => {
  const cart = localStorage.getItem("cart");
  return cart ? JSON.parse(cart) : [];
};

// ================================
// Calculate Cart Total
// ================================

const getCartTotal = () => {
  const cart = getCart();
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
};

// ================================
// Render Order Summary on Checkout Page
// ================================

const renderOrderSummary = () => {
  const cart = getCart();
  const orderProductsDiv = document.querySelector(".order-products");
  const orderColTotal = document.querySelector(
    ".order-summary .order-col:last-child"
  );

  if (!orderProductsDiv) return;

  // Clear existing placeholder products
  orderProductsDiv.innerHTML = "";

  // Add cart items to order summary
  let subtotal = 0;

  if (cart.length === 0) {
    orderProductsDiv.innerHTML =
      '<p style="text-align: center; color: #999;">No items in cart</p>';
  } else {
    cart.forEach((item) => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;

      const productHTML = `
        <div class="order-col">
          <div>${item.quantity}x ${item.title}</div>
          <div>Rs. ${itemTotal.toFixed(2)}</div>
        </div>
      `;
      orderProductsDiv.insertAdjacentHTML("beforeend", productHTML);
    });
  }

  // Update shipping and total
  updateOrderTotals(subtotal);
};

// ================================
// Update Order Totals (Shipping & Grand Total)
// ================================

const updateOrderTotals = (subtotal) => {
  const shippingCost = 0; // Free shipping
  const total = subtotal + shippingCost;

  // Find and update the order summary footer (shipping and total)
  const orderSummary = document.querySelector(".order-summary");

  if (orderSummary) {
    // Remove old total rows if they exist
    const oldTotalRows = orderSummary.querySelectorAll(
      ".order-col:not(:first-child):not(:nth-child(2))"
    );
    oldTotalRows.forEach((row) => {
      if (
        row.textContent.includes("Shiping") ||
        row.textContent.includes("TOTAL")
      ) {
        row.remove();
      }
    });

    // Add shipping and total rows
    const shippingHTML = `
      <div class="order-col">
        <div>Shiping</div>
        <div><strong>FREE</strong></div>
      </div>
    `;

    const totalHTML = `
      <div class="order-col">
        <div class="order-total-label"><strong>TOTAL</strong></div>
        <div class="order-total-amount"><strong class="order-total">Rs. ${total.toFixed(
          2
        )}</strong></div>
      </div>
    `;

    orderSummary.insertAdjacentHTML("beforeend", shippingHTML);
    orderSummary.insertAdjacentHTML("beforeend", totalHTML);
  }
};

// ================================
// Initialize on Page Load
// ================================

document.addEventListener("DOMContentLoaded", () => {
  renderOrderSummary();
  setupPlaceOrderButton();
});

// ================================
// Setup Place Order Button
// ================================

const setupPlaceOrderButton = () => {
  const placeOrderBtn = document.querySelector(".order-submit");

  if (!placeOrderBtn) return;

  placeOrderBtn.addEventListener("click", (e) => {
    e.preventDefault();
    handlePlaceOrder();
  });
};

// ================================
// Handle Place Order Submission
// ================================

const handlePlaceOrder = async () => {
  // Get form inputs
  const firstName = document
    .querySelector('input[name="first-name"]')
    ?.value.trim();
  const lastName = document
    .querySelector('input[name="last-name"]')
    ?.value.trim();
  const email = document.querySelector('input[name="email"]')?.value.trim();
  const address = document.querySelector('input[name="address"]')?.value.trim();
  const city = document.querySelector('select[name="city"]')?.value;
  const phone = document.querySelector('input[name="tel"]')?.value.trim();
  const termsChecked = document.querySelector('input[id="terms"]')?.checked;

  // Validation
  if (!firstName || !lastName || !email || !address || !city || !phone) {
    alert("Please fill in all required fields");
    return;
  }

  if (!termsChecked) {
    alert("Please accept the terms & conditions");
    return;
  }

  if (!isValidEmail(email)) {
    alert("Please enter a valid email address");
    return;
  }

  // Check if cart is empty
  const cart = getCart();
  if (cart.length === 0) {
    alert("Your cart is empty. Please add products before placing order");
    return;
  }

  // Prepare order data
  const user_name = `${firstName} ${lastName}`;
  const total_amount = getCartTotal();

  const orderData = {
    user_name,
    user_email: email,
    user_phone: phone,
    shipping_address: address,
    city,
    total_amount,
  };

  // Save order to Supabase
  try {
    const response = await saveOrder(orderData);

    if (response.success) {
      alert("Order placed successfully! Thank you for your purchase.");

      // Clear cart after successful order
      localStorage.removeItem("cart");

      // Reset all form fields individually
      document.querySelector('input[name="first-name"]').value = "";
      document.querySelector('input[name="last-name"]').value = "";
      document.querySelector('input[name="email"]').value = "";
      document.querySelector('input[name="address"]').value = "";
      document.querySelector('select[name="city"]').value = "";
      document.querySelector('input[name="tel"]').value = "";
      document.querySelector('input[id="terms"]').checked = false;

      // Clear order summary
      const orderProductsDiv = document.querySelector(".order-products");
      if (orderProductsDiv) {
        orderProductsDiv.innerHTML =
          '<p style="text-align: center; color: #999;">No items in cart</p>';
      }

      // Update order totals
      updateOrderTotals(0);

      // Update cart count
      const cartQtyElement = document.querySelector("#cart-qty");
      if (cartQtyElement) {
        cartQtyElement.textContent = "0";
      }

      // Redirect to home or show success message
      // window.location.href = "../index.html"; // Uncomment to redirect
    } else {
      alert("Error placing order: " + response.error.message);
    }
  } catch (error) {
    console.error("Order submission error:", error);
    alert("An error occurred while placing your order. Please try again.");
  }
};

// ================================
// Email Validation Helper
// ================================

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
