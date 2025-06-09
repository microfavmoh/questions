request("trash.svg");
request("add-to-cart.svg");
request("back-arrow.svg");
class perfume {
    constructor(perfume_image, perfume_name, perfume_price, num_requested, description){
        this.perfume_image = perfume_image;
        this.perfume_name = perfume_name;
        this.perfume_price = perfume_price;
        this.num_requested = num_requested;
        this.description = description;
    }
}
let current_page_main = document.querySelector("main");
let cart_button = document.querySelector("svg");
let cart_text = cart_button.querySelector("text");
let num_items_cart = 0;
let cart = {};
let browsing_history = [];
let perfumes_data = {1 : new perfume("perfume.webp", "example perfume", 200, 1, "smells like lavender"), 2 : new perfume("red-perfume.png", "other example perfume", 300, 1, "smells like popies")};
for (id in perfumes_data){
    current_page_main.innerHTML += `<div class = "perfume" id = ${id}><img src = ${perfumes_data[id].perfume_image} onclick = "open_perfume_page(this)"><p onclick = "open_perfume_page(this)">${perfumes_data[id].perfume_name}</p><p><b>${perfumes_data[id].perfume_price} EGP</b><p></div>`
}
function add_to_cart(node) {
    var id = +(node.parentNode.parentNode.id);
    num_items_cart++;
    cart_num_modifier();
    (id in cart)? cart[id].num_requested++ : cart[id] = Object.assign({}, perfumes_data[id]);    
    fetch(window.location.href, {
        method: "POST",
        credentials: "include",
        body: id.toString()
    });
}
function view_cart() {
    browsing_history.unshift(current_page_main.innerHTML);
    current_page_main.innerHTML = "";
    if (!num_items_cart) {
        current_page_main.innerHTML = `<p style = "color: #808080">Your cart is empty</p>`;
    }
    else {
        for (id in cart) {
            const cart_item = cart[id];
            current_page_main.innerHTML += `<div class = 'cart-pefume' id = ${id}><div><img src = ${cart_item.perfume_image} onclick = "open_perfume_page(this)"></div><div class = "cart-perfume-details"><p>${cart_item.perfume_name}</p><input type = "number" min = "1" value = ${cart_item.num_requested} class  = "requested-number" onchange = "cart_modifier(this)"><br><br><button class = "buy-button" onclick = "buy(this)">buy perfume</button><b>${cart_item.num_requested * cart_item.perfume_price} EGP</b><img class = "delte-from-cart" src = "trash.svg" onclick = "delete_from_cart(this)"></div></div>`;
        }
    }
    current_page_main.innerHTML += `<div class = "back-button"><img src = "back-arrow.svg" onclick = "close_cart()"></div>`;
    current_page_main.innerHTML += (Object.keys(cart).length > 1)?  `<button id = "checkout">buy all</button>` : ""; 
    cart_button.onclick = close_cart;
}
function close_cart() {
    back();
    cart_button.onclick = view_cart;
}
function delete_from_cart(node) {
    var cart_item = node.parentNode.parentNode;
    var id = cart_item.id;
    num_items_cart -= cart[id].num_requested;
    cart_num_modifier();
    delete cart[id];
    cart_item.remove();
    if (Object.keys(cart).length == 1) {
        current_page_main.querySelector("#checkout").remove();
    }
    else if (!Object.keys(cart).length) {
        current_page_main.innerHTML = `<p style = "color: #808080">Your cart is empty</p>`;
    }
}
function open_perfume_page(node) {
    browsing_history.unshift(current_page_main.innerHTML);
    var id = (node.parentNode.hasAttribute("id"))? node.parentNode.id : node.parentNode.parentNode.id;
    current_page_main.innerHTML = `<div class = "back-button"><img src = "back-arrow.svg" onclick = "back()"></div><div class = "perfume-picture"><img src = ${perfumes_data[id].perfume_image}></div><div class = "perfume-details" id = ${id}><h2>${perfumes_data[id].perfume_name}</h2><h3>${perfumes_data[id].description}</h3><div class = "add-to-cart"><img src = "add-to-cart.svg" onclick = "add_to_cart(this)"></div><button class = "buy-button" onclick = "buy(this)">buy perfume</button><b><p>${perfumes_data[id].perfume_price} EGP</p></b></div>`
}
function buy(node) {
    
    //use perfumes_data[node.parentNode.id] to actually buy the thing
}
function buy_all() {
    // add code to buy
}
function back() {
    current_page_main.innerHTML = browsing_history.shift()
}
function cart_modifier(node) {
    var id = node.parentNode.parentNode.id;
    if (+(node.value)) {
        var num_requested = +(node.value) - cart[id].num_requested;
        var cart_item_price = node.parentNode.querySelector("b");
        cart_item_price.innerText = `${(num_requested + cart[id].num_requested) * cart[id].perfume_price} EGP`;
        num_items_cart +=  num_requested;
        cart_num_modifier();
        cart[id].num_requested += num_requested;
    }
}
function cart_num_modifier() {
    if (num_items_cart) {
        if (num_items_cart > 99) {
            cart_text.innerHTML = "99+"
            cart_text.setAttribute("x", 8);
            cart_text.setAttribute("font-size", 8);
        }
        else {
            cart_text.innerHTML = num_items_cart;
            cart_text.setAttribute("x", 9);
            cart_text.setAttribute("font-size", 9);
        }
    }
    else {
        cart_text.innerHTML = "";
    }
}