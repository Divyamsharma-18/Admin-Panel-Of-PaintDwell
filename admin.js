// Fetch orders and render them
async function fetchOrders(section) {
  try {
    const response = await fetch('https://paintdwell-backend.onrender.com/api/orders');
    const orders = await response.json();
    
    const ordersContainer = document.getElementById('ordersContainer');
    ordersContainer.innerHTML = ''; // Clear previous orders

    orders.forEach(order => {
      const orderElement = document.createElement('div');
      orderElement.innerHTML = `
        <h3>Order by ${order.name}</h3>
        <p>Address: ${order.address}, ${order.city}, ${order.zip}</p>
        <p>Phone: ${order.phone}</p>
        <p>Total Price: ${order.totalPrice}</p>
        <h4>Cart Items:</h4>
        <ul>
          ${order.cartItems.map(item => `<li>${item.name} - ${item.quantity}</li>`).join('')}
        </ul>
        ${section === 'manage' ? `
          <button onclick="completeOrder('${order._id}')">Complete</button>
          <button onclick="cancelOrder('${order._id}')">Cancel</button>
          <button onclick="deleteOrder('${order.name}', '${order.phone}')">Delete</button>
        ` : ''}
      `;

      ordersContainer.appendChild(orderElement);
    });
  } catch (error) {
    console.error('Failed to fetch orders:', error);
  }
}

// Complete an order
async function completeOrder(orderId) {
  try {
    const response = await fetch(`https://paintdwell-backend.onrender.com/api/orders/${orderId}/complete`, { method: 'PATCH' });
    if (response.ok) {
      alert('Order completed successfully!');
      toggleManageOrders(); // Refresh orders list
    } else {
      console.error('Failed to complete order');
    }
  } catch (error) {
    console.error('Failed to complete order:', error);
  }
}

// Cancel an order
async function cancelOrder(orderId) {
  try {
    const response = await fetch(`https://paintdwell-backend.onrender.com/api/orders/${orderId}/cancel`, { method: 'PATCH' });
    if (response.ok) {
      alert('Order cancelled successfully!');
      toggleManageOrders(); // Refresh orders list
    } else {
      console.error('Failed to cancel order');
    }
  } catch (error) {
    console.error('Failed to cancel order:', error);
  }
}

// Delete an order
// Delete an order based on name and phone number
async function deleteOrder(orderName, orderPhone) {

    // Show confirmation popup
    const isConfirmed = window.confirm("Are you sure you want to delete this order?");
  
    // Proceed only if the user confirms
    if (!isConfirmed) {
      return; // If user clicks "Cancel", do nothing
    }
  try {
    const response = await fetch('https://paintdwell-backend.onrender.com/api/orders/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: orderName, phone: orderPhone })
    });

    if (!response.ok) {
      throw new Error('Failed to delete order');
    }

    const result = await response.json();
    console.log(result.message); // Log success message

    // Optionally, remove the order from the UI after deletion
    const orderElement = document.getElementById(orderPhone); // Assuming each order has a phone as ID
    if (orderElement) {
      orderElement.remove();
    }
  } catch (error) {
    console.error('Error deleting order:', error);
  }
}


// Fetch user info and render it
async function fetchUserInfo() {
  try {
    const response = await fetch('https://paintdwell-backend.onrender.com/api/orders');
    const orders = await response.json();
    
    const usersContainer = document.getElementById('usersContainer');
    usersContainer.innerHTML = ''; // Clear previous user info

    // Use a Set to keep track of unique users
    const usersSet = new Set();

    orders.forEach(order => {
      // Create a unique identifier for each user
      const userIdentifier = `${order.name}-${order.phone}`;
      if (!usersSet.has(userIdentifier)) {
        usersSet.add(userIdentifier);
        
        const userElement = document.createElement('div');
        userElement.innerHTML = `
          <h3 class='userName'>User: ${order.name}</h3>
          <p class='userAdd'>Address: ${order.address}, ${order.city}, ${order.zip}</p>
          <p class='userPhone'>Phone: ${order.phone}</p>
        `;

        usersContainer.appendChild(userElement);
      }
    });
  } catch (error) {
    console.error('Failed to fetch user info:', error);
  }
}

// Add an event listener for the user info button
document.getElementById('user-info-btn').addEventListener('click', fetchUserInfo);


// Toggle Orders view
function toggleManageOrders() {
  const ordersContainer = document.getElementById('ordersContainer');
  const usersContainer = document.getElementById('usersContainer');

  ordersContainer.style.display = 'block';  // Show orders
  usersContainer.style.display = 'none';     // Hide user info

  fetchOrders(); // Fetch and display orders
}

// Toggle User Info view
function toggleUserInfo() {
  const ordersContainer = document.getElementById('ordersContainer');
  const usersContainer = document.getElementById('usersContainer');

  ordersContainer.style.display = 'none';    // Hide orders
  usersContainer.style.display = 'block';     // Show user info

  fetchUserInfo(); // Fetch and display user info
}

// Attach event listeners
document.getElementById('manage-orders-btn').addEventListener('click', toggleManageOrders);
document.getElementById('user-info-btn').addEventListener('click', toggleUserInfo);
