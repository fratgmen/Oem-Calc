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
        products: []
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

        },
        getTotal : function(){
                let total = 0;
                data.products.forEach(function(item){
                    total += item.price;
                });

                data.totalPrice = total;
                return data.totalPrice;
        }
    }
    
})();
// UI Controller

const UIController = (function () {

    const Selectors = {
        productList: "#item-list",
        addButton: '.btn.btn-primary.btn-sm.addBtn',
        productName: "#productName",
        productPrice : "#productPrice",
        productCard : "#productCard",
        totalTL : "#total-tl",
        totalDolar : "#total-dolar"
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
            document.querySelector(Selectors.productCard).style.display = "block"
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

        },
        clearInputs : function(){
            document.querySelector(Selectors.productName).value = "";
            document.querySelector(Selectors.productPrice).value = "";
        },
        hidecard : function(){
            document.querySelector(Selectors.productCard).style.display = "none";
            
        },
        showtotal: function(total){
            currency = 43; //dolar tl hesabı, sonrasında apı ile exchange apıden bilgi alınacak
            document.querySelector(Selectors.totalDolar).textContent = total;
            document.querySelector(Selectors.totalTL).textContent = total*currency;

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
                e.preventDefault();

        const productName = document.querySelector(UISelectors.productName).value;
        const productPrice = document.querySelector(UISelectors.productPrice).value;

        
        if(productName!= "" && productPrice!= ""){
          const newProduct =   ProductCtrl.addProduct(productName,productPrice)
            //add item
            UICtrl.addProduct(newProduct);

            //get total amount
            const total = ProductCtrl.getTotal();
            console.log(total)

            // show total
            UICtrl.showtotal(total);

            
            //clear inputs
            UICtrl.clearInputs();
        }

        console.log(productName,productPrice)
    }

    return {
        init: function () {
            console.log("starting app...")
            const products = ProductCtrl.getProducts();
            if (products.length==0){
                UICtrl.hidecard();
            }
        else{
            UICtrl.createProductList(products);
        }
            
            console.log(products)

            UICtrl.createProductList(products);

            LoadEventListeners();
        }


    }


})(ProductController, UIController);



AppCOntroller.init();