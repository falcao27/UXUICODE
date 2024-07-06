// Elementos DOM
const productGrid = document.getElementById('product-grid');
const addProductForm = document.getElementById('add-product-form');
const cartIcon = document.getElementById('cart-icon');
const cartBadge = document.getElementById('cart-badge');
const cartMenu = document.getElementById('cart-menu');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const paymentMethod = document.getElementById('payment-method');
const cashPayment = document.getElementById('cash-payment');
const cashAmount = document.getElementById('cash-amount');
const changeAmount = document.getElementById('change-amount');
const processPayment = document.getElementById('process-payment');
const filterInput = document.createElement('input');

// Estado da aplicação
let products = JSON.parse(localStorage.getItem('products')) || [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Funções auxiliares
function saveProducts() {
    localStorage.setItem('products', JSON.stringify(products));
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
}

function updateCartBadge() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBadge.textContent = totalItems;
}

function formatPrice(price) {
    return price.toFixed(2);
}

// Adicionar filtro de produtos
filterInput.type = 'text';
filterInput.placeholder = 'Filtrar produtos...';
filterInput.className = 'filter-input';
filterInput.addEventListener('input', () => {
    renderProducts(filterInput.value.toLowerCase());
});
document.querySelector('.container').insertBefore(filterInput, productGrid);

// Renderização dos produtos
function renderProducts(filter = '') {
    productGrid.innerHTML = '';
    products.forEach((product, index) => {
        if (product.name.toLowerCase().includes(filter)) {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <h3>${product.name}</h3>
                <p>R$ ${formatPrice(product.price)}</p>
                <div class="product-actions">
                    <button onclick="addToCart(${index})" title="Adicionar ao Carrinho">🛒</button>
                    <button onclick="editProduct(${index})" title="Editar">✏️</button>
                    <button onclick="deleteProduct(${index})" title="Excluir">🗑️</button>
                </div>
            `;
            productGrid.appendChild(productCard);
        }
    });
}

// Adicionar produto
addProductForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('product-name').value;
    const price = parseFloat(document.getElementById('product-price').value);
    products.push({ name, price });
    saveProducts();
    renderProducts();
    addProductForm.reset();
});

// Adicionar ao carrinho
function addToCart(index) {
    const product = products[index];
    const existingItem = cart.find(item => item.name === product.name);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    saveCart();
    renderCart();
    
    // Adicionar animação de feedback
    const productCard = productGrid.children[index];
    productCard.classList.add('added-to-cart');
    setTimeout(() => {
        productCard.classList.remove('added-to-cart');
    }, 300);
}

// Renderizar carrinho
function renderCart() {
    cartItems.innerHTML = '';
    let total = 0;
    cart.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${item.name} - R$ ${formatPrice(item.price)} x ${item.quantity}
            <button onclick="removeFromCart(${index})" title="Remover">🗑️</button>
        `;
        cartItems.appendChild(li);
        total += item.price * item.quantity;
    });
    cartTotal.textContent = formatPrice(total);
}

// Remover do carrinho
function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    renderCart();
}

// Editar produto
function editProduct(index) {
    const product = products[index];
    const newName = prompt('Novo nome do produto:', product.name);
    const newPrice = parseFloat(prompt('Novo preço do produto:', product.price));
    if (newName && !isNaN(newPrice)) {
        products[index] = { name: newName, price: newPrice };
        saveProducts();
        renderProducts();
    }
}

// Excluir produto
function deleteProduct(index) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
        products.splice(index, 1);
        saveProducts();
        renderProducts();
    }
}

// Exibir/ocultar carrinho
cartIcon.addEventListener('click', () => {
    cartMenu.classList.toggle('hidden');
});

// Fechar carrinho ao clicar fora
document.addEventListener('click', (e) => {
    if (!cartMenu.contains(e.target) && e.target !== cartIcon) {
        cartMenu.classList.add('hidden');
    }
});

// Método de pagamento
paymentMethod.addEventListener('change', () => {
    if (paymentMethod.value === 'cash') {
        cashPayment.classList.remove('hidden');
    } else {
        cashPayment.classList.add('hidden');
    }
});

// Calcular troco
cashAmount.addEventListener('input', () => {
    const total = parseFloat(cartTotal.textContent);
    const paid = parseFloat(cashAmount.value);
    const change = paid - total;
    changeAmount.textContent = change >= 0 ? formatPrice(change) : '0.00';
});

// Processar pagamento
processPayment.addEventListener('click', () => {
    alert('Pagamento processado com sucesso!');
    cart = [];
    saveCart();
    renderCart();
    cartMenu.classList.add('hidden');
});

// Inicialização
renderProducts();
renderCart();
updateCartBadge();