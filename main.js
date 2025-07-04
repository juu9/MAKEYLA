// Product data (can be expanded)
const products = [
    {
        id: 1,
        name: "بن محموص مكيلة",
        desc: "أفضل أنواع البن المحمص الطازج.",
        price: 50,
        img: "IMG-20250701-WA0002.jpg"
    },
    {
        id: 2,
        name: "بن مكيلة الفاخر",
        desc: "بن مختار بعناية مع نكهة غنية وقوية لعشاق القهوة.",
        price: 65,
        img: "IMG-20250701-WA0002.jpg"
    },
    {
        id: 3,
        name: "بن مكيلة العضوي",
        desc: "بن عضوي 100% بدون إضافات، مناسب للمهتمين بالصحة.",
        price: 70,
        img: "IMG-20250701-WA0002.jpg"
    },
    {
        id: 4,
        name: "بن مكيلة الإسبريسو",
        desc: "تحميص خاص لعشاق الإسبريسو، طعم مركز وقوي.",
        price: 60,
        img: "IMG-20250701-WA0002.jpg"
    }
];

// Cart state
let cart = [];
let appliedDiscount = 0;

// Helpers
function updateCartCount() {
    document.getElementById('cart-count').textContent = cart.reduce((a, item) => a + item.qty, 0);
}

