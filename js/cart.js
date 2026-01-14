// ================================
// Load / Save Cart (LocalStorage)
// ================================

export const getCart = () => {
  const cart = localStorage.getItem("cart");
  return cart ? JSON.parse(cart) : [];
};

export const saveCart = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

// ================================
// ADD TO CART
// ================================

export const addToCart = (product) => {
  const cart = getCart();

  const existing = cart.find((item) => item.id === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: String(product.id),
      title: product.title,
      price: Number(product.price),
      quantity: 1,
      image: product.image,
    });
  }
  Swal.fire({
    title: "Product Added to Cart!",
    icon: "success",
    toast: true,
    position: "top",
    showConfirmButton: false,
    timer: 2000,
    theme: 'dark',
  });

  saveCart(cart);
  updateCartCount();
  renderCartDropdown();
};

// ================================
// UPDATE TOP CART COUNT
// ================================

export const updateCartCount = () => {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  const qtyEl = document.querySelector("#cart-qty");
  if (qtyEl) qtyEl.textContent = count;
};

// ================================
// REMOVE FROM CART
// ================================

export const removeFromCart = (id) => {
  const cart = getCart();

  const newCart = cart.filter((item) => item.id !== String(id));

  saveCart(newCart);
  updateCartCount();
  renderCartDropdown();

};

// ================================
// RENDER DROPDOWN UI
// ================================

export const renderCartDropdown = () => {
  const cart = getCart();

  const cartList = document.querySelector(".cart-list");
  const cartSummary = document.querySelector(".cart-summary");

  if (!cartList || !cartSummary) return;

  cartList.innerHTML = "";

  let subtotal = 0;

  cart.forEach((item) => {
    subtotal += item.price * item.quantity;

    const productHtml = `
      <div class="product-widget" >
        <div class="product-img">
          <img src="${item.image}" alt="${item.title}" />
        </div>

        <div class="product-body">
          <h3 class="product-name">
            <a >${item.title}</a>
          </h3>
          <h4 class="product-price">
            <span class="qty">${item.quantity}x</span> Rs.${item.price}
          </h4>
        </div>

        <button class="delete remove-cart-item" data-id="${item.id}">
          <i class="fa fa-close"></i>
        </button>
      </div>
    `;

    cartList.insertAdjacentHTML("beforeend", productHtml);
  });

  cartSummary.innerHTML = `
    <small>${cart.length} Item(s) selected</small>
    <h5>SUBTOTAL: Rs. ${subtotal}</h5>
  `;
};

const cartList = document.querySelector(".cart-list");
cartList.addEventListener("click", (e) => {
  const deleteBtn = e.target.closest(".remove-cart-item");
  if (!deleteBtn) return;

  const id = deleteBtn.dataset.id;
  removeFromCart(id);
});

renderCartDropdown();
updateCartCount();
