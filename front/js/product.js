
const productURL = this.location;
const kanapID = new URLSearchParams(productURL.search);
const productID = kanapID.get("id");
let kanapProduct = {};

const productAPI = new URL ("http://localhost:3000/api/products/" + productID);

async function fetchKanap (url) {

    let response = await fetch(url);
    if (response.ok) { 
        let json = await response.json();
        displayProduct(json);
        getProductsQuantity ();
    } else {
        console.error ("HTTP-Error: " + response.status);
    }    
}

function displayProduct(product){
    kanapProduct = product;
    const productTitle = document.getElementsByTagName('title');
    productTitle[0].textContent = kanapProduct.name;
    const productImg = document.createElement('img');
    const imgSrc = document.createAttribute('src');
    imgSrc.value = kanapProduct.imageUrl;
    const imgAlt = document.createAttribute('alt');
    imgAlt.value = kanapProduct.altTxt;
    productImg.setAttributeNode(imgSrc);
    productImg.setAttributeNode(imgAlt);
    const itemImg = document.getElementsByClassName('item__img');
    itemImg[0].append(productImg);
    const itemName = document.getElementById('title');
    itemName.textContent = kanapProduct.name;
    const itemPrice = document.getElementById('price');
    itemPrice.textContent = kanapProduct.price;
    const itemDesc = document.getElementById('description');
    itemDesc.textContent = kanapProduct.description;
    const colorSelect = document.getElementById('colors');
    const colorValues = kanapProduct.colors;
    for (k in colorValues){
        const colorSelection = document.createElement('option');
        const colorValue = document.createAttribute('value');
        colorValue.value = colorValues[k].toLowerCase();
        colorSelection.innerText = colorValues[k];
        colorSelection.setAttributeNode(colorValue)
        colorSelect.append(colorSelection);
    }
}

function getProductsQuantity () {
    // handle clicks on add-to-cart button with storeCartItem()
    const itemQuantityElem = document.getElementById('quantity');
    itemQuantityElem.addEventListener('change', ($event) => {
        // assignment of storeCartItem() parameter
        itemQuantity = $event.target.value;
    });
    const itemColorElem = document.getElementById('colors');
    itemColorElem.addEventListener('change', ($event) => {
        // assignment of storeCartItem() parameter
        itemColor = $event.target.value;
    });
    document.getElementById('addToCart').addEventListener('click',  () => {
        if (typeof itemColor === 'string' && typeof itemQuantity === 'string'){
            // function call
            storeCartItem(kanapProduct.name, itemColor, itemQuantity) 
        }
    });
        
}
// storeCartItem records each click in local sessionStorage
function storeCartItem(item, color, qty){
    const addedName = item;
    const addedColor = color;
    const productQuantity = qty;
    // concatenates name @ color and reassigns quantity value when indicated by clicker
    const amp = '@' + addedColor;
    const productKey = addedName + amp;
   

    if (typeof Storage  !== 'undefined'){
        if (addedName !== null && addedColor !== null && productQuantity !== '0'){
            sessionStorage.setItem( productKey, productQuantity );
        }
    }
    console.log(sessionStorage);
}

function storageIterate() {  // debug function
    for ( k = 0; k < sessionStorage.length; k++){
        console.log(`${sessionStorage.key(k)} : ${sessionStorage.getItem(sessionStorage.key(k))}`);
    }
}
fetchKanap(productAPI);
storageIterate();
// sessionStorage.clear();

