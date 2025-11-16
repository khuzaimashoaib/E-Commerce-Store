import { fetchProducts } from "./db.js";
import { addToCart } from "./cart.js";

const productsList = document.getElementById("products-list");

const loadProducts = async () => {
  const products = await fetchProducts("products");

  productsList.innerHTML = "";
  products.forEach((product) => {
    const old_price = (product.price * 1.25).toFixed(0);

    const productItem = `
      <div class="col-md-4 col-xs-6">
        <div class="product" data-id="${product.id}">
          <div class="product-img">
            <img src="${
              product.images_urls[0] || "../img/placeholder.png"
            }" alt="${product.title}">
            <div class="product-label">
						<span class="sale">-25%</span>					
				</div>
          </div>
          <div class="product-body">
            <p class="product-category">${product.category || "Category"}</p>
            <h3 class="product-name"><a href="#">${product.title}</a></h3>
            <h4 class="product-price">Rs. ${product.price.toFixed(2)} 
              ${`<del class="product-old-price">Rs. ${old_price}</del>`}
            </h4>
           <div class="product-rating">
  ${"<i class='fa fa-star-o'></i>".repeat(5)}
</div>
            <div class="product-btns">
              <button class="add-to-wishlist"><i class="fa fa-heart-o"></i></button>
              <button class="add-to-compare"><i class="fa fa-exchange"></i></button>
              <button class="quick-view"><i class="fa fa-eye"></i></button>
            </div>
          </div>
          <div class="add-to-cart">
            <button class="add-to-cart-btn"><i class="fa fa-shopping-cart"></i> add to cart</button>
          </div>
        </div>
      </div>
    `;
    productsList.insertAdjacentHTML("beforeend", productItem);
  });
};

productsList.addEventListener("click", (e) => {
  const btn = e.target.closest(".add-to-cart-btn");
  if (!btn) return;

  const card = btn.closest(".product");

  const product = {
    id: card.dataset.id,
    title: card.querySelector(".product-name a").textContent,
    price: parseFloat(
      card.querySelector(".product-price").textContent.replace("Rs. ", "")
    ),
    image: card.querySelector("img").src,
  };

  addToCart(product);
});

loadProducts();

