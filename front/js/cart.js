
const kanapAPI = new URL ("http://localhost:3000/api/products");
const kanapCart = [];



/** 
 * getProductData() makes an asychronous request
 * to the backend API.
 * The same object used to display products on main page 
 * is used to process data in session storage when
 * XMLHttpRequest onload method calls loadCart() with data returned
 * from backend.
 */ 
const getProductData = (url) => {
    const xhr = new XMLHttpRequest();
   
    xhr.open("GET", url, true);
    xhr.responseType = "json";
    
    xhr.onload = () => {
        if (xhr.readyState === 4) {
            const kanapProduct = xhr.response;
            loadCart(kanapProduct);
        }
    };
    xhr.send(null); 
}

/**
 * Below are functions called to display shopping cart of current session.
 * loadCart()
 * addPurchasesfromStorage()
 * displayCart()
 * addCartArticleElem()
 */


/**
 * function loadCart()
 * @param {*} jsonObj
 * @constant kanapCart
 * Nested loops are used to analyze color options for each product and build
 * a list of possible purchases stored in global array kanapCart.
 * The list is initialised with the quantity of purchases set to zero in total.
 * loadCart() then calls functions addPurchasesFromStorage() and displayCart().
 */
function loadCart(jsonObj){
    const kanapProducts = jsonObj;
    let kanapCartOpt = [];
    for ( var i = 0; i < kanapProducts.length; i++ ){
        for ( var c = 0; c < kanapProducts[i].colors.length; c++ ) {
            kanapCartOpt.push(kanapProducts[i].colors[c]);
            kanapCartOpt.push(kanapProducts[i]._id);
            kanapCartOpt.push(kanapProducts[i].name);
            kanapCartOpt.push(kanapProducts[i].price);
            kanapCartOpt.push(kanapProducts[i].imageUrl);
            kanapCartOpt.push(kanapProducts[i].description);
            kanapCartOpt.push(kanapProducts[i].altTxt);
            kanapCartOpt.push("0");
            kanapCart.push(kanapCartOpt);
            kanapCartOpt = [];
        }    
     }
    addPurchasesFromStorage(kanapCart);
    displayCart(kanapCart);
}

/**
 * function addPurchasesFromStorage()
 * @param {*} cartObject
 * @var purchase
 * @var purchasesMade
 * The purpose is to process data in session storage regarding quantity of purchased articles.
 * The first loop uses the split method of the string object to create 
 * from each storage key an array, purchase.  It pushes the value in each key onto this array.
 * The inner loop compares the value in purchase[2] to the zero values in list, kanapCart, and
 * if a difference is found the value in storage is reassigned to the list by calling function 
 * editQtyKanapCart().
 * A counter, purchasesMade, keeps a total of articles purchased to be used as a parameter when function
 * editPurchasesMade() is called by addPurchasesFromStorage().
 */
function addPurchasesFromStorage(cartObject) {
    let kanapCart = cartObject;
    let purchasesMade = 0;   // counter

    for ( k = 0; k < sessionStorage.length; k++ ){
        const purchase = sessionStorage.key(k).split('@');
        purchase.push(sessionStorage.getItem(sessionStorage.key(k)));
        for ( var i = 0; i < kanapCart.length; i++) {
            if ( kanapCart[i][2] === purchase[0]  && kanapCart[i][0].toLowerCase() === purchase[1] ){
                editQtyKanapCart(i, purchase[2]);
                purchasesMade += purchase[2]*1;
            }
        }
    }
    editPurchasesMade(purchasesMade, kanapCart);  // displays total articles and price in Euros
}

/**
 * function displayCart()
 * @param {*} purchases
 * After list kanapCart is initialised by loadCart() and modified by addPurchasesFromStorage(), this
 * function iterates through the list finding purchases when quantities are listed.  It calls a function with
 * data needed to display purchases on the cart.html page.
 */
function displayCart(purchases){
    for (p = 0; p < purchases.length; p++){
        let article = purchases[p];
        if (article[7] > 0){
            addCartArticleElem(article[1], article[0], article[4], article[6], article[2], article[3], article[7]);
        }
    }
}

/**
 * function addCartArticleElem()
 * @param {*} productID 
 * @param {*} productClor 
 * @param {*} imageUrl 
 * @param {*} imgAlt 
 * @param {*} productName 
 * @param {*} productPrice 
 * @param {*} productQty
 * It is called multiple times if more than one article or articles in different colors are selected
 * by the user from the product page. This function appends numerous elements and corresponding
 * attributes to the DOM. It requires many assignment statements to process data from calling function, 
 * displayCart().
 * Two event listeners give the user options to modify quantites purchased or delete an item after selection.
 */
