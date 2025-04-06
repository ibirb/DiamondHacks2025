// frontend/src/components/SideNavBar.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './SideNavBar.css';

function SideNavBar({ onToggle }) {
  const [isExpanded, setIsExpanded] = useState(false); // Start collapsed
  const [showExpandIcon, setShowExpandIcon] = useState(true);

  const toggleNavBar = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    onToggle(isExpanded);
    setShowExpandIcon(!isExpanded);
  }, [isExpanded, onToggle]);

  return (
    <>
      {showExpandIcon && (
        <button className="expand-nav-button" onClick={toggleNavBar}>
          {'>'}
        </button>
      )}
      <div className={`side-nav-bar ${isExpanded ? 'expanded' : 'collapsed'}`}>
        <button className="nav-toggle-button" onClick={toggleNavBar}>
          {'<'}
        </button>
        <nav className={isExpanded ? 'expanded-nav' : 'collapsed-nav'}>
          <ul>
            <li>
              <Link to="/dashboard">
                <span className="nav-link-text">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link to="/expenses">
                <span className="nav-link-text">Expenses</span>
              </Link>
            </li>
            <li>
              <Link to="/finance">
                <span className="nav-link-text">Finance</span>
              </Link>
            </li>
            <li>
              <Link to="/chatbot">
                <span className="nav-link-text">Chat Bot</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}

export default SideNavBar;
