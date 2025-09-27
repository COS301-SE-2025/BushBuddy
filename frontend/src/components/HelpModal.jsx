import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HelpModal.css';
import { FaRegQuestionCircle } from 'react-icons/fa';

const HelpModal = ({ show, onClose, helpText }) => {
  const navigate = useNavigate();
  if (!show) return null;

  return (
    <div className="help-modal-overlay" onClick={onClose}>
      <div className="help-modal" onClick={(e) => e.stopPropagation()}>
        <div className="help-header">
            <h2>Help <FaRegQuestionCircle style={{transform: 'translateY(0.22rem)'}}></FaRegQuestionCircle></h2>
            <button className="help-close-btn" onClick={onClose}>×</button>
        </div>
        <div className="help-content">
            {Array.isArray(helpText)
            ? helpText.map((p, i) => <p key={i}>{p}</p>)
            : <p>{helpText}</p>}
          <br />
          <p style={{ fontWeight: 'bold' }}>
            Helpfull Links:
          </p>
          <button className="help-link" onClick={() => window.open("https://github.com/COS301-SE-2025/AI-Powered-African-Wildlife-Detection/wiki/User-Manual")}>
            User Manual
          </button>
          <br/>
          {/* <button className="help-link" onClick={() => alert("FAQs")}>FAQs</button>
          <br/> */}
          <button className="help-link" onClick={() => window.open("https://github.com/COS301-SE-2025/AI-Powered-African-Wildlife-Detection?tab=readme-ov-file#readme", "_blank")}>
            README
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
