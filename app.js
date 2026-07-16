//Storage Controller
const StorageController = (function () {

    const getStoredProducts = function () {
        const storedProducts = localStorage.getItem("products");
        if (!storedProducts) return [];
        try {
            return JSON.parse(storedProducts);
        } catch (e) {
            localStorage.removeItem("products");
            return [];
        }
    };

    return {
        storeProduct: function (product) {
            const products = getStoredProducts();
            const existingIndex = products.findIndex(prd => prd.id === product.id);

            if (existingIndex >= 0) {
                products[existingIndex] = product;
            } else {
                products.push(product);
            }

            localStorage.setItem("products", JSON.stringify(products));
        },
        getProducts: function () {
            return getStoredProducts();
        },
        updateProduct: function (product) {
            const products = getStoredProducts();
            const updatedProducts = products.map(prd => prd.id === product.id ? product : prd);
            localStorage.setItem("products", JSON.stringify(updatedProducts));
        },
        deleteProduct: function (id) {
            const products = getStoredProducts().filter(prd => prd.id !== id);
            localStorage.setItem("products", JSON.stringify(products));
        },
        storeTotal: function (total) {
            localStorage.setItem("totalPrice", JSON.stringify(total));
        },
        getTotal: function () {
            const storedTotal = localStorage.getItem("totalPrice");
            if (!storedTotal) return 0;
            try {
                return parseFloat(storedTotal);
            } catch (e) {
                localStorage.removeItem("totalPrice");
                return 0;
            }
        }
    }

})();

//Product Controller
const ProductController = (function () {

    //private
    const Product = function (id, name, price) {
        this.id = id;
        this.name = name;
        this.price = price;
    }
    const data = {
        products: StorageController.getProducts(),
        selectedProduct: null,
        totalPrice: StorageController.getTotal()
    };

    //public 
    return {
        getProducts: function () {
            return data.products;
        },
        getData: function () {
            return data;
        },
        addProduct: function (name, price) {
            let id;
            if (data.products.length > 0) {
                id = data.products[data.products.length - 1].id + 1
            } else {
                id = 0;
            }
            const newProduct = new Product(id, name, parseFloat(price));
            data.products.push(newProduct);
            data.totalPrice = this.getTotal();
            return newProduct;

        },
        updateProduct: function (name, price) {

            let product = null;

            data.products.forEach(function (prd) {
                if (prd.id == data.selectedProduct.id) {
                    prd.name = name;
                    prd.price = parseFloat(price);
                    product = prd;
                }

            });
            data.totalPrice = this.getTotal();
            return product;
        },
        deleteProduct: function (product) {
            data.products.forEach(function (prd, index) {
                if (prd.id == product.id) {
                    data.products.splice(index, 1);
                }
            });
            data.totalPrice = this.getTotal();
            return ("product removed")
        }
        ,
        getTotal: function () {
            let total = 0;
            data.products.forEach(function (item) {
                total += item.price;
            });

            data.totalPrice = total;
            return data.totalPrice;
        },
        setCurrentProduct: function (product) {
            data.selectedProduct = product;
        },
        getCurrentProduct: function () {
            return data.selectedProduct;
        },
        getProductByID: function (id) {
            let product = null;

            data.products.forEach(function (prd) {
                if (prd.id == id) {
                    product = prd;
                }
            });

            return product;
        }
    }

})();
// UI Controller

const UIController = (function () {

    const Selectors = {
        productList: "#item-list",
        productListItems: "#item-list tr",
        addButton: '.btn.btn-primary.btn-sm.addBtn',
        updateButton: '.btn.btn-warning.btn-sm.updateBtn',
        deleteButton: '.btn.btn-danger.btn-sm.deleteBtn',
        cancelButton: '.btn.btn-dark.btn-sm.backBtn',
        productName: "#productName",
        productPrice: "#productPrice",
        productCard: "#productCard",
        totalTL: "#total-tl",
        totalDolar: "#total-dolar"
    }

    return {
        createProductList: function (products) {

            let html = '';

            products.forEach(prd => {
                html += `
                <tr>

                        <td>${prd.id}</td>
                        <td>${prd.name}</td>
                        <td>${prd.price}$</td>
                        <td >
                                <i class="fas fa-edit edit-product"></i>
                        </td>
                </tr>
                `
            });

            document.querySelector(Selectors.productList).innerHTML = html;

        },
        getSelectors: function () {
            return Selectors;
        },
        clearInputs: function () {
            document.querySelector(Selectors.productName).value = "";
            document.querySelector(Selectors.productPrice).value = "";
        },
        clearWarnings: function () {
            const items = document.querySelectorAll(Selectors.productListItems);
            items.forEach(function (item) {
                if (item.classList.contains("bg-warning")) {
                    item.classList.remove("bg-warning");
                }
            });
        },
        hidecard: function () {
            document.querySelector(Selectors.productCard).style.display = "none";

        },
        showtotal: function (total) {
            currency = 43; //dolar tl hesabı, sonrasında apı ile exchange apıden bilgi alınacak
            document.querySelector(Selectors.totalDolar).textContent = total;
            document.querySelector(Selectors.totalTL).textContent = total * currency;

        },
        addProductToForm: function () {
            const selectedProduct = ProductController.getCurrentProduct();
            document.querySelector(Selectors.productName).value = selectedProduct.name;
            document.querySelector(Selectors.productPrice).value = selectedProduct.price;

        },
        addProduct: function (prd) {
            document.querySelector(Selectors.productCard).style.display = "block"
            var item = `
                 <tr>

                        <td>${prd.id}</td>
                        <td>${prd.name}</td>
                        <td>${prd.price}$</td>
                        <td >
                                <i class="fas fa-edit edit-product"></i>
                        </td>
                </tr>
                `;
            document.querySelector(Selectors.productList).innerHTML += item;

        },
        deleteProduct: function () {
            let items = document.querySelectorAll(Selectors.productListItems)
            items.forEach(function (item) {
                if (item.classList.contains("bg-warning")) {
                    item.remove();
                }
            })
        },
        updateProduct: function (prd) {

            let updatedItem = null;

            let items = document.querySelectorAll(Selectors.productListItems);
            items.forEach(function (item) {
                if (item.classList.contains("bg-warning")) {
                    item.children[1].textContent = prd.name;
                    item.children[2].textContent = prd.price + "$";
                    updatedItem = item;
                }
            });
            return updatedItem;
        },
        editState: function (tr) {
            tr.classList.add("bg-warning");
            document.querySelector(Selectors.addButton).style.display = "none";
            document.querySelector(Selectors.updateButton).style.display = "inline";
            document.querySelector(Selectors.cancelButton).style.display = "inline";
            document.querySelector(Selectors.deleteButton).style.display = "inline";
        },
        addingState: function (item) {

            UIController.clearWarnings();

            UIController.clearInputs();
            document.querySelector(Selectors.addButton).style.display = "inline";
            document.querySelector(Selectors.updateButton).style.display = "none";
            document.querySelector(Selectors.cancelButton).style.display = "none";
            document.querySelector(Selectors.deleteButton).style.display = "none";
        },

    }

})();

