import React, { useState } from 'react';
import './FeedFilters.css';
import PopUpModal from './PopUpModal';

import { IoMdArrowDropdown } from "react-icons/io";
import { IoMdPaw, IoMdWarning } from "react-icons/io";
import { GiElephant, GiDeerTrack } from "react-icons/gi";
import { FaShieldAlt } from "react-icons/fa";
import { PiBirdFill } from "react-icons/pi";


const FeedFilters = () => {
  const [showPopup, setShowPopup] = useState(false);

  const filterOptions = ['Friends', 'Following', 'Nearby', 'Popular'];
  const [selectedFilter, setSelectedFilter] = useState('Friends');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState('all');

  const animalFilters = [
    { type: 'all', icon: <IoMdPaw size={25} />, color: '#FF6B35' },
    { type: 'elephant', icon: <GiElephant size={25} />, color: '#4CAF50' },
    { type: 'lion', icon: <IoMdWarning size={25} />, color: '#FF9800' },
    { type: 'rhino', icon: <FaShieldAlt size={25} />, color: '#2196F3' },
    { type: 'antelope', icon: <GiDeerTrack size={27} />, color: '#cb35e6ff' },
    { type: 'bird', icon: <PiBirdFill size={25} />, color: '#00BCD4' }
  ];

  return (
    <div className="filters-container">
      <div className="filters-column">
        {/* <div className="dropdown-filter">
          <div className="select-wrapper">
            <select
              value={selectedFilter}
              onChange={(e) => {
                setSelectedFilter(e.target.value);
                setIsDropdownOpen(false);
              }}
              className="dropdown-select"
              onFocus={() => setIsDropdownOpen(true)}
              onBlur={() => setIsDropdownOpen(false)}
            >
              {filterOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <span className={`filter-icon ${isDropdownOpen ? 'rotate' : ''}`}>
              <IoMdArrowDropdown size={22} color="white" />
            </span>
          </div>
        </div> */}
        
        <div className="animal-filters">
          {animalFilters.map((animal) => (
            <button
              key={animal.type}
              className={`animal-filter ${selectedAnimal === animal.type ? 'active' : 'all'}`}
              onClick={() => {
                setSelectedAnimal(animal.type);
                setShowPopup(true);
              }}
              style={{ 
                backgroundColor: selectedAnimal === animal.type ? animal.color : '#4b6949ff',
                color: selectedAnimal === animal.type ? 'white' : animal.color
              }}
            >
              <span className="animal-icon" style={{ 
                color: selectedAnimal === animal.type ? 'white' : animal.color 
              }}>
                {React.cloneElement(animal.icon, {
                  color: selectedAnimal === animal.type ? 'white' : animal.color
                })}
              </span>
            </button>
          ))}
        </div>
      </div>
      <PopUpModal 
        show={showPopup} 
        onClose={() => setShowPopup(false)}
      />
    </div>
  );
};

export default FeedFilters;