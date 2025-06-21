import { useNavigate, useLocation } from 'react-router-dom';
import './nav_button.css';
import React from 'react'

function PageNavigation({ onNavigate, isLoading = false, nextDisabled = false }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Define your page order
  const pageOrder = [
    '/',
    '/outline',
    '/input1',
    '/output1',
    '/input2',
    '/output2',
    '/demo',
    '/music',
    '/emotion',
    '/outro'
  ];

  // Get current page index
  const currentIndex = pageOrder.indexOf(location.pathname);

  // Calculate next and previous paths
  const nextPage = currentIndex < pageOrder.length - 1 ? pageOrder[currentIndex + 1] : null;
  const prevPage = currentIndex > 0 ? pageOrder[currentIndex - 1] : null;

  const handleNextClick = async () => {
    try {
      if (onNavigate) {
        await onNavigate()
      }
      navigate(nextPage)
    }
    catch (error) {
      console.error('Navigation failed', error)
    }
  }

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
          onClick={handleNextClick}
          className="nav-button next-button"
          disabled={isLoading || nextDisabled}
        >
          {isLoading ? 'Loading...' : 'Next Page →'}
        </button>
      )}
    </div>
  );
}

export default PageNavigation;