function addCartArticleElem(productID, productColor, imageUrl, imgAlt, productName, productPrice, productQty){
    const productView = document.getElementById('cart__items');
    const productArticle = document.createElement('article');
    
    function appendItemImage(){
        productArticle.classList.add('cart__item');
        const articleDataID = document.createAttribute('data-id');
        articleDataID.value = productID;
        const articleDataColor = document.createAttribute('data-color');
        articleDataColor.value = productColor;
        productArticle.setAttributeNode(articleDataID);
        productArticle.setAttributeNode(articleDataColor);
        const imgDiv = document.createElement('div');
        imgDiv.classList.add('cart__item__img');
        const articleImg = document.createElement('img');
        const articleImgSrc = document.createAttribute('src');
        const articleImgAlt = document.createAttribute('alt');
        articleImgSrc.value = imageUrl;
        articleImgAlt.value = imgAlt;
        articleImg.setAttributeNode(articleImgSrc);
        articleImg.setAttributeNode(articleImgAlt);
        imgDiv.append(articleImg);
        productArticle.append(imgDiv);
    }
    function appendItemContent(){
        const contentDiv = document.createElement('div');
        contentDiv.classList.add('cart__item__content');
        const contentDescDiv = document.createElement('div');
        contentDescDiv.classList.add('cart__item__content__description');
        const cartProductHdr = document.createElement('h2');
        cartProductHdr.innerText = productName;
        const cartProductColor = document.createElement('p');
        cartProductColor.innerText = productColor;
        const cartProductPrice = document.createElement('p');
        cartProductPrice.innerText = `€ ${productPrice}`;
        contentDescDiv.append(cartProductHdr);
        contentDescDiv.append(cartProductColor);
        contentDescDiv.append(cartProductPrice);
        contentDiv.append(contentDescDiv);
        const contentSettingsDiv = document.createElement('div');
        contentSettingsDiv.classList.add('cart__item__content__settings');
        const contentSetQtyDiv = document.createElement('div');
        contentSetQtyDiv.classList.add('cart__item__content__settings__quantity');
        const contentSetQtyP = document.createElement('p');
        contentSetQtyP.innerText = `Qté : ${productQty}`;
        const contentSetQtyInput =  document.createElement('input');
        contentSetQtyInput.classList.add('itemQuantity');
        const contentSetQtyTypeAttr = document.createAttribute('type');
        contentSetQtyTypeAttr.value = 'number';
        const contentSetQtyNameAttr = document.createAttribute('name');
        contentSetQtyNameAttr.value = 'itemQuantity';
        const contentSetQtyMinAttr = document.createAttribute('min');
        contentSetQtyMinAttr.value = '0';
        const contentSetQtyMaxAttr = document.createAttribute('max');
        contentSetQtyMaxAttr.value = '100';
        const contentSetQtyValAttr = document.createAttribute('value');
        contentSetQtyValAttr.value = productQty;
        contentSetQtyInput.setAttributeNode(contentSetQtyTypeAttr);
        contentSetQtyInput.setAttributeNode(contentSetQtyNameAttr);
        contentSetQtyInput.setAttributeNode(contentSetQtyMinAttr);
        contentSetQtyInput.setAttributeNode(contentSetQtyMaxAttr);
        contentSetQtyInput.setAttributeNode(contentSetQtyValAttr);
        contentSetQtyDiv.append(contentSetQtyP);
        contentSetQtyDiv.append(contentSetQtyInput);
        const contentSetDelDiv = document.createElement('div');
        contentSetDelDiv.classList.add('cart__item__content__settings__delete');
        const contentSetDelP = document.createElement('p');
        contentSetDelP.innerText = 'Delete';
        contentSetDelDiv.append(contentSetDelP);
        contentSettingsDiv.append(contentSetQtyDiv);
        contentSettingsDiv.append(contentSetDelDiv);
        contentDiv.append(contentSettingsDiv);
        productArticle.append(contentDiv);
        deleteButtonHandler(contentSetDelP);
        quantityButtonHandler(contentSetQtyInput, contentSetQtyP);
    }
    appendItemContent()
    appendItemImage();
    productView.append(productArticle);

    function deleteButtonHandler(deleteButton) {
        deleteButton.addEventListener('click', () => {
            productArticle.remove();
            let productKey = productName + '@' + productColor.toLowerCase();
            if ( productColor.indexOf('/') > 0 ) {
                productKey = productName + '@' + productColor.split('/')[0].toLowerCase() + '/' + productColor.split('/')[1].toLowerCase();
            }
            sessionStorage.removeItem(productKey);
            deletePurchasesTotal(productQty, productPrice);
            for ( var i = 0; i < kanapCart.length; i++) {  // find deleted product in kanapCart list and reset quantity value to 0  
                if ( kanapCart[i][2] === productName  && kanapCart[i][0] === productColor ) {
                    editQtyKanapCart(i, 0);  
                }                            
            }
        });
    }

    function quantityButtonHandler(quantityButton, quantityParagraphElem){
        quantityButton.addEventListener('change',  ($event) => {
            quantityButton.value = $event.target.value;
            productQty = quantityButton.value;
            quantityParagraphElem.innerText = `Qté : ${productQty}`;
            let productKey = productName + '@' + productColor.toLowerCase();
            if ( productColor.indexOf('/') > 0 ) {
                productKey = productName + '@' + productColor.split('/')[0].toLowerCase() + '/' + productColor.split('/')[1].toLowerCase();
            }
            sessionStorage.setItem( productKey, productQty );
            if ( productQty == 0 ){
                sessionStorage.removeItem(productKey);  // before order submission remove keys from session storage when value = 0
            }
            addPurchasesFromStorage(kanapCart);
        });
    }
}

