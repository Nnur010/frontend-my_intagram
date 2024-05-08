import React, { useEffect } from 'react';
import './ProfileDropDown.css';
import firebaseApp from '../Firebase';
import { getAuth, signOut} from "firebase/auth";
import { Link } from 'react-router-dom';

const auth = getAuth(firebaseApp);

const ProfileDropDown = (props) => {
  const { 
    setDropDownOpen,
    setIsProfileAnimating,
    isProfileAnimating,
    openDropDown, 
    userData 
  } = props;

  const logOut = async () => {
    await signOut(auth);
  }

  const animateDropDown = () => {
    if (!isProfileAnimating) {
      setIsProfileAnimating(true);
    };
  };

  const hideDropDown = () => {
    if (isProfileAnimating) {
      setDropDownOpen(false);
    };
  };

  useEffect(() => {
    window.addEventListener('click', animateDropDown);
    return () => {
      window.removeEventListener('click', animateDropDown);
      setIsProfileAnimating(false);
    };
  }, []);

  return (
    <React.Fragment>
    <div 
      className={
        isProfileAnimating
          ? 'profile-drop-down animate'
          : 'profile-drop-down'
      }
      onAnimationEnd = {hideDropDown}
    >
      <div className='drop-down-triangle'></div>
      <div className='profile-buttons-wrapper'>
        <Link to={`/${userData.displayName}/`} className='profile-button'>
          <div className='profile-text-icon'>
            <svg aria-label="Profile" className="profile-drop-down-svg" color="#262626" fill="#262626" height="16" role="img" viewBox="0 0 24 24" width="16">
              <circle cx="12.004" cy="12.004" fill="none" r="10.5" stroke="currentColor" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="2"></circle>
              <path d="M18.793 20.014a6.08 6.08 0 00-1.778-2.447 3.991 3.991 0 00-2.386-.791H9.38a3.994 3.994 0 00-2.386.791 6.09 6.09 0 00-1.779 2.447" fill="none" stroke="currentColor" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="2"></path>
              <circle cx="12.006" cy="9.718" fill="none" r="4.109" stroke="currentColor" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="2"></circle>
            </svg>
            <div className='profile-text'>Profile</div>
          </div>
        </Link>
        <div className='log-out-button' onClick={logOut}>
          <div className='log-out-text-icon'>
            <div className='log-out-text'>Log Out</div>
          </div>
        </div>
      </div>
      
    </div>      
    </React.Fragment>

  )
};

export default ProfileDropDown;