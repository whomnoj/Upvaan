// Swiper init
var swiper = new Swiper(".mySwiper", {
    loop: true,
    navigation: {
        nextEl: "#next",
        prevEl: "#prev",
    },
});

// Selectors
const cartIcon = document.querySelector('.cart-icon');
const cardTab = document.querySelector('.cart-tab');
const closeBtn = document.querySelector('.close-btn');
const cartList = document.querySelector('.cart-list');   // product section
const cardList = document.querySelector('.card-list');   // cart section
const cartTotal = document.querySelector('.cart-total');
const cartValue = document.querySelector('.cart-value');
const hamburger = document.querySelector('.hamburger');
const mobilMenu = document.querySelector('.mobile-menu');
const bars = document.querySelector('.fa-bars');
const filterButtons = document.querySelectorAll('.filter-btn');
const searchInputt= document.querySelectorAll('searchInput');

// Cart toggle
cartIcon.addEventListener('click', () => cardTab.classList.add('cart-tab-active'));
closeBtn.addEventListener('click', () => cardTab.classList.remove('cart-tab-active'));
hamburger.addEventListener('click',()=> mobilMenu.classList.toggle('mobile-menu-active'));
hamburger.addEventListener('click',()=> bars.classList.toggle('fa-xmark'));

// Data arrays
let productList = [];
let cartProduct = [];

// Update totals
const updateTotals = () => {
    let totalprice = 0;
    let totalQuantity = 0;

    document.querySelectorAll('.item').forEach(item => {
        const quantity = parseInt(item.querySelector('.quantity-value').textContent);
        const price = parseFloat(item.querySelector('.item-total').textContent.replace('$', ''));
        totalprice += price;
        totalQuantity += quantity;
    });

    cartTotal.textContent = `$${totalprice.toFixed(2)}`;
    cartValue.textContent = totalQuantity;
};

// ✅ SHOW PRODUCTS (FIXED)
const showCards = (products) => {

    cartList.innerHTML = ""; // ❌ पहले clear नहीं कर रहे थे

    products.forEach(product => {

        const orderCart = document.createElement('div');
        orderCart.classList.add('order-cart');

        orderCart.innerHTML = `
            <div class="cart-image">
                <img src="${product.image}">
            </div>
            <h4>${product.name}</h4>
            <h4 class="price">${product.price}</h4>
            <a href="#" class="btn cart-btn">Add to cart</a>
        `;

        cartList.appendChild(orderCart); // ✅ सही जगह

        const cardBtn = orderCart.querySelector('.cart-btn');
        cardBtn.addEventListener('click', (e) => {
            e.preventDefault();
            addToCart(product);
        });
    });
};



// 🔥 Search typing
// searchInput.addEventListener('input', applyFilters);
// ✅ FILTER BUTTON (FIXED - पहले गलत जगह लगा रखा था)
// filterButtons.forEach(btn => {
//     btn.addEventListener('click', () => {

//         const category = btn.getAttribute('data-category');

//         let filteredProducts;

//         if (category === 'all') {
//             filteredProducts = productList;
//         } else {
//             filteredProducts = productList.filter(product => product.category === category);
//         }

//         showCards(filteredProducts); // ✅ direct call

//         // active button UI
//         filterButtons.forEach(b => b.classList.remove('active'));
//         btn.classList.add('active');
//     });
// });


const searchInput = document.getElementById('searchInput');



let currentCategory = "all";

// 🔥 Apply filter + search together
const applyFilters = () => {
    let filtered = productList;

    // Category filter
    if (currentCategory !== "all") {
        filtered = filtered.filter(p => p.category === currentCategory);
    }

    // Search filter
    const searchValue = searchInput.value.toLowerCase();
    filtered = filtered.filter(p => p.name.toLowerCase().includes(searchValue));

    // Clear UI
    cartList.innerHTML = "";

    // Show products
    showCards(filtered)  // ✅ correct
};

// 🔥 Button click
filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {

        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        currentCategory = btn.getAttribute('data-category');

        applyFilters();
    });
});


// SEARCH INPUT
searchInput.addEventListener('input', () => {
    applyFilters();
});




// Add to cart
const addToCart = (product) => {

    const existingProduct = cartProduct.find(item => item.id === product.id);
    if (existingProduct) {
        alert('Item already in your cart!');
        return;
    }

    cartProduct.push(product);

    let quantity = 1;
    let price = parseFloat(product.price.replace('$', ''));

    const cardItem = document.createElement('div');
    cardItem.classList.add('item');

    cardItem.innerHTML = `
        <div class="item-image">
            <img src="${product.image}">
        </div>
        <div class="detail">
            <h4>${product.name}</h4>
            <h4 class="item-total">${product.price}</h4>
        </div>
        <div class="flex">
            <a href="#" class="quantity-btn minus">
                <i class="fa-solid fa-minus"></i>
            </a> 
            <h4 class="quantity-value">${quantity}</h4>
            <a href="#" class="quantity-btn plus">
                <i class="fa-solid fa-plus"></i>
            </a>
        </div>
    `;

    cardList.appendChild(cardItem); // ✅ cart me add hoga (pehle galat jagah tha)

    const plusBtn = cardItem.querySelector('.plus');
    const minusBtn = cardItem.querySelector('.minus');
    const quantityValue = cardItem.querySelector('.quantity-value');
    const itemTotal = cardItem.querySelector('.item-total');

    plusBtn.addEventListener('click', (e) => {
        e.preventDefault();
        quantity++;
        quantityValue.textContent = quantity;
        itemTotal.textContent = `$${(price * quantity).toFixed(2)}`;
        updateTotals();
    });

    minusBtn.addEventListener('click', (e) => {
        e.preventDefault();

        if (quantity > 1) {
            quantity--;
            quantityValue.textContent = quantity;
            itemTotal.textContent = `$${(price * quantity).toFixed(2)}`;
        } else {
            cardItem.remove();
            cartProduct = cartProduct.filter(item => item.id !== product.id);
        }

        updateTotals();
    });

    updateTotals();
};


// Init app
const initApp = () => {
    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            productList = data;
            showCards(productList); // ✅ ALL SHOW
        })
        .catch(err => console.error("Error loading products:", err));
};

initApp();
