import React, { useState, useEffect } from 'react';
import './App.css';


const ConfirmModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Are you sure you want to remove this product?</h2>
        <button onClick={onConfirm}>Yes</button>
        <button onClick={onClose}>No</button>
      </div>
    </div>
  );
};

const InventoryApp = () => {
  const [inventory, setInventory] = useState(
    JSON.parse(localStorage.getItem('inventory')) || []
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductIndex, setSelectedProductIndex] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [users, setUsers] = useState(JSON.parse(localStorage.getItem('users')) || []);

  
  useEffect(() => {
    localStorage.setItem('inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  
  const handleRegister = (e) => {
    e.preventDefault();

    
    if (users.find((user) => user.username === username)) {
      alert('Username already exists.');
      return;
    }

   
    const newUser = { username, password };
    setUsers([...users, newUser]);

    alert('Registration successful. Please log in.');
    setIsRegistering(false); 
  };

  // Login as the user
  const handleLogin = (e) => {
    e.preventDefault();

    // Check if username and password match the one registered
    const user = users.find(
      (user) => user.username === username && user.password === password
    );

    if (user) {
      setLoggedIn(true);
      alert('Login successful!');
    } else {
      alert('Invalid credentials');
    }
  };

  // Logout as the user
  const handleLogout = () => {
    setLoggedIn(false);
    setUsername('');
    setPassword('');
  };

  // Removing a product
  const removeProduct = (index) => {
    setSelectedProductIndex(index);
    setIsModalOpen(true);
  };

  // Confirmation for product removal
  const handleConfirmRemove = () => {
    const updatedInventory = [...inventory];
    updatedInventory.splice(selectedProductIndex, 1);
    setInventory(updatedInventory);
    setIsModalOpen(false);
  };

 
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Add your new product
  const handleAddProduct = (product) => {
    setInventory([...inventory, product]);
  };

  // Handle form submission for adding a product
  const handleSubmit = (e) => {
    e.preventDefault();

    const name = e.target.name.value.trim();
    const description = e.target.description.value.trim();
    const category = e.target.category.value.trim();
    const price = parseFloat(e.target.price.value);
    const quantity = parseInt(e.target.quantity.value);

    // Input validation
    if (!name || !description || !category || isNaN(price) || isNaN(quantity) || price <= 0 || quantity <= 0) {
      alert('Please provide valid input for all fields.');
      return;
    }

    const newProduct = { name, description, category, price, quantity };
    handleAddProduct(newProduct);
    e.target.reset();
  };

  // Total value of the inventory
  const getTotalInventoryValue = () => {
    return inventory.reduce((total, product) => total + product.price * product.quantity, 0).toFixed(2);
  };

  // Total number of products in the inventory
  const getTotalProducts = () => {
    return inventory.length;
  };

  return (
    <div className="dashboard-container">
      {/* code for user registration */}
      {!loggedIn && !isRegistering ? (
        <div className="login-container">
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Login</button>
            <p>
              Don't have an account?{' '}
              <button type="button" onClick={() => setIsRegistering(true)}>
                Register here
              </button>
            </p>
          </form>
        </div>
      ) : isRegistering ? (
        // User Registration Form
        <div className="register-container">
          <h2>Register</h2>
          <form onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Register</button>
            <p>
              Already have an account?{' '}
              <button type="button" onClick={() => setIsRegistering(false)}>
                Login here
              </button>
            </p>
          </form>
        </div>
      ) : (
        // Dashboard after login
        <>
          <div className="dashboard-header">
            <h1>Inventory Dashboard</h1>
            <button onClick={handleLogout}>Logout</button>
          </div>

          <div className="dashboard-content">
            <div className="stats">
              <div className="stat-card">
                <h3>Total Products</h3>
                <p>{getTotalProducts()}</p>
              </div>
              <div className="stat-card">
                <h3>Total Inventory Value</h3>
                <p>M {getTotalInventoryValue()}</p>
              </div>
            </div>

            <div className="product-form">
              <h3>Add New Product</h3>
              <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Product Name" required />
                <textarea name="description" placeholder="Product Description" required></textarea>
                <input type="text" name="category" placeholder="Category" required />
                <input type="number" name="price" placeholder="Price" required min="0" />
                <input type="number" name="quantity" placeholder="Quantity" required min="1" />
                <button type="submit">Add Product</button>
              </form>
            </div>

            <div id="inventory-grid">
              {inventory.map((product, index) => (
                <div className="inventory-card" key={index}>
                  <h3>{product.name}</h3>
                  <p className="description">{product.description}</p>
                  <p className="price">M {product.price.toFixed(2)}</p>
                  <p className="quantity">{product.quantity} units</p>
                  <button onClick={() => removeProduct(index)}>Remove</button>
                </div>
              ))}
            </div>

            <ConfirmModal isOpen={isModalOpen} onClose={handleCloseModal} onConfirm={handleConfirmRemove} />
          </div>
        </>
      )}
    </div>
  );
};

export default InventoryApp;
