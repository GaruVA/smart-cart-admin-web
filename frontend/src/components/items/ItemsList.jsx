// src/components/items/ItemsList.jsx
import React, { useState, useEffect } from 'react';

// Using mock data for initial development
const mockItems = [
  { id: '8901234567890', name: 'Apple', category: 'Fruits', price: 2.99, stockQuantity: 150, description: 'Fresh red apples' },
  { id: '8901234567891', name: 'Milk', category: 'Dairy', price: 3.49, stockQuantity: 75, description: '1 gallon whole milk' },
  { id: '8901234567892', name: 'Bread', category: 'Bakery', price: 2.50, stockQuantity: 50, description: 'Whole wheat bread' },
  { id: '8901234567893', name: 'Chicken', category: 'Meat', price: 7.99, stockQuantity: 30, description: 'Boneless chicken breast' },
  { id: '8901234567894', name: 'Rice', category: 'Grains', price: 4.99, stockQuantity: 100, description: 'Basmati rice 2kg' }
];

const ItemsList = ({ onViewDetail, onAddNew, onEditItem, onDeleteItem }) => {
  // States for items, filtering, sorting
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  const [categories, setCategories] = useState([]);
  
  // Load items on component mount
  useEffect(() => {
    // In future this would be an API call
    setItems(mockItems);
    setFilteredItems(mockItems);
    
    // Extract categories for filter dropdown
    const uniqueCategories = [...new Set(mockItems.map(item => item.category))];
    setCategories(uniqueCategories);
  }, []);
  
  // Apply filters when search or category changes
  useEffect(() => {
    let results = items;
    
    if (searchTerm) {
      results = results.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.includes(searchTerm)
      );
    }
    
    if (categoryFilter) {
      results = results.filter(item => item.category === categoryFilter);
    }
    
    // Apply current sort
    results = sortItems(results);
    setFilteredItems(results);
  }, [searchTerm, categoryFilter, items, sortConfig]);
  
  // Handle sorting
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const sortItems = (itemsToSort) => {
    return [...itemsToSort].sort((a, b) => {
      const key = sortConfig.key;
      if (a[key] < b[key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
  };
  
  return (
    <div className="items-list">
      {/* Filter Section */}
      <div className="items-filters">
        <select 
          className="status-filter" 
          value={categoryFilter} 
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        
        <input
          type="text"
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        
        <button 
          className="btn btn-outline-secondary"
          onClick={clearFilters}
        >
          Clear Filters
        </button>
      </div>
      
      {/* Items Table */}
      <div className="items-table">
        <table className="table">
          <thead>
            <tr>
              <th onClick={() => requestSort('id')}>
                Barcode ID {sortConfig.key === 'id' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
              </th>
              <th onClick={() => requestSort('name')}>
                Name {sortConfig.key === 'name' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
              </th>
              <th onClick={() => requestSort('category')}>
                Category {sortConfig.key === 'category' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
              </th>
              <th onClick={() => requestSort('price')}>
                Price {sortConfig.key === 'price' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
              </th>
              <th onClick={() => requestSort('stockQuantity')}>
                Stock {sortConfig.key === 'stockQuantity' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length > 0 ? (
              filteredItems.map(item => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>${item.price.toFixed(2)}</td>
                  <td className={item.stockQuantity < 10 ? 'low-stock' : ''}>
                    {item.stockQuantity}
                  </td>
                  <td className="action-buttons">
                    <button onClick={() => onViewDetail(item.id)} className="btn btn-sm btn-info">View</button>
                    <button onClick={() => onEditItem(item.id)} className="btn btn-sm btn-warning">Edit</button>
                    <button onClick={() => {
                      if (window.confirm(`Are you sure you want to delete ${item.name}?`)) {
                        onDeleteItem(item.id);
                      }
                    }} className="btn btn-sm btn-danger">Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">No items found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ItemsList;