//  APP Controller

const AppCOntroller = (function (ProductCtrl, UICtrl, StorageCtrl) {

    const UISelectors = UICtrl.getSelectors();

    // Load Event Listeners
    const LoadEventListeners = function () {

        //add product event
        document.querySelector(UISelectors.addButton).addEventListener("click", productAddSubmit);
        // edit product click
        document.querySelector(UISelectors.productList).addEventListener("click", productEditClick);

        //edit Product Submit
        document.querySelector(UISelectors.updateButton).addEventListener("click", editProductSubmit);

        //cancel button click
        document.querySelector(UISelectors.cancelButton).addEventListener("click", cancelupdate);

        document.querySelector(UISelectors.deleteButton).addEventListener("click", deleteProductSubmit);
    }

    const editProductSubmit = function (e) {
        e.preventDefault();
        console.log("updated click")
        const productName = document.querySelector(UISelectors.productName).value;
        const productPrice = document.querySelector(UISelectors.productPrice).value;

        if (productName != "" && productPrice != "") {

            //update Product

            const updated_Product = ProductCtrl.updateProduct(productName, productPrice)

            //update UI
            let item = UICtrl.updateProduct(updated_Product)

            //get total amount
            const total = ProductCtrl.getTotal();
            console.log(total)

            // show total
            UICtrl.showtotal(total);

            //update Storage

            StorageCtrl.updateProduct(updated_Product);
            StorageCtrl.storeTotal(total);
            UICtrl.addingState();
        }
    }

    const productEditClick = function (e) {
        e.preventDefault();
        //icon olan element kontrolü
        if (e.target.classList.contains("edit-product")) {
            const targetElementID = e.target.parentNode.previousElementSibling.previousElementSibling.previousElementSibling.textContent;

            //get selected product
            const product = ProductCtrl.getProductByID(targetElementID);
            console.log(product);

            // set current product
            ProductCtrl.setCurrentProduct(product);
            UICtrl.clearWarnings();
            //add product to form
            UICtrl.addProductToForm();
            UICtrl.editState(e.target.parentNode.parentNode);
        }

    }
    //addProduct
    const productAddSubmit = function (e) {
        e.preventDefault();

        const productName = document.querySelector(UISelectors.productName).value;
        const productPrice = document.querySelector(UISelectors.productPrice).value;

        if (productName != "" && productPrice != "") {
            const newProduct = ProductCtrl.addProduct(productName, productPrice)
            //add item
            UICtrl.addProduct(newProduct);

            // add product to LS

            StorageCtrl.storeProduct(newProduct);


            //get total amount
            const total = ProductCtrl.getTotal();
            StorageCtrl.storeTotal(total);

            // show total
            UICtrl.showtotal(total);

            //clear inputs
            UICtrl.clearInputs();
        }

        console.log(productName, productPrice)
    }
    //cancel update
    const cancelupdate = function (e) {
        UICtrl.addingState()

        console.log("cancel button")
        e.preventDefault();
    }
    const deleteProductSubmit = function (e) {

        //Get Product
        const selectedProduct = ProductCtrl.getCurrentProduct();
        //removeProduct
        ProductCtrl.deleteProduct(selectedProduct);
        UICtrl.deleteProduct();
        console.log("item deleted");

        //get total amount
        const total = ProductCtrl.getTotal();

        // show total
        UICtrl.showtotal(total);
        
        //delete form LS
        StorageCtrl.deleteProduct(selectedProduct.id);

        UICtrl.addingState();

        if (total == 0) {
            UICtrl.hidecard();
        }
        e.preventDefault();

    }

    return {
        init: function () {
            console.log("starting app...")

            UICtrl.addingState();
            UICtrl.clearWarnings();

            const products = ProductCtrl.getProducts();
            if (products.length == 0) {
                UICtrl.hidecard();
            }
            else {
                UICtrl.createProductList(products);
            }

            const total = ProductCtrl.getTotal();
            UICtrl.showtotal(total);

            console.log(products)

            UICtrl.createProductList(products);

            LoadEventListeners();
        }
    }
})(ProductController, UIController, StorageController);

AppCOntroller.init();