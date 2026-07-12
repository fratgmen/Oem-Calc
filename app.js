//Storage Controller
const StorageController = (function () {




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
        products: [
            { id: 1, name: "pen", price: 12 },
            { id: 2, name: "scissors", price: 13 },
            { id: 3, name: "book", price: 14 },
            { id: 4, name: "notebook", price: 15 },
        ]
        ,
        selectedProduct: null,
        totalPrice: 0
    };

    //public 
    return {
        getProducts: function () {
            return data.products;
        },
        getData: function () {
            return data;
        },
        addProduct : function(name,price){
            let id;
            if(data.products.length>0){
                id = data.products[data.products.length-1].id+1
            }else{
                id = 0;
            }
            const newProduct = new Product(id,name,parseFloat(price));
            data.products.push(newProduct);
            return newProduct;

        }
    }
})();
// UI Controller

const UIController = (function () {

    const Selectors = {
        productList: "#item-list",
        addButton: ".addBtn",
        productName: "#productName",
        productPrice : "#productPrice"
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
                            <button type="submit" class="btn btn-warning btn-sm ">
                                <i class="fas fa-edit"></i>
                                Save Changes
                            </button>
                        </td>
                </tr>
                `
            });

            document.querySelector(Selectors.productList).innerHTML = html;

        },
        getSelectors: function () {
            return Selectors;
        },
        addProduct: function(prd){
            var item = `
                 <tr>

                        <td>${prd.id}</td>
                        <td>${prd.name}</td>
                        <td>${prd.price}$</td>
                        <td >
                            <button type="submit" class="btn btn-warning btn-sm ">
                                <i class="fas fa-edit"></i>
                                Save Changes
                            </button>
                        </td>
                </tr>
                `;
                document.querySelector(Selectors.productList).innerHTML += item;

        }
    }

})();

//  APP Controller

const AppCOntroller = (function (ProductCtrl, UICtrl) {

    const UISelectors = UIController.getSelectors();

    // Load Event Listeners
    const LoadEventListeners = function () {

        //add product event
        document.querySelector(UISelectors.addButton).addEventListener("click", productAddSubmit);

    }
    const productAddSubmit = function(e){
        
        const ProductName = document.querySelector(UISelectors.productName).value;
        const ProductPrice = document.querySelector(UISelectors.productPrice).value;

        
        if(productName!= "" && productPrice!= ""){
          const newProduct =   ProductCtrl.addProduct(productName,productPrice)

            UIController.addProduct(newProduct);

        }

        console.log(ProductName,ProductPrice)
        e.preventDefault();
    }

    return {
        init: function () {
            console.log("starting app...")
            const products = ProductCtrl.getProducts();
            console.log(products)

            UICtrl.createProductList(products);

            LoadEventListeners();
        }


    }


})(ProductController, UIController);



AppCOntroller.init();