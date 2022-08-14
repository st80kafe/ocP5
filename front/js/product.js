
const productURL = this.location;
const kanapID = new URLSearchParams(productURL.search);
const productID = kanapID.get("id");

const productAPI = new URL ("http://localhost:3000/api/products/" + productID);

const getProductAPI = (url) => {
    const xhr = new XMLHttpRequest();
   
    xhr.open("GET", url, true);
    xhr.responseType = JSON;
    
    xhr.onload = () => { if (xhr.readyState === 4){
        const kanapProduct = JSON.parse(xhr.response);
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
        itemPrice = document.getElementById('price');
        itemPrice.textContent = kanapProduct.price;
        itemDesc = document.getElementById('description');
        itemDesc.textContent = kanapProduct.description;
        colorSelect = document.getElementById('colors');
        colorValues = kanapProduct.colors;
        for (k in colorValues){
            const colorSelection = document.createElement('option');
            const colorValue = document.createAttribute('value');
            colorValue.value = colorValues[k].toLowerCase();
            colorSelection.innerText = colorValues[k];
            colorSelection.setAttributeNode(colorValue)
            colorSelect.append(colorSelection);
        }
    }};
    xhr.send(null);
}

getProductAPI(productAPI);
