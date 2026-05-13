import React from "react";

import "./Skeleton.css";

const Skeleton = ({ width, height, borderRadius, margin, className }) => {
  const style = {
    width: width || "100%",
    height: height || "1rem",
    borderRadius: borderRadius || "4px",
    margin: margin || "0",
  };

  return <div className={`skeleton-box ${className}`} style={style}></div>;
};

export default Skeleton;
