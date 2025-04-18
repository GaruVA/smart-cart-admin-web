import React from 'react';
import AdminLayout from '../layouts/AdminLayout';

const ItemsPage = () => {
  return (
    <AdminLayout>
      <div className="items-page">
        <div className="items-header">
          <h2>Items Management</h2>
          <button className="btn btn-primary">Add New Item</button>
        </div>
        
        <div className="items-filters">
          <input type="text" placeholder="Search items..." className="search-input" />
          <select className="category-filter">
            <option value="">All Categories</option>
            <option value="fruits">Fruits</option>
            <option value="vegetables">Vegetables</option>
            <option value="dairy">Dairy</option>
            <option value="bakery">Bakery</option>
          </select>
        </div>
        
        <div className="items-table-container">
          <table className="items-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock Quantity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Apple</td>
                <td>Fruits</td>
                <td>$1.99</td>
                <td>150</td>
                <td>
                  <button className="btn-edit">Edit</button>
                  <button className="btn-delete">Delete</button>
                </td>
              </tr>
              <tr>
                <td>Milk</td>
                <td>Dairy</td>
                <td>$3.49</td>
                <td>45</td>
                <td>
                  <button className="btn-edit">Edit</button>
                  <button className="btn-delete">Delete</button>
                </td>
              </tr>
              <tr>
                <td>Bread</td>
                <td>Bakery</td>
                <td>$2.29</td>
                <td>30</td>
                <td>
                  <button className="btn-edit">Edit</button>
                  <button className="btn-delete">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="pagination">
          <button>&lt;</button>
          <span>Page 1 of 5</span>
          <button>&gt;</button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ItemsPage;