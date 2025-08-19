import React from 'react';
import './PopUpModal.css';

const HelpModal = ({ show, onClose, popupText }) => {
  if (!show) return null;
  
  const popHeading = "WOAH, slow down! :)";

  return (
    <div className="popup-modal-overlay" onClick={onClose}>
      <div className="popup-modal" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
            <h2>{popHeading}</h2>
            <button className="popup-close-btn" onClick={onClose}>×</button>
        </div>
        <div className="popup-content">
            <p>
              {
                popupText != null
                  ? popupText
                  : `Unfortunately that feature, along with many others, 
                    are still to come in future versions of BushBuddy`
              }
            </p>
          <br />
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
