const kanapAPI = new URL ("http://localhost:3000/api/products");


async function fetchKanap (url) {

    let response = await fetch(url);
    if (response.ok) {  // returns list of eight product objects
        let kanapProducts = await response.json();
        for ( var i = 0; i < kanapProducts.length; i++){  
            displayProducts(kanapProducts[i]);
        }
    } else {
        console.error ("HTTP-Error: " + response.status);
    }    
}

function displayProducts(productObject){
    const product = productObject; // create html article for each product
    const productArticle = document.createElement('article');
    const productAnchor = document.createElement('a');
    const productHref = document.createAttribute('href');
    productHref.value = `product.html?id=${product._id}`
    productAnchor.setAttributeNode(productHref);
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
    // append each product to productView
    productArticle.append(productHdr);
    productArticle.append(productImg);
    productArticle.append(productDesc);
    productAnchor.append(productArticle);
    productView.append(productAnchor);
}

const productView = document.getElementById('items');

fetchKanap(kanapAPI);

