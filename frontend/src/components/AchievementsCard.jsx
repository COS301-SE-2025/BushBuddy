import React, { useState, useEffect } from 'react';
import './AchievementsCard.css';
import PopUpModal from './PopUpModal';

import { FaTrophy, FaLeaf } from 'react-icons/fa';
import { SiSurveymonkey } from "react-icons/si";
import { IoMdPaw } from "react-icons/io";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { GiLion, GiElephant, GiDeerTrack, GiFoxTail } from "react-icons/gi";
import { SightingsController } from "../controllers/SightingsController";

const achievements = [
  {
    key: "antelopes",
    name: "Antelope Master",
    desc: "Identified 10 different antelope species",
    rank: "COMMON",
    icon: <GiDeerTrack color="#6fdc8c" size={25} />,
    borderColor: "#6fdc8c"
  },
  {
    key: "predators",
    name: "Predator Tracker",
    desc: "Detected 5 predator species",
    rank: "UNCOMMON",
    icon: <GiLion color="#4fa3ff" size={28} />,
    borderColor: "#4fa3ff"
  },
  {
    key: "small_mammals",
    name: "Little Wonders",
    desc: "Detected 10 small & medium mammal species",
    rank: "UNCOMMON",
    icon: <FaLeaf color="#4fa3ff" size={28} />,
    borderColor: "#4fa3ff"
  },
  {
    key: "big_five",
    name: "Big Five",
    desc: "Detected all Big Five animals",
    rank: "LEGENDARY",
    icon: <IoMdPaw color="#FFD600" size={28} />,
    borderColor: "#FFD600"
  },
  {
    key: "all",
    name: "Complete Collection",
    desc: "Detect all species",
    rank: "LEGENDARY",
    icon: <FaTrophy color="#FFD600" size={28} />,
    borderColor: "#FFD600"
  },
];

const AchievementsCard = () => {
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [userAchievements, setUserAchievements] = useState(null);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        setLoading(true);
        const response = await SightingsController.handleFetchUserAchievements();
        if (response.success) {
          setUserAchievements(response.achievements);
        } else {
          console.error(response.message);
        }
      } catch (err) {
        console.error("Error fetching achievements:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  return (
    <div className="achievements-card">
      {loading ? (
        <div className="stats-loader-wrapper">
          <div className="stats-loader"></div>
        </div>
      ):(
        <>
          {userAchievements && (
            <>
              <div className="achievements-header">
                <span className="achievements-title">Achievements</span>
                <span className="achievements-progress">{userAchievements.total_completed}/{userAchievements.total} ({Math.round((userAchievements.total_completed / userAchievements.total) * 100, 2)}%)</span>
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
                    <div className="achievement-status">
                      <div className="circular-progress" style={{
                        background: `conic-gradient(${ach.borderColor} ${(userAchievements[ach.key] / userAchievements[`${ach.key}_amount`]) * 360}deg, rgba(255,255,255,0.1) 0deg)`
                      }}>
                        <span className="progress-text">
                          {userAchievements[ach.key]}/{userAchievements[`${ach.key}_amount`]}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
      {/*<div 
        className='acheivements-viewAll'
        onClick={() => setShowPopup(true)}
      >
        <span className='achievements-viewAll-text' style={{Color:"ff6b00", fontSize:"11pt", marginRight:"20"}}>
          View All Achievements →
        </span>
      </div> */}
      <PopUpModal 
        show={showPopup} 
        onClose={() => setShowPopup(false)}
      />
    </div>
  );
};

export default AchievementsCard;