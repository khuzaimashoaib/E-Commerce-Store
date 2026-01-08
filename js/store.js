import { fetchProducts, fetchUniqueCategories, fetchUniqueBrands } from "./db.js";
import { addToCart } from "./cart.js";

const productsList = document.getElementById("products-list");
let allProducts = [];
let availableCategories = [];
let availableBrands = [];

// Filter state
const filterState = {
  categories: [],
  brands: [],
 
};

// Fetch all products and available filters on load
const loadProducts = async () => {
  const products = await fetchProducts("products");
  allProducts = products || [];
  
  availableCategories = await fetchUniqueCategories();
  availableBrands = await fetchUniqueBrands();
  
  renderCategoryFilters();
  renderBrandFilters();
  setupCategoryFilters();
  setupBrandFilters();
  setupClearFiltersButton();
  // Initialize filters and render products
  applyFilters();
};

// Dynamically render category filters
const renderCategoryFilters = () => {
  // Find the Categories aside widget by checking the text content
  const asideWidgets = document.querySelectorAll("#aside .aside");
  let categoryFilterDiv = null;
  
  asideWidgets.forEach((widget) => {
    if (widget.querySelector(".aside-title")?.textContent.includes("Categories")) {
      categoryFilterDiv = widget.querySelector(".checkbox-filter");
    }
  });
  
  if (!categoryFilterDiv) return;
  
  categoryFilterDiv.innerHTML = "";
  
  availableCategories.forEach((category, index) => {
    const categoryHTML = `
      <div class="input-checkbox">
        <input type="checkbox" id="category-${index + 1}" data-category="${category}" />
        <label for="category-${index + 1}">
          <span></span>
          ${category}
        </label>
      </div>
    `;
    categoryFilterDiv.insertAdjacentHTML("beforeend", categoryHTML);
  });
};

// Dynamically render brand filters
const renderBrandFilters = () => {
  // Find the Brand aside widget by checking the text content
  const asideWidgets = document.querySelectorAll("#aside .aside");
  let brandFilterDiv = null;
  
  asideWidgets.forEach((widget) => {
    if (widget.querySelector(".aside-title")?.textContent.includes("Brand")) {
      brandFilterDiv = widget.querySelector(".checkbox-filter");
    }
  });
  
  if (!brandFilterDiv) return;
  
  brandFilterDiv.innerHTML = "";
  
  availableBrands.forEach((brand, index) => {
    const brandHTML = `
      <div class="input-checkbox">
        <input type="checkbox" id="brand-${index + 1}" data-brand="${brand}" />
        <label for="brand-${index + 1}">
          <span></span>
          ${brand}
        </label>
      </div>
    `;
    brandFilterDiv.insertAdjacentHTML("beforeend", brandHTML);
  });
};

// Display products based on current filters
const displayProducts = (products) => {
  productsList.innerHTML = "";
  
  if (products.length === 0) {
    productsList.innerHTML = "<p>No products found matching your filters.</p>";
    return;
  }

  products.forEach((product) => {
    const old_price = (product.price * 1.25).toFixed(0);

    const productItem = `
      <div class="col-md-4 col-xs-6">
        <div class="product" data-id="${product.id}" data-category="${product.category}" data-brand="${product.brand}" data-price="${product.price}">
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

// Apply all active filters
const applyFilters = () => {
  let filtered = allProducts;

  // Filter by categories
  if (filterState.categories.length > 0) {
    filtered = filtered.filter((product) =>
      filterState.categories.includes(product.category)
    );
  }

  // Filter by brands
  if (filterState.brands.length > 0) {
    filtered = filtered.filter((product) =>
      filterState.brands.includes(product.brand)
    );
  }

  displayProducts(filtered);
};

// Setup category filter listeners
const setupCategoryFilters = () => {
  const categoryCheckboxes = document.querySelectorAll(
    "#aside input[id^='category-'][data-category]"
  );
  categoryCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      const categoryName = checkbox.dataset.category;

      if (checkbox.checked) {
        if (!filterState.categories.includes(categoryName)) {
          filterState.categories.push(categoryName);
        }
      } else {
        filterState.categories = filterState.categories.filter(
          (cat) => cat !== categoryName
        );
      }
      applyFilters();
    });
  });
};

// Setup brand filter listeners
const setupBrandFilters = () => {
  const brandCheckboxes = document.querySelectorAll(
    "#aside input[id^='brand-'][data-brand]"
  );
  brandCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      const brandName = checkbox.dataset.brand;

      if (checkbox.checked) {
        if (!filterState.brands.includes(brandName)) {
          filterState.brands.push(brandName);
        }
      } else {
        filterState.brands = filterState.brands.filter(
          (brand) => brand !== brandName
        );
      }
      applyFilters();
    });
  });
};

// Clear all filters
const clearFilters = () => {
  // Reset filterState
  filterState.categories = [];
  filterState.brands = [];

  // Uncheck all category checkboxes
  const categoryCheckboxes = document.querySelectorAll(
    "#aside input[id^='category-'][data-category]"
  );
  categoryCheckboxes.forEach((checkbox) => {
    checkbox.checked = false;
  });

  // Uncheck all brand checkboxes
  const brandCheckboxes = document.querySelectorAll(
    "#aside input[id^='brand-'][data-brand]"
  );
  brandCheckboxes.forEach((checkbox) => {
    checkbox.checked = false;
  });

  // Re-apply filters to show all products
  applyFilters();
};

// Setup clear filters button
const setupClearFiltersButton = () => {
  const clearButton = document.getElementById("clear-filters");
  if (clearButton) {
    clearButton.addEventListener("click", clearFilters);
  }
};

// Add to cart functionality
productsList.addEventListener("click", (e) => {
  const btn = e.target.closest(".add-to-cart-btn");
  if (!btn) return;

  const card = btn.closest(".product");

  const product = {
    id: card.dataset.id,
    title: card.querySelector(".product-name a").textContent,
    price: parseFloat(card.dataset.price),
    image: card.querySelector("img").src,
  };

  addToCart(product);
});

// Initialize
const init = async () => {
  await loadProducts();
};

init();

