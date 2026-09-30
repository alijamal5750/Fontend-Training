console.log("Frontend Core JavaScript loaded");


/* =========================================
   State
========================================= */

const state = {

    products: [

        {
            id: "1",
            name: "iPhone",
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

    search: "",

    selectedProductId: null

};


/* =========================================
   Product Creation
========================================= */

function createProduct(
    name,
    price,
    quantity
) {

    return {

        id: crypto.randomUUID(),

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

    state.products = [
        ...state.products,
        product
    ];

}


/* =========================================
   Get Product
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
    changes
) {

    state.products =
        state.products.map(product => {

            if (product.id !== id) {

                return product;

            }

            return {

                ...product,

                ...changes

            };

        });

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
   Search Products
========================================= */

function searchProducts(search) {

    const normalizedSearch =
        search
            .trim()
            .toLowerCase();


    if (!normalizedSearch) {

        return state.products;

    }


    return state.products.filter(
        product =>
            product.name
                .toLowerCase()
                .includes(normalizedSearch)
    );

}


/* =========================================
   Total Quantity
========================================= */

function getTotalQuantity() {

    return state.products.reduce(
        (total, product) =>
            total + product.quantity,
        0
    );

}


/* =========================================
   Inventory Value
========================================= */

function getInventoryValue() {

    return state.products.reduce(
        (total, product) =>
            total +
            product.price *
            product.quantity,
        0
    );

}


/* =========================================
   Debug
========================================= */

console.table(
    state.products
);


console.log(
    "Total Quantity:",
    getTotalQuantity()
);


console.log(
    "Inventory Value:",
    getInventoryValue()
);