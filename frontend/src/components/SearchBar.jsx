import React from 'react';
import { FaSearch } from 'react-icons/fa';
import './SearchBar.css';

const SearchBar = () => {
  return (
    <div className="search-container">
      <div className="search-bar">
        <FaSearch style={{
          size:"13",
          color:"rgba(255,255,255,0.7)",
          marginRight: "12px",
          marginLeft: "12px" 
        }}/>
        <input
          type="text"
          placeholder="Search Sightings"
          className="search-input"
          style={{
          }}
        />
      </div>
    </div>
  );
};

export default SearchBar;