document.addEventListener("DOMContentLoaded", () => {
  const cartItems = [];
  const cartItemsElement = document.getElementById("cartItems");
  const totalPriceElement = document.getElementById("totalPrice");
  const saveToFavoritesButton = document.getElementById(
    "saveToFavoritesButton"
  );
  const applyFavoritesButton = document.getElementById("applyFavoritesButton");
  const buyNowButton = document.getElementById("buyNowButton");

  function updateCart() {
    cartItemsElement.innerHTML = "";
    let totalPrice = 0;
    cartItems.forEach((item) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${item.product}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>${item.quantity} ${item.unit}</td>
                <td>$${(item.price * item.quantity).toFixed(2)}</td>
            `;
      cartItemsElement.appendChild(row);
      totalPrice += item.price * item.quantity;
    });
    totalPriceElement.textContent = `Total: $${totalPrice.toFixed(2)}`;
  }

  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", () => {
      const product = button.dataset.product;
      const price = parseFloat(button.dataset.price);
      const unit = button.dataset.unit;
      const quantityInput = document.getElementById(
        product.toLowerCase().replace(/ /g, "-")
      );
      let quantity;

      // Determine quantity based on data-unit
      if (unit === "kg") {
        quantity = parseFloat(quantityInput.value); // Use float for kg
      } else if (unit === "quantity") {
        quantity = parseInt(quantityInput.value, 10); // Use int for quantity
      }

      // Validation
      if (isNaN(quantity) || quantity <= 0) {
        alert("Please enter a valid quantity.");
        quantityInput.value = ""; // Clear the input
        return;
      }

      // Add to cart
      const existingItemIndex = cartItems.findIndex(
        (item) => item.product === product
      );
      if (existingItemIndex !== -1) {
        cartItems[existingItemIndex].quantity += quantity;
      } else {
        cartItems.push({ product, price, quantity, unit });
      }
      updateCart();

      alert(
        `${quantity} ${unit} of ${product} added to the cart! press "ok" to confirm order!`
      );
      quantityInput.value = "";
    });
  });

  saveToFavoritesButton.addEventListener("click", () => {
    localStorage.setItem("favorites", JSON.stringify(cartItems));
    alert("Favourites saved!");
  });

  applyFavoritesButton.addEventListener("click", () => {
    const favorites = JSON.parse(localStorage.getItem("favorites"));
    if (favorites) {
      cartItems.length = 0;
      favorites.forEach((item) => cartItems.push(item));
      updateCart();
    } else {
      alert("No favourites found.");
    }
  });

  buyNowButton.addEventListener("click", () => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    window.location.href = "payment.html";
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const cart = JSON.parse(localStorage.getItem("cartItems")) || [];
  const orderTableBody = document.querySelector("#orderTable tbody");
  let orderTotal = 0;

  cart.forEach((item) => {
    const row = document.createElement("tr");
    const itemTotal = item.price * item.quantity;
    row.innerHTML = `
            <td>${item.product}</td>
            <td>${item.quantity} ${item.unit}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>$${itemTotal.toFixed(2)}</td>
        `;
    orderTableBody.appendChild(row);
    orderTotal += itemTotal;
  });

  document.getElementById(
    "orderTotalPrice"
  ).textContent = `$${orderTotal.toFixed(2)}`;
});

function pay() {
  const name = document.getElementById("name").value;
  const address = document.getElementById("address").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const postalCode = document.getElementById("postal-code").value;
  const cardNumber = document.getElementById("card-number").value;
  const expirationDate = document.getElementById("expiration-date").value;
  const cvv = document.getElementById("cvv").value;
  const tier = document.getElementById("tier").value;
  const termsAccepted = document.getElementById("terms").checked;

  if (
    name &&
    address &&
    email &&
    phone &&
    postalCode &&
    cardNumber &&
    expirationDate &&
    cvv &&
    tier !== "" &&
    termsAccepted
  ) {
    alert(
      `Thank you for your purchase, ${name}! Your order will be delivered by ${new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      ).toLocaleDateString()}.`
    );

    localStorage.removeItem("cartItems");

    window.location.href = "index.html";
  } else {
    alert("Please fill in all fields and accept the terms and conditions.");
  }
}

function pay() {
  const tier = document.getElementById("tier").value;
  let totalPriceText = document.getElementById("orderTotalPrice").textContent;

  // Gets rid of the lkr in the price so the calculation could work
  totalPriceText = totalPriceText.replace(/[^0-9.]/g, "");

  let totalPrice = parseFloat(totalPriceText);

  if (isNaN(totalPrice)) {
    alert("Error: Invalid total price value.");
    return;
  }

  switch (tier) {
    case "green":
      totalPrice *= 0.85; // 15% off
      break;
    case "gold":
      totalPrice *= 0.8; // 20% off
      break;
    case "platinum":
      totalPrice *= 0.6; // 40% off
      break;
    default:
      // No discount for 'none'
      break;
  }

  alert("Total price after discount: LKR " + totalPrice.toFixed(2));
  alert(
    "The Package will be dilivered to your doorstep within two working days"
  );
  // Continue with payment processing here
}
