import './App.css';
import React, { useState, useEffect } from 'react';
import { Slot } from './slot';
import { getAllItems } from './utils/textureLoader';

const ITEMS_PER_PAGE = 55; // Show 55 items per page (11 columns x 5 rows)

export function Search({ onSelect }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState([]);
  const [showBlocks, setShowBlocks] = useState(true);
  const [showItems, setShowItems] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [sortOrder, setSortOrder] = useState('name'); // 'name' or 'type'

  useEffect(() => {
    try {
      console.log('Search component - Loading items...');
      // Get all items from our texture loader
      const allItems = getAllItems();
      
      console.log('Search component - Loaded items:', {
        totalCount: allItems.length,
        blocks: allItems.filter(item => item.isBlock).length,
        items: allItems.filter(item => !item.isBlock).length,
        sampleItem: allItems[0]
      });
      
      setItems(allItems.map(item => ({
        ...item,
        searchName: item.name.toLowerCase(),
        // The icon is already a base64 string, just need to add the data URL prefix if it's not there
        icon: item.icon.startsWith('data:') ? item.icon : `data:image/png;base64,${item.icon}`
      })));
    } catch (error) {
      console.error('Error loading items:', error);
      setItems([]);
    }
  }, []);

  // Filter and sort items
  const filteredItems = items.filter(item => {
    const matchesSearch = !searchTerm || 
      item.searchName.includes(searchTerm.toLowerCase()) ||
      item.displayName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = (showBlocks && item.isBlock) || (showItems && !item.isBlock);
    return matchesSearch && matchesType;
  }).sort((a, b) => {
    if (sortOrder === 'type') {
      // Sort by type first, then by name
      if (a.isBlock !== b.isBlock) {
        return a.isBlock ? 1 : -1;
      }
    }
    return a.displayName.localeCompare(b.displayName);
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const paginatedItems = filteredItems.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm, showBlocks, showItems, sortOrder]);

  return (
    <div className="search-container">
      <div className="search-controls">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search items and blocks..."
          className="search-input"
        />
        <div className="filter-toggles">
          <label>
            <input
              type="checkbox"
              checked={showItems}
              onChange={(e) => setShowItems(e.target.checked)}
            />
            Show Items
          </label>
          <label>
            <input
              type="checkbox"
              checked={showBlocks}
              onChange={(e) => setShowBlocks(e.target.checked)}
            />
            Show Blocks
          </label>
          <select 
            value={sortOrder} 
            onChange={(e) => setSortOrder(e.target.value)}
            className="sort-select"
          >
            <option value="name">Sort by Name</option>
            <option value="type">Sort by Type</option>
          </select>
        </div>
      </div>

      <div className="items-stats">
        Showing {paginatedItems.length} of {filteredItems.length} items 
        (Page {currentPage + 1} of {totalPages || 1})
      </div>

      <div className="items-grid">
        {paginatedItems.map((item, index) => (
          <Slot
            key={`${item.name}-${index}`}
            icon={item.icon}
            lore={item.displayName}
            onClick={() => onSelect(item)}
            isSearch={true}
            isBlock={item.isBlock}
          />
        ))}
      </div>

      <div className="pagination-controls">
        <button
          onClick={() => setCurrentPage(0)}
          disabled={currentPage === 0}
        >
          First
        </button>
        <button
          onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
          disabled={currentPage === 0}
        >
          Previous
        </button>
        <span className="page-info">
          Page {currentPage + 1} of {totalPages || 1}
        </span>
        <button
          onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
          disabled={currentPage === totalPages - 1}
        >
          Next
        </button>
        <button
          onClick={() => setCurrentPage(totalPages - 1)}
          disabled={currentPage === totalPages - 1}
        >
          Last
        </button>
      </div>
    </div>
  );
}

