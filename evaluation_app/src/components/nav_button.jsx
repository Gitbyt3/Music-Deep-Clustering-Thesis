import { useNavigate, useLocation } from 'react-router-dom';
import './nav_button.css';
import React from 'react'

function PageNavigation({ onNavigate }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Define your page order
  const pageOrder = [
    '/',
    '/demo',
    '/music',
    '/emotion',
    '/outline',
    '/input1',
    '/output1',
    '/input2',
    '/output2',
    '/outro'
  ];

  // Get current page index
  const currentIndex = pageOrder.indexOf(location.pathname);

  // Calculate next and previous paths
  const nextPage = currentIndex < pageOrder.length - 1 ? pageOrder[currentIndex + 1] : null;
  const prevPage = currentIndex > 0 ? pageOrder[currentIndex - 1] : null;

  return (
    <div className="page-navigation">
      {prevPage && (
        <button 
          onClick={() => navigate(prevPage)}
          className="nav-button prev-button"
        >
          ← Previous Page
        </button>
      )}
      
      {nextPage && (
        <button 
          onClick={() => {
            if (onNavigate) onNavigate();
            navigate(nextPage)}}
          className="nav-button next-button"
        >
          Next Page →
        </button>
      )}
    </div>
  );
}

export default PageNavigation;