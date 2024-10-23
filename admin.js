// Function to toggle between sections (View Orders / Manage Orders)
function toggleManageOrders() {
  const ordersContainer = document.getElementById('ordersContainer');
  ordersContainer.innerHTML = ''; // Clear the orders container
  fetchOrders('manage'); // Fetch orders for Manage Orders section
}


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
