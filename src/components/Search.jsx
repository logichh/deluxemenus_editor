import React, { useState } from 'react';
import { getTextureBase64, getAllTextures } from '../utils/textureLoader';
import './SearchModal.css';

const Search = ({ onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [showItems, setShowItems] = useState(true);
  const [showBlocks, setShowBlocks] = useState(true);
  const [sortOrder, setSortOrder] = useState('name');
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 54; // 9x6 Minecraft inventory layout

  // Get icon for an item
  const getItemIcon = (name) => {
    if (!name) return null;
    const icon = getTextureBase64(name);
    return icon ? `data:image/png;base64,${icon}` : null;
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    // Filter items based on search term and show/hide toggles
    let filtered = getAllTextures()
      .filter(name => {
        const isBlock = name.includes('block') || name.includes('stairs') || name.includes('slab');
        if (!showItems && !isBlock) return false;
        if (!showBlocks && isBlock) return false;
        return name.includes(term);
      })
      .map(name => ({
        name: name.toUpperCase(),
        displayName: name.split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' '),
        icon: getItemIcon(name),
        isBlock: name.includes('block') || name.includes('stairs') || name.includes('slab')
      }));
    
    // Sort items
    if (sortOrder === 'name') {
      filtered.sort((a, b) => a.displayName.localeCompare(b.displayName));
    } else if (sortOrder === 'type') {
      filtered.sort((a, b) => {
        if (a.isBlock === b.isBlock) return a.displayName.localeCompare(b.displayName);
        return a.isBlock ? 1 : -1;
      });
    }
    
    setFilteredItems(filtered);
    setCurrentPage(0);
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <div className="search-modal">
      <div className="search-header">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search items and blocks..."
          className="search-input"
        />
        <span className="search-count">
          {filteredItems.length} items found
        </span>
      </div>

      <div className="search-controls">
        <div className="filter-toggles">
          <label>
            <input
              type="checkbox"
              checked={showItems}
              onChange={(e) => {
                setShowItems(e.target.checked);
                handleSearch({ target: { value: searchTerm } });
              }}
            />
            Show Items
          </label>
          <label>
            <input
              type="checkbox"
              checked={showBlocks}
              onChange={(e) => {
                setShowBlocks(e.target.checked);
                handleSearch({ target: { value: searchTerm } });
              }}
            />
            Show Blocks
          </label>
          <select 
            value={sortOrder} 
            onChange={(e) => {
              setSortOrder(e.target.value);
              handleSearch({ target: { value: searchTerm } });
            }}
          >
            <option value="name">Sort by Name</option>
            <option value="type">Sort by Type</option>
          </select>
        </div>
        
        <div className="items-stats">
          Showing {paginatedItems.length} of {filteredItems.length} items (Page {currentPage + 1} of {totalPages})
        </div>
      </div>

      <div className="search-container">
        <div className="items-grid">
          {paginatedItems.map((item, index) => (
            <div
              key={index}
              className="grid-item"
              onClick={() => onSelect(item)}
            >
              <img
                src={item.icon}
                alt={item.displayName}
                onError={(e) => {
                  const fallbackIcon = getTextureBase64('stone');
                  e.target.src = fallbackIcon ? `data:image/png;base64,${fallbackIcon}` : '';
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="pagination-controls">
        <button onClick={() => setCurrentPage(0)} disabled={currentPage === 0}>
          First
        </button>
        <button onClick={() => setCurrentPage(p => Math.max(0, p - 1))} disabled={currentPage === 0}>
          Previous
        </button>
        <button onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))} disabled={currentPage === totalPages - 1}>
          Next
        </button>
        <button onClick={() => setCurrentPage(totalPages - 1)} disabled={currentPage === totalPages - 1}>
          Last
        </button>
      </div>
    </div>
  );
};

export default Search; 