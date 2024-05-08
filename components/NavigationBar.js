import './NavigationBar.css'
import navigationLogo from '../images/navigation-logo.png';
import defaultProfileImage from '../images/default-profile-image.jpg';
import { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ProfileDropDown from './ProfileDropDown';
import SearchDropDown from './SearchDropDown';
import ActivityPopUp from './ActivityPopUp';
import ActivtiyDropDown from './ActivityDropDown';

const NavigationBar = (props) => {
  const {
    isActivityLoading,
    getNotifications,
    userNotifications,
    setIsNotificationsNotRead,
    formatTimeShort,
    dataLoading,
    isLoadingPage,
    isNotificationPopUpVisable,
    setIsNotificationPopUpVisable,
    notificationCount,
    isNotificationsNotRead,
    deleteRecentHashTagSearch,
    saveRecentHashTagSearch,
    isSearchHashTag,
    setIsSearchHashTag,
    notReadCount,
    deleteRecentSearch,
    isNoMatch,
    isSearching,
    clearRecentSearch,
    saveRecentSearch,
    isSearchClicked,
    setIsSearchClicked,
    searchString,
    setIsMouseHovering,
    setSearchResults,
    setSearchString,
    searchResults,
    selectedListProfile,
    unfollowModalHandler,
    followHandler,
    isFollowLoading,
    setCurrentPath,
    currentPath, 
    userData, 
    getProfilePhotoURL, 
    profilePhotoURL,
    setPhotoUploadModalOpen,
    photoUploadModalOpen 
  } = props
  const location = useLocation();
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const searchInputRef = useRef(null);
  const onBlurTimeout = useRef(null)
  const [menuClicked, setMenuClicked] = useState(false);
  const [previousLocation, setPreviousLocation] = useState('');
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [isActivityAnimating, setIsActivityAnimating] = useState(false);
  const [isSearchAnimating, setIsSearchAnimating] = useState(false);
  const [isProfileAnimating, setIsProfileAnimating] = useState(false);
  
  useEffect(() => {
    console.log('location:', location)
    setCurrentPath(location.pathname);
    setDropDownOpen(false);
  }, [location]);

  const openDropDown = (event) => {
      setDropDownOpen(true);
      if (isSearchClicked) {
        setIsSearchAnimating(true);
      };
      if (isDropDownOpen) {
        setIsActivityAnimating(true);
      };
      setCurrentPath('');      
  };

  const openNewPostModal = () => {
    setPhotoUploadModalOpen(true);
    setCurrentPath('');
  }

  const inputFocusHandler = () => {
    setIsSearchClicked(true);
    if (isDropDownOpen) {
      setIsActivityAnimating(true);
    };
    if (dropDownOpen) {
      setIsProfileAnimating(true);
    };
    searchInputRef.current.focus();
  }

  const searchInputHandler = (event) => {
    const { value } = event.target;
    if (value !== '') {
      searchInputRef.current.focus();
    }
    if (value[0] === '#') {
      setIsSearchHashTag(true);
    } else {
      setIsSearchHashTag(false);
    }
    setSearchString(value);
  }

  const clearInputs = (event) => {
    event.stopPropagation();
    console.log('clear-inputs')
    setSearchString('');
    setSearchResults([]);
  };

  const activityDropDownHandler = (event) => {
    if (!isDropDownOpen) {
      event.stopPropagation();
    }
    setIsDropDownOpen(true);
    if (isSearchClicked) {
      setIsSearchAnimating(true);
    };
    if (dropDownOpen) {
      setIsProfileAnimating(true);
    };
    setCurrentPath('');
  }

  useEffect(() => {
    if (isNotificationsNotRead && !dataLoading && !isLoadingPage && previousLocation !== location.pathname) {
      setIsNotificationPopUpVisable(true);
      setPreviousLocation(location.pathname);
    }
  }, [location.pathname, dataLoading, isLoadingPage]);

  return (
    <nav className='navigation-bar-spacer-wrapper'>
      <div className='navigation-bar-spacer'></div>
      <div className="navigation-bar">
        <div className='navigation-wrapper'>
          <div className='logo-wrapper'>
            <Link to='/'>
                <img alt='' src={navigationLogo}/>          
            </Link>     
          </div>
          <div className="search-bar-wrapper">
            <input
              value={searchString}
              onChange={searchInputHandler} 
              aria-label='Search Input' 
              autoCapitalize='none' 
              className='search-input' 
              placeholder='Search'
              ref={searchInputRef}
            />
            {!isSearchClicked &&
              <div 
                className='search-placeholder'
                onClick={inputFocusHandler}
              >
                <div className='search-icon-text-wrapper'>
                  <svg aria-label="Search" className="_8-yf5 " color="#8e8e8e" fill="#8e8e8e" height="16" role="img" viewBox="0 0 24 24" width="16">
                    <path d="M19 10.5A8.5 8.5 0 1110.5 2a8.5 8.5 0 018.5 8.5z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                    <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="16.511" x2="22" y1="16.511" y2="22"></line>
                  </svg>
                  <span>{searchString === '' ? 'Search' : searchString}</span>
                </div>
              </div>

            }                   
            {isSearchClicked &&
              <button 
                className="clear-search-button"
                onMouseDown={clearInputs}
              >
                <span className="clear-search-glyph-sprite">
                </span>
              </button>              
            }
            {isSearchClicked &&
              <SearchDropDown
                setIsSearchAnimating = {setIsSearchAnimating}
                isSearchAnimating = {isSearchAnimating}
                setIsSearchClicked = {setIsSearchClicked}
                deleteRecentHashTagSearch = {deleteRecentHashTagSearch}
                saveRecentHashTagSearch = {saveRecentHashTagSearch}
                isSearchHashTag = {isSearchHashTag}
                deleteRecentSearch={deleteRecentSearch}
                isNoMatch={isNoMatch}
                isSearching={isSearching}
                clearRecentSearch={clearRecentSearch}
                searchString={searchString}
                saveRecentSearch={saveRecentSearch}
                setIsMouseHovering={setIsMouseHovering}
                setSearchString={setSearchString}
                setSearchResults={setSearchResults} 
                searchResults={searchResults}
                selectedListProfile={selectedListProfile}
                userData={userData}
                followHandler={followHandler}
                isFollowLoading={isFollowLoading}
                unfollowModalHandler={unfollowModalHandler}
                setMenuClicked={setMenuClicked}
              />               
            }
          </div>
          <div className="page-icons-wrapper">
            <div className='new-post-icon icon' onClick={openNewPostModal}>
              {photoUploadModalOpen
              ? <svg aria-label="New Post" className="_8-yf5 " color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24">
                  <path d="M12.003 5.545l-.117.006-.112.02a1 1 0 00-.764.857l-.007.117V11H6.544l-.116.007a1 1 0 00-.877.876L5.545 12l.007.117a1 1 0 00.877.876l.116.007h4.457l.001 4.454.007.116a1 1 0 00.876.877l.117.007.117-.007a1 1 0 00.876-.877l.007-.116V13h4.452l.116-.007a1 1 0 00.877-.876l.007-.117-.007-.117a1 1 0 00-.877-.876L17.455 11h-4.453l.001-4.455-.007-.117a1 1 0 00-.876-.877zM8.552.999h6.896c2.754 0 4.285.579 5.664 1.912 1.255 1.297 1.838 2.758 1.885 5.302L23 8.55v6.898c0 2.755-.578 4.286-1.912 5.664-1.298 1.255-2.759 1.838-5.302 1.885l-.338.003H8.552c-2.754 0-4.285-.579-5.664-1.912-1.255-1.297-1.839-2.758-1.885-5.302L1 15.45V8.551c0-2.754.579-4.286 1.912-5.664C4.21 1.633 5.67 1.05 8.214 1.002L8.552 1z"></path>
                </svg>
              : <svg aria-label="New Post" className="_8-yf5 " color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24">
                  <path d="M2 12v3.45c0 2.849.698 4.005 1.606 4.944.94.909 2.098 1.608 4.946 1.608h6.896c2.848 0 4.006-.7 4.946-1.608C21.302 19.455 22 18.3 22 15.45V8.552c0-2.849-.698-4.006-1.606-4.945C19.454 2.7 18.296 2 15.448 2H8.552c-2.848 0-4.006.699-4.946 1.607C2.698 4.547 2 5.703 2 8.552z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="6.545" x2="17.455" y1="12.001" y2="12.001"></line>
                  <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="12.003" x2="12.003" y1="6.545" y2="17.455"></line>
                </svg>
              }
            </div>
            <div className='profile-picture icon' onClick={openDropDown}>
              {(currentPath === `/${userData.displayName}/` || dropDownOpen) &&
                <div className='profile-ring'></div>
              }
              <div className='profile-picture-wrapper'>
                {userData.photoURL === ''
                  ? <img alt='' src={defaultProfileImage}/>
                  : <img alt='' src={userData.photoURL} />
                }
              </div>
              <div className='drop-down-menu-container'>
                {dropDownOpen &&
                  <ProfileDropDown
                    setDropDownOpen = {setDropDownOpen}
                    setIsProfileAnimating = {setIsProfileAnimating}
                    isProfileAnimating = {isProfileAnimating} 
                    userData={userData} 
                    openDropDown={openDropDown}
                  />
                }
              </div>
            </div>
            {isDropDownOpen &&
              <ActivtiyDropDown
                isActivityLoading = {isActivityLoading}
                setIsActivityAnimating = {setIsActivityAnimating}
                isActivityAnimating = {isActivityAnimating}
                setIsDropDownOpen = {setIsDropDownOpen}
                selectedListProfile = {selectedListProfile}
                followHandler = {followHandler}
                unfollowModalHandler = {unfollowModalHandler}
                isFollowLoading = {isFollowLoading}
                userData = {userData}
                getNotifications = {getNotifications}
                userNotifications = {userNotifications}
                setIsNotificationsNotRead = {setIsNotificationsNotRead}
                setIsNotificationPopUpVisable = {setIsNotificationPopUpVisable}
                formatTimeShort = {formatTimeShort}
              />             
            }
          </div>
        
        </div>
      </div>
    </nav>
    
  )
}

export default NavigationBar;

