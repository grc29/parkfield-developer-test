import "./scss/style.scss";

// Loop Products Function
function loopProducts(products) {
  products.forEach(product => {
    let newSticker = "";
    // Add New Sticker Element
    if (product.isNew == true) {
      newSticker = `<div class='img-circle'>New!</div>`;
    }
    // Add Sale Sticker Element
    let saleSticker = "";
    if (product.originalPrice != "") {
      let percentOff = Math.round(
        100 * (1 - product.price / product.originalPrice)
      );
      saleSticker = `<div class='img-circle'>Save<br>${percentOff}%</div>`;
    }
    // Add Circle Elements
    let circles = "";
    product.colors.forEach(color => {
      if (color == product.defaultColor) {
        circles += `<div class='color-circle ${color} activeColor'></div>`;
      } else {
        circles += `<div class='color-circle ${color}'></div>`;
      }
    });
    // Add Price Elements
    let prices = "";
    if (product.originalPrice == "") {
      prices = `$${product.price}`;
    } else {
      prices = `<span class='original-price'>$${product.originalPrice}</span>$${
        product.price
      }`;
    }
    // Product Layout
    $("#product-grid").append(`<div class='product-item' id=${product.id}>
            <div class='product-img'>
             <img src=${product.url} />
             ${saleSticker}${newSticker}
            </div>
            <div class='color-row'>
            ${circles}
            </div>
            <p class='product-title'>${product.title}</p>
            <div class='price-row'>${prices}</div>
          </div>`);
  });
}

// On Load
$(document).ready(() => {
  let productsData = new Array();
  // Get Products Data
  let populateProducts = $.getJSON(
    "https://young-refuge-33420.herokuapp.com/"
  ).done(data => {
    // Get Products Array
    let products = data.products;
    // Get Products Data
    products.forEach(product => {
      // Get Product ID
      let id = product.id;
      // Check if New
      let isNew = false;
      if (product.tags.indexOf("new") != -1) {
        isNew = true;
      }
      // Get Title
      let title = product.title;
      // Get Colors
      let colors = new Array();
      product.variants.forEach(variant => {
        colors.push(variant.title);
      });
      // Get Default Color
      let defaultColor = colors[0];
      // Get Default Price
      let price,
        originalPrice = "";
      if (product.variants[0].compare_at_price > product.variants[0].price) {
        price = product.variants[0].price;
        originalPrice = product.variants[0].compare_at_price;
      } else {
        price = product.variants[0].price;
      }
      // Get Default Image ID
      let variantImageID = product.variants[0].image_id;
      let image = product.images.filter(image => {
        return image.id == variantImageID;
      });
      let url = image[0].src;
      productsData.push({
        id,
        isNew,
        title,
        colors,
        defaultColor,
        price,
        originalPrice,
        url
      });
    });
    // Populate Products
    loopProducts(productsData);
  });

  populateProducts.always(() => {
    $(".color-circle").click(data => {
      let id;
      console.log(data);
    });
  });
});