function renderCart() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>السلة فارغة.</p>';
    } else {
        cart.forEach(item => {
            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                <img src="${item.img}" alt="${item.name}">
                <span>${item.name} × ${item.qty}</span>
                <span>${item.price * item.qty} ر.س</span>
                <button class="remove-btn" data-id="${item.id}">حذف</button>
            `;
            cartItems.appendChild(div);
        });
    }
    updateCartTotal();
}

function updateCartTotal() {
    let total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    if (appliedDiscount > 0) {
        total = total - (total * appliedDiscount / 100);
    }
    document.getElementById('cart-total').textContent = total.toFixed(2);
}

// Product modal logic
document.querySelectorAll('.details-btn').forEach(btn => {
    btn.onclick = function(e) {
        const card = e.target.closest('.product-card');
        const id = Number(card.getAttribute('data-id'));
        const prod = products.find(p => p.id === id);
        const modal = document.getElementById('product-modal');
        modal.querySelector('img').src = prod.img;
        modal.querySelector('img').alt = prod.name;
        modal.querySelector('h2').textContent = prod.name;
        modal.querySelector('p').textContent = prod.desc;
        modal.querySelector('.price').textContent = prod.price + " ر.س";
        modal.querySelector('.add-cart-btn').setAttribute('data-id', prod.id);
        modal.classList.remove('hidden');
    };
});
document.querySelector('#product-modal .close-modal').onclick = function() {
    document.getElementById('product-modal').classList.add('hidden');
};

// Add to cart logic
function addToCart(productId) {
    const prod = products.find(p => p.id === productId);
    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...prod, qty: 1 });
    }
    updateCartCount();
    renderCart();
}

document.querySelectorAll('.add-cart-btn').forEach(btn => {
    btn.onclick = function(e) {
        const card = e.target.closest('.product-card');
        if (card) {
            const id = Number(card.getAttribute('data-id'));
            addToCart(id);
        }
    };
});
document.querySelector('#product-modal .add-cart-btn').onclick = function(e) {
    const id = Number(e.target.getAttribute('data-id')) || 1;
    addToCart(id);
    document.getElementById('product-modal').classList.add('hidden');
};

// Cart modal logic
document.getElementById('cart-btn').onclick = function(e) {
    e.preventDefault();
    renderCart();
    document.getElementById('cart-modal').classList.remove('hidden');
};
document.querySelector('#cart-modal .close-modal').onclick = function() {
    document.getElementById('cart-modal').classList.add('hidden');
};

// Remove from cart
document.getElementById('cart-items').onclick = function(e) {
    if (e.target.classList.contains('remove-btn')) {
        const id = +e.target.getAttribute('data-id');
        cart = cart.filter(item => item.id !== id);
        updateCartCount();
        renderCart();
    }
};

// Terms acceptance
document.getElementById('accept-terms').onchange = function() {
    document.getElementById('checkout-btn').disabled = !this.checked || cart.length === 0;
};

// Enable checkout only if cart not empty and terms accepted
function updateCheckoutBtn() {
    const terms = document.getElementById('accept-terms').checked;
    document.getElementById('checkout-btn').disabled = !terms || cart.length === 0;
}
document.getElementById('cart-items').addEventListener('DOMSubtreeModified', updateCheckoutBtn);
document.getElementById('accept-terms').addEventListener('change', updateCheckoutBtn);

// Discount code logic
document.getElementById('apply-discount').onclick = function() {
    const code = document.getElementById('discount-code').value.trim();
    const msg = document.getElementById('discount-msg');
    if (code === "عنبه") {
        appliedDiscount = 5;
        msg.textContent = "تم تطبيق خصم 5%";
    } else if (code === "كيرو") {
        appliedDiscount = 10;
        msg.textContent = "تم تطبيق خصم 10%";
    } else if (code) {
        appliedDiscount = 0;
        msg.textContent = "كود الخصم غير صحيح";
    } else {
        appliedDiscount = 0;
        msg.textContent = "";
    }
    updateCartTotal();
};

// Show hidden discount info if no code entered
document.getElementById('discount-code').onfocus = function() {
    document.getElementById('hidden-discount-info').classList.remove('hidden');
};
document.getElementById('discount-code').onblur = function() {
    setTimeout(() => {
        document.getElementById('hidden-discount-info').classList.add('hidden');
    }, 2000);
};

// Checkout logic (simulate payment)
document.getElementById('checkout-btn').onclick = function() {
    if (!document.getElementById('accept-terms').checked) return;
    alert('تم الدفع بنجاح! سيتم تزويدك بكود الخصم مع الطلب.');
    cart = [];
    appliedDiscount = 0;
    updateCartCount();
    renderCart();
    document.getElementById('cart-modal').classList.add('hidden');
    document.getElementById('discount-code').value = '';
    document.getElementById('discount-msg').textContent = '';
};

// تحقق من صحة رقم البطاقة باستخدام خوارزمية Luhn (بروتوكول البطاقات البنكية)
function isValidCardNumberLuhn(number) {
    const clean = number.replace(/\s+/g, '');
    if (!/^\d{16}$/.test(clean)) return false;
    let sum = 0;
    for (let i = 0; i < 16; i++) {
        let digit = parseInt(clean.charAt(15 - i), 10);
        if (i % 2 === 1) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }
        sum += digit;
    }
    return sum % 10 === 0;
}

// تفعيل الدفع الحقيقي عند الطلب من أي مكان في الموقع
async function payNowFromMain(cartData) {
    // تحقق من صحة البيانات الأساسية
    if (!cartData || !Array.isArray(cartData.items) || cartData.items.length === 0) {
        alert('لا يوجد منتجات في السلة.');
        return;
    }
    if (!cartData.name || cartData.name.trim().length < 2) {
        alert('يرجى إدخال اسم صحيح.');
        return;
    }
    if (!cartData.phone || !/^05\d{8}$/.test(cartData.phone)) {
        alert('يرجى إدخال رقم جوال سعودي صحيح (05XXXXXXXX).');
        return;
    }
    if (!cartData.method) {
        alert('يرجى اختيار طريقة الدفع.');
        return;
    }
    // تحقق من رقم البطاقة باستخدام Luhn
    if (!cartData.card || !isValidCardNumberLuhn(cartData.card)) {
        alert('يرجى إدخال رقم بطاقة بنكية صحيح (16 رقم متوافق مع بروتوكول البطاقات).');
        return;
    }
    if (!cartData.exp || !/^\d{2}\/\d{2}$/.test(cartData.exp)) {
        alert('يرجى إدخال تاريخ انتهاء صحيح (MM/YY).');
        return;
    }
    if (!cartData.cvv || !/^\d{3,4}$/.test(cartData.cvv)) {
        alert('يرجى إدخال رمز أمان صحيح (3 أو 4 أرقام).');
        return;
    }

    try {
        if (typeof payWithAPI !== "function") {
            alert('نظام الدفع غير متوفر. تأكد من ربط payment-api.js بشكل صحيح.');
            return;
        }
        await payWithAPI(cartData); // الدالة من payment-api.js
        alert('تم الدفع بنجاح! تم إرسال طلبك وسيتم التواصل معك قريباً.');
        window.location.href = "index.html";
    } catch (err) {
        alert(err && err.message ? err.message : "حدث خطأ أثناء الدفع.");
    }
}

// Initial render
updateCartCount();
updateCartCount();
