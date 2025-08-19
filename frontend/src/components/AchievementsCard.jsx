import React, { useState } from 'react';
import './AchievementsCard.css';
import PopUpModal from './PopUpModal';

import { FaTrophy, FaPaperPlane, FaLeaf } from 'react-icons/fa';
import { SiSurveymonkey } from "react-icons/si";
import { IoCheckmarkCircleOutline } from "react-icons/io5";

const achievements = [
  {
    name: "Big Five Spotter",
    desc: "Detected all Big Five animals",
    rank: "LEGENDARY",
    icon: <FaTrophy color="#FFD600" size={28} />,
    borderColor: "#FFD600",
    status: <IoCheckmarkCircleOutline color="#4caf50" size={28} />
  },
  {
    name: "Bird Watcher",
    desc: "Identified 20 different bird species",
    rank: "COMMON",
    icon: <FaPaperPlane color="#6fdc8c" size={25} />,
    borderColor: "#6fdc8c",
    status: <IoCheckmarkCircleOutline color="#4caf50" size={28} />
  },
  {
    name: "Primate Observer",
    desc: "Detected 5 primate species",
    rank: "UNCOMMON",
    icon: <SiSurveymonkey color="#4fa3ff" size={28} />,
    borderColor: "#4fa3ff",
    status: <IoCheckmarkCircleOutline color="#4caf50" size={28} />
  },
  {
    name: "Environmental Guardian",
    desc: "Reported 10 environmental issues",
    rank: "RARE",
    icon: <FaLeaf color="#b36fff" size={28} />,
    borderColor: "#b36fff",
    status: <IoCheckmarkCircleOutline color="#4caf50" size={28} />
  },
];

const AchievementsCard = () => {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div className="achievements-card">
      <div className="achievements-header">
        <span className="achievements-title">Achievements</span>
        <span className="achievements-progress">12/22 (55%)</span>
      </div>
      <div className="achievement-list">
        {achievements.map((ach, idx) => (
          <div className="achievement-item" key={idx}>
            <div className="achievement-icon" style={{
              borderColor: ach.borderColor,
              boxShadow: `0 0 0 4px ${ach.borderColor}33`,
            }}>
              {ach.icon}
            </div>
            <div className="achievement-details">
              <div className="achievement-name">{ach.name}</div>
              <div className="achievement-desc">{ach.desc}</div>
              <div className="achievement-rank" style={{
                color: ach.rank === "LEGENDARY" ? "#FFD600" : 
                        ach.rank === "RARE" ? "#b36fff" : 
                        ach.rank === "UNCOMMON" ? "#4fa3ff" : 
                        "#6fdc8c"
              }}>{ach.rank}</div>
            </div>
            <div className="achievement-status">{ach.status}</div>
          </div>
        ))}
      </div>
      <div 
        className='acheivements-viewAll'
        onClick={() => setShowPopup(true)}
      >
        <span className='achievements-viewAll-text' style={{Color:"ff6b00", fontSize:"11pt", marginRight:"20"}}>
          View All Achievements →
        </span>
      </div>
      <PopUpModal 
        show={showPopup} 
        onClose={() => setShowPopup(false)}
      />
    </div>
  );
};

export default AchievementsCard;