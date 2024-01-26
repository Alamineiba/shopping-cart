//    Stocker une référence à l'élément HTML qui affichera la liste des produits.
let listProductHTML = document.querySelector('.listProduct');
// Stocker une référence à l'élément HTML qui affichera les articles du panier
let listCartHTML = document.querySelector('.listCart');
//  Stocke une référence à l'élément de l'icône du panier
let iconCart = document.querySelector('.icon-cart');
// Stocke une référence à l'élément span à l'intérieur de l'icône du panier qui affiche le nombre d'articles.
let iconCartSpan = document.querySelector('.icon-cart span');
let body = document.querySelector('body');
// Stocke une référence au bouton de fermeture du panier
let closeCart = document.querySelector('.close');
// Stocke une référence au bouton de fermeture du panier
let products = [];
// Un tableau pour stocker les articles du panier (stockés dans le stockage local).
let cart = [];

function search() {
    // Récupère la valeur du champ de recherche
    const searchTerm = document.querySelector('.search-bar').value;
  
    // Filtre les produits par la valeur du champ de recherche
    let products = [
      products.filter(product => product.name.includes(searchTerm)),
    ];
  
    // Met à jour la liste des produits
    renderProducts(products);
  }
  
// Écoute l'événement de changement du champ de recherche
document.querySelector('.search-bar').addEventListener('input', search);

iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
})
closeCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
})

    const addDataToHTML = () => {
    // remove datas default from HTML

        // add new datas
        if(products.length > 0) // if has data
        {
            products.forEach(product => {
                let newProduct = document.createElement('div');
                newProduct.dataset.id = product.id;
                newProduct.classList.add('item');
                newProduct.innerHTML = 
                `<img src="${product.image}" alt="">
                <h2>${product.name}</h2>
                <div class="price">$${product.price}</div>
                <button class="addCart">Add To Cart</button>`;
                listProductHTML.appendChild(newProduct);
            });
        }
    }
    listProductHTML.addEventListener('click', (event) => {
        let positionClick = event.target;
        if(positionClick.classList.contains('addCart')){
            let id_product = positionClick.parentElement.dataset.id;
            addToCart(id_product);
        }
    })
    const addToCart = (product_id) => {
        let positionThisProductInCart = cart.findIndex((value) => value.product_id == product_id);
    
        if (cart.length <= 0) {
            cart = [{
                product_id: product_id,
                quantity: 1
            }];
        } else if (positionThisProductInCart < 0) {
            cart.push({
                product_id: product_id,
                quantity: 1
            });
        } else {
            cart[positionThisProductInCart].quantity += 1; // Utilisation de l'opérateur d'incrémentation +=
        }
        addCartToHTML();
        addCartToMemory();
    }
    
    const addCartToMemory = () => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    
const addCartToHTML = () => {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;
    if(cart.length > 0){
        cart.forEach(item => {
            totalQuantity = totalQuantity +  item.quantity;
            let newItem = document.createElement('div');
            newItem.classList.add('item');
            newItem.dataset.id = item.product_id;

            let positionProduct = products.findIndex((value) => value.id == item.product_id);
            let info = products[positionProduct];
            listCartHTML.appendChild(newItem);
            newItem.innerHTML = `
            <div class="image">
                    <img src="${info.image}">
                </div>
                <div class="name">
                ${info.name}
                </div>
                <div class="totalPrice">$${info.price * item.quantity}</div>
                <div class="quantity">
                    <span class="minus"><</span>
                    <span>${item.quantity}</span>
                    <span class="plus">></span>
                </div>
            `;
        })
    }
    iconCartSpan.innerText = totalQuantity;
}

listCartHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if(positionClick.classList.contains('minus') || positionClick.classList.contains('plus')){
        let product_id = positionClick.parentElement.parentElement.dataset.id;
        let type = 'minus';
        if(positionClick.classList.contains('plus')){
            type = 'plus';
        }
        changeQuantityCart(product_id, type);
    }
})
const changeQuantityCart = (product_id, type) => {
    let positionItemInCart = cart.findIndex((value) => value.product_id == product_id);
    if(positionItemInCart >= 0){
        let info = cart[positionItemInCart];
        switch (type) {
            case 'plus':
                cart[positionItemInCart].quantity = cart[positionItemInCart].quantity + 1;
                break;
        
            default:
                let changeQuantity = cart[positionItemInCart].quantity - 1;
                if (changeQuantity > 0) {
                    cart[positionItemInCart].quantity = changeQuantity;
                }else{
                    cart.splice(positionItemInCart, 1);
                }
                break;
        }
    }
    addCartToHTML();
    addCartToMemory();
}

const initApp = () => {
    // get data product
    fetch('products.json')
    .then(response => response.json())
    .then(data => {
        products = data;
        addDataToHTML();

        // get data cart from memory
        if(localStorage.getItem('cart')){
            cart = JSON.parse(localStorage.getItem('cart'));
            addCartToHTML();
        }
    })
}
initApp();

