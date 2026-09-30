/* =========================================
   STATE
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
   DOM REFERENCES
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
   ESCAPE HTML
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
   CREATE PRODUCT
========================================= */

function createProduct(
    name,
    price,
    quantity
) {

    return {
        id: crypto.randomUUID(),

        name: name.trim(),

        price: Number(price),

        quantity: Number(quantity)
    };
}


/* =========================================
   ADD PRODUCT
========================================= */

function addProduct(product) {

    state.products.push(product);
}


/* =========================================
   GET PRODUCT
========================================= */

function getProductById(id) {

    return state.products.find(
        product => product.id === id
    );
}


/* =========================================
   UPDATE PRODUCT
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
   DELETE PRODUCT
========================================= */

function deleteProduct(id) {

    state.products =
        state.products.filter(
            product =>
                product.id !== id
        );
}


/* =========================================
   READ FORM
========================================= */

function readProductForm() {

    return {

        name:
            elements.productName
                .value
                .trim(),

        price:
            Number(
                elements.productPrice.value
            ),

        quantity:
            Number(
                elements.productQuantity.value
            )
    };
}


/* =========================================
   FILL FORM
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
   ENTER EDIT MODE
========================================= */

function enterEditMode(product) {

    state.selectedProductId =
        product.id;


    fillProductForm(product);


    elements.submitProductButton
        .textContent =
            "Update Product";


    elements.productName.focus();
}


/* =========================================
   EXIT EDIT MODE
========================================= */

function exitEditMode() {

    state.selectedProductId =
        null;


    elements.submitProductButton
        .textContent =
            "Add Product";
}


/* =========================================
   RESET FORM
========================================= */

function resetProductForm() {

    elements.productForm.reset();

    exitEditMode();

    elements.productName.focus();
}


/* =========================================
   GET VISIBLE PRODUCTS
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
   RENDER PRODUCTS
========================================= */

function renderProducts() {

    const products =
        getVisibleProducts();


    if (products.length === 0) {

        elements.productTable.innerHTML = `

            <tr>

                <td
                    colspan="4"
                    style="text-align:center;">

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
   SUBMIT EVENT
========================================= */

function handleProductSubmit(event) {

    /*
        Without this:
        browser performs normal form submit
        and page may reload/navigate.
    */

    event.preventDefault();


    const product =
        readProductForm();


    /* Validation */

    if (!product.name) {

        alert("Product name is required");

        elements.productName.focus();

        return;
    }


    if (
        Number.isNaN(product.price) ||
        product.price < 0
    ) {

        alert("Price is invalid");

        elements.productPrice.focus();

        return;
    }


    if (
        Number.isNaN(product.quantity) ||
        product.quantity < 1
    ) {

        alert("Quantity is invalid");

        elements.productQuantity.focus();

        return;
    }


    /* UPDATE */

    if (state.selectedProductId) {

        updateProduct(
            state.selectedProductId,
            product.name,
            product.price,
            product.quantity
        );
    }

    /* ADD */

    else {

        const newProduct =
            createProduct(
                product.name,
                product.price,
                product.quantity
            );


        addProduct(newProduct);
    }


    resetProductForm();

    renderProducts();
}


/* =========================================
   TABLE CLICK EVENT

   EVENT DELEGATION
========================================= */

function handleProductTableClick(event) {

    /*
        event.target:

        the exact element that was clicked.

        closest():

        starts from event.target and moves
        UP through parents until it finds
        button[data-action].
    */

    const button =
        event.target.closest(
            "button[data-action]"
        );


    /*
        User may click:
        td
        tr
        empty table area
        etc.

        In those cases no action button
        will be found.
    */

    if (!button) {
        return;
    }


    const action =
        button.dataset.action;


    const productId =
        button.dataset.productId;


    /* EDIT */

    if (action === "edit") {

        const product =
            getProductById(productId);


        if (!product) {
            return;
        }


        enterEditMode(product);

        return;
    }


    /* DELETE */

    if (action === "delete") {

        deleteProduct(productId);


        /*
            If user was editing the same
            product that was just deleted,
            leave edit mode.
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
   SEARCH EVENT
========================================= */

function handleSearchInput(event) {

    state.search =
        event.target.value;


    renderProducts();
}


/* =========================================
   FILTER EVENT
========================================= */

function handleProductFilterChange(event) {

    state.filter =
        event.target.value;


    renderProducts();
}


/* =========================================
   RESET EVENT
========================================= */

function handleProductReset() {

    exitEditMode();
}


/* =========================================
   REGISTER EVENTS
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
            handleProductReset
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
   START APPLICATION
========================================= */

registerEvents();

renderProducts();