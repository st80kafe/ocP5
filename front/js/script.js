const kanapAPI = new URL ("http://localhost:3000/api/products");
const getKanapAPI = (url) => {
    const xhr = new XMLHttpRequest();
   
    xhr.open("GET", url, false);
    xhr.send(null);
    const responseText = xhr.responseText;
    return responseText;
    
}

const kanapProducts = JSON.parse(getKanapAPI(kanapAPI));

const productView = document.getElementById('items');

for ( var i = 0; i < kanapProducts.length; i++){
    const product = kanapProducts[i];
    const productArticle = document.createElement('article');
    const productAnchor = document.createElement('a');
    const productHref = document.createAttribute('href');
    productHref.value = `product.html?id=${product._id}`
    productAnchor.setAttributeNode(productHref);
    productView.append(productAnchor);
    productAnchor.append(productArticle);
    const productHdr = document.createElement('h3');
    productHdr.classList.add('productName');
    productHdr.innerText = product.name;
    const productImg = document.createElement('img');
    const imgSrc = document.createAttribute('src');
    imgSrc.value = product.imageUrl;
    const imgAlt = document.createAttribute('alt');
    imgAlt.value = product.altTxt;
    productImg.setAttributeNode(imgSrc);
    productImg.setAttributeNode(imgAlt);
    const productDesc = document.createElement('h3');
    productDesc.classList.add('productDescription');
    productDesc.innerText = product.description;
    productArticle.append(productHdr);
    productArticle.append(productImg);
    productArticle.append(productDesc);
}
