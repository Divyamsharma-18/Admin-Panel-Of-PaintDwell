// Function to toggle the view of the orders section
function toggleOrders() {
    const viewOrdersSection = document.getElementById('view-orders');
    viewOrdersSection.style.display = viewOrdersSection.style.display === 'none' ? 'block' : 'none';
    if (viewOrdersSection.style.display === 'block') {
        fetchOrders(); // Ensure this is being called
    }
}



// Function to fetch orders from the backend
async function fetchOrders() {
    try {
      const response = await fetch('http://localhost:3000/api/orders');
      const orders = await response.json();
      
      // Display orders
      const ordersContainer = document.getElementById('ordersContainer');
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
        `;
        ordersContainer.appendChild(orderElement);
      });
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  }
  
  // Call fetchOrders when admin page loads
  window.onload = fetchOrders;
  

// Call fetchOrders when appropriate
document.getElementById('refresh-orders-btn').addEventListener('click', fetchOrders);


// Function to display the orders in the table
function displayOrders(orders) {
    const tbody = document.querySelector('#view-orders tbody');
    tbody.innerHTML = ''; // Clear previous orders
    
    orders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${order._id}</td>
            <td>${order.name}</td>
            <td>${order.productName || 'N/A'}</td> 
            <td>${order.quantity || 'N/A'}</td> 
            <td>${order.status || 'Pending'}</td>
        `;
        tbody.appendChild(row);
    });
}







