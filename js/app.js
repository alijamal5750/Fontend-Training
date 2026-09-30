/* =========================================
   State
========================================= */

const state = {

    products: [

        {
            id: "1",
            name: "Iphone",
            price: 1000,
            quantity: 10
        },

        {
            id: "2",
            name: "Laptop",
            price: 500,
            quantity: 2
        }

    ],

    selectedProductId: null,

    search: "",

    filter: "all"

};


/* =========================================
   DOM Elements
========================================= */

const elements = {

    productForm:
        document.querySelector("#productForm"),

    productTable:
        document.querySelector("#productTable"),

    productName:
        document.querySelector("#productname"),

    productPrice:
        document.querySelector("#productprice"),

    productQuantity:
        document.querySelector("#productQuantity"),

    submitProductButton:
        document.querySelector("#submitProductButton"),

    searchInput:
        document.querySelector("#productSearch"),

    productFilter:
        document.querySelector("#productFilter")

};


/* =========================================
   Escape HTML

   Needed because product.name is inserted
   inside innerHTML.

   User/API/database strings should not be
   treated as HTML markup.
========================================= */

function escapeHtml(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/* =========================================
   Create Product
========================================= */

function createProduct(
    name,
    price,
    quantity
) {

    return {

        id:
            crypto.randomUUID(),

        name:
            name.trim(),

        price:
            Number(price),

        quantity:
            Number(quantity)

    };

}


/* =========================================
   Add Product
========================================= */

function addProduct(product) {

    state.products.push(product);

}


/* =========================================
   Find Product
========================================= */

function getProductById(id) {

    return state.products.find(
        product =>
            product.id === id
    );

}


/* =========================================
   Update Product
========================================= */

function updateProduct(
    id,
    name,
    price,
    quantity
) {

    const product =
        getProductById(id);


    if (!product) {

        return false;

    }


    product.name =
        name.trim();

    product.price =
        Number(price);

    product.quantity =
        Number(quantity);


    return true;

}


/* =========================================
   Delete Product
========================================= */

function deleteProduct(id) {

    state.products =
        state.products.filter(
            product =>
                product.id !== id
        );

}


/* =========================================
   Read Product Form
========================================= */

function readProductForm() {

    return {

        name:
            elements
                .productName
                .value
                .trim(),

        price:
            Number(
                elements
                    .productPrice
                    .value
            ),

        quantity:
            Number(
                elements
                    .productQuantity
                    .value
            )

    };

}


/* =========================================
   Fill Product Form
========================================= */

function fillProductForm(product) {

    elements.productName.value =
        product.name;

    elements.productPrice.value =
        product.price;

    elements.productQuantity.value =
        product.quantity;

}


/* =========================================
   Enter Edit Mode
========================================= */

function enterEditMode(product) {

    state.selectedProductId =
        product.id;


    fillProductForm(product);


    elements
        .submitProductButton
        .textContent =
            "Update Product";


    elements
        .productName
        .focus();

}


/* =========================================
   Exit Edit Mode
========================================= */

function exitEditMode() {

    state.selectedProductId =
        null;


    elements
        .submitProductButton
        .textContent =
            "Add Product";

}


/* =========================================
   Reset Product Form
========================================= */

function resetProductForm() {

    elements.productForm.reset();

    elements.productName.focus();

}


/* =========================================
   Get Products To Display

   Search + filter are applied here.
========================================= */

function getVisibleProducts() {

    let products =
        state.products;


    /* Search */

    const search =
        state.search
            .trim()
            .toLowerCase();


    if (search) {

        products =
            products.filter(
                product =>
                    product.name
                        .toLowerCase()
                        .includes(search)
            );

    }


    /* Filter */

    if (state.filter !== "all") {

        products =
            products.filter(
                product =>
                    product.name
                        .toLowerCase() ===
                    state.filter
                        .toLowerCase()
            );

    }


    return products;

}


/* =========================================
   Render Products

   State
      ↓
   map()
      ↓
   HTML
      ↓
   innerHTML
      ↓
   DOM
========================================= */

function renderProducts() {

    const products =
        getVisibleProducts();


    if (products.length === 0) {

        elements.productTable.innerHTML = `

            <tr>

                <td
                    colspan="4"
                    style="text-align: center;">

                    No products found

                </td>

            </tr>

        `;

        return;

    }


    elements.productTable.innerHTML = `

        ${products.map(product => `

            <tr
                data-product-id="${product.id}">

                <td>

                    ${escapeHtml(product.name)}

                </td>


                <td>

                    $${product.price}

                </td>


                <td>

                    ${product.quantity}

                </td>


                <td>

                    <div class="td-actions">

                        <button
                            type="button"
                            data-action="edit"
                            data-product-id="${product.id}">

                            Edit

                        </button>


                        <button
                            type="button"
                            data-action="delete"
                            data-product-id="${product.id}">

                            Delete

                        </button>

                    </div>

                </td>

            </tr>

        `).join("")}

    `;

}


/* =========================================
   Form Submit Event
========================================= */

function handleProductSubmit(event) {

    event.preventDefault();


    const product =
        readProductForm();


    /* Extra JS validation */

    if (!product.name) {

        alert(
            "Product name is required"
        );

        elements.productName.focus();

        return;

    }


    if (
        Number.isNaN(product.price) ||
        product.price < 0
    ) {

        alert(
            "Price is invalid"
        );

        elements.productPrice.focus();

        return;

    }


    if (
        Number.isNaN(product.quantity) ||
        product.quantity < 1
    ) {

        alert(
            "Quantity is invalid"
        );

        elements.productQuantity.focus();

        return;

    }


    /* Edit */

    if (state.selectedProductId) {

        updateProduct(
            state.selectedProductId,
            product.name,
            product.price,
            product.quantity
        );

    }

    /* Add */

    else {

        addProduct(
            createProduct(
                product.name,
                product.price,
                product.quantity
            )
        );

    }


    resetProductForm();

    renderProducts();

}


/* =========================================
   Table Click Event

   Event delegation:

   One listener on tbody handles
   Edit + Delete for every dynamic row.
========================================= */

function handleProductTableClick(event) {

    const button =
        event.target.closest(
            "button[data-action]"
        );


    if (!button) {

        return;

    }


    const action =
        button.dataset.action;


    const productId =
        button.dataset.productId;


    /* Edit */

    if (action === "edit") {

        const product =
            getProductById(
                productId
            );


        if (!product) {

            return;

        }


        enterEditMode(product);

        return;

    }


    /* Delete */

    if (action === "delete") {

        deleteProduct(
            productId
        );


        /*
            If we were editing the same
            product that was deleted,
            reset the form.
        */

        if (
            state.selectedProductId ===
            productId
        ) {

            resetProductForm();

        }


        renderProducts();

    }

}


/* =========================================
   Search Event
========================================= */

function handleSearchInput(event) {

    state.search =
        event.target.value;


    renderProducts();

}


/* =========================================
   Filter Event
========================================= */

function handleProductFilterChange(event) {

    state.filter =
        event.target.value;


    renderProducts();

}


/* =========================================
   Form Reset Event
========================================= */

function handleProductFormReset() {

    exitEditMode();

}


/* =========================================
   Register Events

   We register each listener ONCE.
========================================= */

function registerEvents() {

    elements.productForm
        .addEventListener(
            "submit",
            handleProductSubmit
        );


    elements.productForm
        .addEventListener(
            "reset",
            handleProductFormReset
        );


    elements.productTable
        .addEventListener(
            "click",
            handleProductTableClick
        );


    elements.searchInput
        .addEventListener(
            "input",
            handleSearchInput
        );


    elements.productFilter
        .addEventListener(
            "change",
            handleProductFilterChange
        );

}


/* =========================================
   Start Application
========================================= */

registerEvents();

renderProducts();