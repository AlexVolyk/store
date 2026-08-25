export const paths = {
    auth: {
        register: "/auth/register",
        login: "/auth/login",
    },

    products: {
        all: "/products",
        byId: "/products/:id",
        create: "/products",
        update: "/products/:id",
        delete: "/products/:id",
        reviews: "/products/:productId/reviews",
    },

    cart: {
        get: "/cart",
        addItem: "/cart/items",
        updateItem: "/cart/items/:productId",
        deleteItem: "/cart/items/:productId",
        clear: "/cart",
    },

    categories: {
        all: "/categories",
        byId: "/categories/:id",
        create: "/categories",
        update: "/categories/:id",
        delete: "/categories/:id",
    },

    orders: {
        create: "/orders",
        my: "/orders/my",
        byId: "/orders/:id",
        pay: "/orders/:id/pay",
        deliver: "/orders/:id/deliver",
        status: "/orders/:id/status",
    },

    reviews: {
        create: "/reviews/id",
        update: "/reviews/:id",
        delete: "/reviews/:id",
    },

    users: {
        all: "/users",
        update: "/users/update/:id",
        delete: "/users/delete/:id",
    },

    wishlist: {
        get: "/wishlist",
        add: "/wishlist/:productId",
        remove: "/wishlist/:productId",
    },
};