function editPurchasesMade(purchasesMade, cartObject){
    const cartPriceIndex = 3;
    totalQuantity = document.getElementById('totalQuantity');
    totalPrice = document.getElementById('totalPrice');
    if ( purchasesMade === 0){
        totalQuantity.innerText = purchasesMade;
        totalPrice.innerText = purchasesMade;
    } else {
        let kanapCart = cartObject;
        let addPrices = 0;
        for ( var i = 0; i < kanapCart.length; i++) {
            let itemPurchases = kanapCart[i][cartPriceIndex + 4];
            if ( itemPurchases > 0 ){
                addPrices += kanapCart[i][cartPriceIndex] * itemPurchases;
            }
        }
        totalQuantity.innerText = purchasesMade;
        totalPrice.innerText = addPrices;
    }
}

function deletePurchasesTotal(minusQty, minusPrice){
    totalQuantity = document.getElementById('totalQuantity');
    totalPrice = document.getElementById('totalPrice');
    purchasesMade = totalQuantity.innerText;
    addPrices = totalPrice.innerText;
    totalQuantity.innerText = purchasesMade - minusQty;
    totalPrice.innerText = addPrices - ( minusPrice * minusQty );
}

function editQtyKanapCart(cartIndex, qty){
    let i = cartIndex;
    kanapCart[i].pop();
    kanapCart[i].push(qty);
}

function getStorageData() {  // debugging function
    if (sessionStorage.length === 0){console.log('Session storage is empty.')};
    for ( k = 0; k < sessionStorage.length; k++){
        console.log(`${sessionStorage.key(k)} : ${sessionStorage.getItem(sessionStorage.key(k))}`);
    }
}

/**
 * anonymous immediately executing function initiates main 
 * thread by calling
 * getProductData()
 * displayInputForm()
 * processSubmitEvent()
 * and declares apiPost object to store 
 * user inputs in a private scope 
 */
