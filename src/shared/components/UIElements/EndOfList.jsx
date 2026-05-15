import React from 'react';

import './EndOfList.css';

const EndOfList = (props) => {
  return (
    <div className="end-of-list center">
      <div className="end-of-list__divider"></div>
      <p className="end-of-list__text">{props.message || "You've reached the end of the list"}</p>
      <div className="end-of-list__divider"></div>
    </div>
  );
};

export default EndOfList;
