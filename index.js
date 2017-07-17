
// Get the modal
var modal = document.getElementById("colorSelector");

// When the user clicks on the 'x' button, close the modal
var closeButton = document.getElementsByClassName("close")[0];

var buyButton = document.getElementById("buyButton");

var base = "red";
var trim = "blue";
var inside = "yellow";

var walletPrice = 16;

var componentToChangeColor = "";

var checkoutButtonWasPressed = false;

var colorHexCodes = {
  'red'   : '#ED6A64',
  'blue'  : '#5E99C5',
  'yellow': '#EEBD7E'
}


document.getElementById("blueColor").addEventListener("click", function() {
  changeColor("blue")
}, false);

document.getElementById("redColor").addEventListener("click", function() {
  changeColor("red")
}, false);

document.getElementById("yellowColor").addEventListener("click", function() {
  changeColor("yellow")
}, false);

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
      closeModal();
  }
}

document.onkeydown = function(evt) {
    evt = evt || window.event;
    if (evt.keyCode == 27) {
        closeModal();
    }
};

function changeColor(color) {
  switch (componentToChangeColor) {
    case "base":
      base = color;
      break;
    case "trim":
      trim = color;
      break;
    case "inside":
      inside = color;
      break;
  }

  var images = document.getElementsByClassName("front_" + componentToChangeColor);
  for (var i=0; i<images.length; i++) {
    images[i].src="images/" + componentToChangeColor + "_" + color + ".png";
  }

  if (componentToChangeColor == 'base') {
    var images = document.getElementsByClassName("back_base");
    images[0].src = "images/back_" + color + ".png";
  }

  updateBuyButton();
}

function updateBuyButton() {
  $('#buyButton').data('item-custom1-value', base);
  $('#buyButton').data('item-custom2-value', trim);
  $('#buyButton').data('item-custom3-value', inside);

  $('#currentCart').text("Current cart: " + (walletPrice * Snipcart.api.items.all().length) + "$");
}

function openModal(target) {
  modal.style.display = "block";
  closeButton.innerHTML = target.charAt(0).toUpperCase() + target.slice(1) + " Color &times;";
  componentToChangeColor = target;
}

function closeModal() {
  modal.style.display = "none";
}

function trimClick() {
  openModal("trim");
}

function baseClick() {
  openModal("base");
}

function insideClick() {
  openModal("inside");
}

Snipcart.execute('config', 'show_continue_shopping', true);

Snipcart.subscribe('item.adding', function(ev, item, items) {
  item.description = base + '-' + trim + '-' + inside;

  item.image = drawWallet(0.4,0.4).toDataURL();

  $('#walletsCartDisplay').prepend(drawWallet(0.2,0.2));
  //document.getElementById('cartDisplay').insertBefore(drawWallet(0.2,0.2),document.getElementById('currentCart').nextSibling);
  $('#currentCart').text("Current cart: " + (walletPrice * (Snipcart.api.items.all().length + 1)) + "$");
  window.alet
});

Snipcart.subscribe('item.removed', function() {
  $('#currentCart').text("Current cart: " + (walletPrice * Snipcart.api.items.all().length) + "$");
  updateCheckoutCart();
});

function drawWallet(scale) {
  var canvas = document.createElement('canvas');
  canvas.width = "" + Math.round(scale * 720);
  canvas.height = "" + Math.round(scale * 271);

  var ctx = canvas.getContext('2d');

  ctx.scale(scale, scale);

  // Draw base
  ctx.fillStyle = colorHexCodes[base];
  ctx.fillRect(0,0,720,271);

  // Draw trim
  ctx.fillStyle = colorHexCodes[trim];
  ctx.fillRect(15,38,329,22)
  ctx.fillRect(15,68,329,22);
  ctx.fillRect(15,98,329,22);
  ctx.fillRect(369,33,329,16);

  //Draw inside
  ctx.fillStyle = colorHexCodes[inside];
  ctx.fillRect(369,49,329,178);


  /*var baseImg = new Image();
  baseImg.onload = function() {
    ctx.drawImage(baseImg, 0, 0);
  }
  baseImg.src = 'images/base_' + base + '.png';

  var trimImg = new Image();
  trimImg.onload = function() {
    ctx.drawImage(trimImg, 0, 0);
  }
  trimImg.src = 'images/trim_' + trim + '.png';

  var insideImg = new Image();
  insideImg.onload = function() {
    ctx.drawImage(insideImg, 0, 0);
  }
  insideImg.src = 'images/inside_' + inside + '.png';*/

  return canvas;
}

function checkout() {
  checkoutButtonWasPressed = true;
  Snipcart.api.modal.show();
}

document.getElementById('checkoutButton').onclick = checkout;


Snipcart.subscribe('cart.opened', function (item) {
  if (!checkoutButtonWasPressed) {
    Snipcart.api.modal.close();
    return;
  }

  checkoutButtonWasPressed = false;
});

function updateCheckoutCart() {
  $('#cartDisplay canvas').remove();

  var tempBase = base;
  var tempTrim = trim;
  var tempInside = inside;

  var items = Snipcart.api.items.all();
  for (var i = 0; i < items.length; i++){
    var item = items[i];

    base = item.customFields[0]['value'];
    trim = item.customFields[1]['value'];
    inside = item.customFields[2]['value'];
    $('#walletsCartDisplay').prepend(drawWallet(0.2,0.2));
  }
  base = tempBase;
  trim = tempTrim;
  inside = tempInside;
}


Snipcart.subscribe('cart.ready', function() {
  updateBuyButton();

  updateCheckoutCart();

});
