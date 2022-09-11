const confirmURL = this.location;
const kanapConfirm = new URLSearchParams(confirmURL.search);
const kanapConfirmID = kanapConfirm.get('id');

const kanapConfirmField = document.getElementById('orderId');
kanapConfirmField.innerText = kanapConfirmID;