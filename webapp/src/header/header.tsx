import React from 'react';
import { Link } from 'react-router-dom';
import '.././styles.css';

const Header = () => {
  return (
    <header>
      <div className="container">
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
          <button className="menu-btn" aria-label="toggle menu">
            <span>Menu</span>
            <span>•••</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;