(function (){ 

    
    const submitErrorMsgs = {
        firstName: "Please input a valid first name.",
        lastName: "Please input a valid last name.",
        address: "Please input a valid shipping address.",
        city: "Please input a valid shipping address.",
        email: "Please input a valid email address."
    } 
    const submitErrorRegEx = {
        firstName:'^[0-9a-zA-Z]+$',
        lastName:'^[0-9a-zA-Z]+[-]*[0-9a-zA-Z]+$',
        address: '^(?:[0-9 ]+[A-Z][a-z.-]+[ ]?)+[A-Za-z.0-9 ]*$',
        city: '^(?:[A-Z][a-z,.-]+[ ]?)+[A-Za-z.0-9 ]*$',
        email: '^[A-Za-z0-9_]+@([A-Za-z])+[.]{1}([a-z]){2,3}$'
    }

    
    let apiPost = {};  // initalize POST request object to submit with two properties
    let contactObject = {};     //  contactObject and productTable
    let productTable = [];
    
    // call global function to display shopping cart of current session
    getProductData(kanapAPI);

    // contactObject properties are input nodes of cart.html document
	for ( prop in submitErrorMsgs) {
		contactObject[prop] = '';
	}


    
    /**
     * Below are functions called to display a form allowing users to input customer data.  The
     * functions also validate the data and when an order is submitted functions 
     * respond by posting data to the application backend.
     * displayInputForm()
     * submitCart()
     * validateContactPost()
     * validateProductPost()
     * submitRequest()
     * submitKanapOrder()
     * processSubmitEvent()
     */

    /**
     * function displayInputForm()
     * iterates through five input fields of cart.html adding elements needded to assist
     * users and capture input data as properties of contactObject
     */
    const displayInputForm = () => {
        const errorMessages = submitErrorMsgs;
        const errorRegEx = submitErrorRegEx;

        Object.keys(errorMessages).forEach((inputName) => {  // outer loop iterates through child elements of div.cart__order__form__question
            let contacts = {};  // new undefined object will have one property when initialised for each input node
            stringID = "ErrorMsg";
            let idAttr = `${inputName}${stringID}`;
            let errMsgParagraph = document.getElementById(idAttr);
            errMsgStyle = document.createAttribute('style');
            errMsgParagraph.setAttributeNode(errMsgStyle);
            errMsgParagraph.style = 'visibility:hidden;';    // inline css
            errMsgParagraph.innerText = errorMessages[inputName];
            let kanapFormInput = document.getElementById(inputName);
    
            if (typeof(kanapFormInput.value) === 'string' && kanapFormInput.value !== ""){  // load saved value on page refresh
                contactObject[inputName] = kanapFormInput.value;
            } 
            kanapFormInput.addEventListener('input',  ($event) => {  // empty text input field
                let inputStr = $event.target.value;
                if (inputStr.match(errorRegEx[inputName]) ) {   // initialise contact property 
                    errMsgParagraph.style = 'visibility:hidden;';
                    contacts[inputName] = inputStr;             // assign value input by user if it matches regex and hide error 
                } else {
                    errMsgParagraph.style = 'visibility:visible;';
                    contacts[inputName] = "";                   // else assign empty string and show error message
                }
                Object.keys(contactObject).forEach((inputName) => {  // inner loop iterates through properties of contactObject
                    if ((contacts[inputName] !== "" ) && (typeof(contacts[inputName]) === 'string')){  // contacts contains input field data
                        contactObject[inputName] = contacts[inputName];  // assign value to contactObjact property when input field contains valid data  
                    }
                });
            });
        })
    }

    const submitCart = (customerOrder) => {
        let counter = 0;
        for (p = 0; p < customerOrder.length; p++){
            let article = customerOrder[p];
            if (article[7] > 0){
                productTable[counter] = article[1];  //  fill productTable array with orders
                counter++;
            }
        }
    }

    const validateContactPost = (contactData) => {
        Object.keys(submitErrorRegEx).forEach((inputName) => {
            if (contactData[inputName].match(submitErrorRegEx[inputName])){
                true;
            }else{
                alert("Could not submit order. Please correct field:  " + inputName + ",");
                return false;
            }
        }) 
        return true;
    }

    const validateProductPost = (productData) => {
        if ( productData.length === sessionStorage.length && productData.length > 0){
            true;
        }else{
            alert("Could not submit order. If you have deleted a selection please refresh the page.");
            return false;
        }
        return true;
    }

    const submitRequest = (data) => {
        return new Promise((resolve, reject) => {
            let request = new XMLHttpRequest();
            request.open('POST', `${kanapAPI}/order`);
            request.onreadystatechange = () => {
                if (request.readyState === 4) {
                    if (request.status === 201){
                        resolve(JSON.parse(request.response));
                    }else{
                        reject(JSON.parse(request.response));
                    }
                }
            };
            request.setRequestHeader('Content-Type', 'application/json');
            request.send(JSON.stringify(data));
        })
    }

    const submitKanapOrder = async (post) => {
        try {
            const kanapRequestPromise = submitRequest(post);
            const transactResult = await kanapRequestPromise ;
            let orderId = JSON.stringify(transactResult.orderId);
            const redirectString = `confirmation.html?id=${orderId}`
            sessionStorage.clear();
            window.location.href = redirectString;
        } catch (errorResponse) {
            console.error(errorResponse);
            return false;
        }
    }

    /**
     * function processSubmitEvent() handles submit button clicks.
     * It calls function submitCart()  to build productTable then prepares an object
     * to post according to specifications of kanap backend. If 
     * validity of data can be verified the object is posted calling async function 
     * submitKanapOrder()
     */
    const processSubmitEvent = () => {
        kanapOrderInput = document.getElementById('order');  // submit button, "Commander!"
        kanapOrderInput.addEventListener('click', ($event) => {
            $event.preventDefault();
            submitCart(kanapCart);  
            apiPost.contact = contactObject;
            apiPost.products = productTable;   
            if ( ( productTable.length > 0 ) && (validateContactPost(apiPost.contact) === true) && (validateProductPost(apiPost.products) === true) ){
                submitKanapOrder(apiPost);
            }
        });
    }

    // call functions to collect, process and submit user data
    displayInputForm();
    processSubmitEvent();

})()
    