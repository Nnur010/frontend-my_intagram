import { useEffect, useState, useRef } from 'react';
import { getFirestore, query, collection, where, getDocs, documentId } from 'firebase/firestore';
import firebaseApp from '../Firebase';
import './UploadModalText.css';
import PeopleList from './PeopleList';

const db = getFirestore()

const UploadModalText = (props) => {
  const {
    captionText,
    setCaptionText,
    userData,
  } = props;
  const [accessibilityOpen, setAccessibilityOpen] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [captionTextArray, setCaptionTextArray] = useState([]);
  const [userIndex, setUserIndex] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchString, setSearchString] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const searchTimeoutRef = useRef(null);
  const textareaRef = useRef(null);
  const [isSearchHashTag, setIsSearchHashTag] = useState(false);

  const accessibilityToggle = () => {
    accessibilityOpen 
      ? setAccessibilityOpen(false) 
      : setAccessibilityOpen(true);
  }
  
  const advancedToggle = () => {
    advancedOpen
      ? setAdvancedOpen(false)
      : setAdvancedOpen(true);
  }

  const captionTextHandler = (event) => {
    const { value } = event.target;
    const valueArray = value.split('');
    const lastLetter = value.substring(value.length - 1);
    console.log(lastLetter);
    if (lastLetter === '@') {
      console.log('@ found');
      setUserIndex(value.length)
    } else if (lastLetter === '#') {
      console.log('# found');
      setUserIndex(value.length);
      setIsSearchHashTag(true);
    }
    if (value.length < userIndex) {
      setUserIndex(null);
      setIsSearching(false);
      setIsSearchHashTag(false);
    };
    console.log(userIndex);
    if (userIndex !== null) {
      console.log(value.substring(userIndex))
      setSearchString(value.substring(userIndex));
      const lastLetter = value.substring(value.length - 1);
      console.log(lastLetter)
      if (lastLetter === ' ') {
        console.log('cleared');
        setUserIndex(null);
      }
    }
    if ((valueArray[valueArray.length - 1] === ' ' && 
      captionTextArray[captionTextArray.length - 1] === ' ') || 
      valueArray.length > 2200) {
      return
    } else {
      setCaptionText(value);
    }
  }

  const getSearchResults = async () => {
    setIsSearching(true);
    const matchedUsers = [];
    const searchTerm = searchString.toLowerCase();
    let searchQuery;
    if (isSearchHashTag) {
      searchQuery = query(collection(db, 'hashTags'), 
        where(documentId(), '>=', searchTerm), where(documentId(), '<=', searchTerm+ '\uf8ff' ));
    } else {
      searchQuery = query(collection(db, 'users'), 
        where('username', '>=', searchTerm), where('username', '<=', searchTerm+ '\uf8ff' ));
    }
    const usersSnapshot = await getDocs(searchQuery);
    usersSnapshot.forEach((user) => {
      if (isSearchHashTag) {
        matchedUsers.push({
          hashTag: user.id,
          ...user.data()
        });
      } else {
        matchedUsers.push(user.data());
      };
    });
    setSearchResults(matchedUsers);
  }

  useEffect(() => {
    clearTimeout(searchTimeoutRef.current);
    setSearchResults([]);
    if (searchString !== '') {
      searchTimeoutRef.current = setTimeout(() => {
        getSearchResults(); 
      }, 300);     
    }; 
  }, [searchString]);

  useEffect(() => {
    setCaptionTextArray(captionText.split(''));
  }, [captionText]);

  const searchSelection = (username) => {
    const slicedComment = captionText.slice(0, userIndex);
    const name = `${username} `
    const newCommentText = slicedComment.concat(name);
    setCaptionText(newCommentText);
    setUserIndex(null)
    setIsSearching(false);
    textareaRef.current.focus();
  }

  return (
    <div className="upload-modal-text-page">
      <div className="user-header-text-page">
        <div className="upload-modal-profile-photo-frame">
          <img 
            className='upload-modal-profile-photo' 
            alt={`${userData.displayName}'s profile`} 
            src={userData.photoURL} 
            draggable='false'
          />
        </div>
        <div className="username-text">
          {userData.displayName}
        </div>
      </div>
      <div className="upload-modal-textarea-wrapper">
        <textarea 
          className='upload-modal-textarea' 
          placeholder='Write a caption...' 
          autoComplete='off' 
          autoCorrect='off'
          value={captionText}
          onChange={captionTextHandler} 
          ref={textareaRef}
          onBlur={() => setIsSearching(false)}
        >
        </textarea>
      </div>
      <div className="textarea-buttons-wrapper">
        <div className="text-length-wrapper">
          <span className="text-length">
            {captionTextArray.length}
          </span>
          <span className="maximum-text-length">
            /2,200
          </span>
        </div>
        {isSearching && !isSearchHashTag &&
          <section className='profile-search-results'>
            <PeopleList 
              searchSelection={searchSelection}
              isTag={false}
              isSearch={true}
              isComment={true}
              allUserProfiles={searchResults}
            />              
          </section> 
        }
        {isSearching && isSearchHashTag && 
          <ul 
            className='profile-search-results'
          >
            {searchResults.map((hashTag) => {
              return (
                <li 
                  className='hash-tag-search-result'
                  onClick={() => searchSelection(hashTag.hashTag)}
                  onMouseDown={(event) => event.preventDefault()}
                >
                  <span className='hash-tag-text'>
                    #{hashTag.hashTag}
                  </span>
                  <span className='hast-tag-post-length'>
                    {hashTag.posts.length} posts
                  </span>
                </li>
              )
            })}
          </ul>
        }
      </div>
    </div>
  )
}

export default UploadModalText