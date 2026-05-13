import React from "react";

import { PlaceItemSkeleton } from "./Skeletons";

import "./PageSkeleton.css";

const PageSkeleton = () => {
  return (
    <div className="page-skeleton">
      <ul className="place-list">
        {Array(4)
          .fill()
          .map((_, i) => (
            <PlaceItemSkeleton key={i} />
          ))}
      </ul>
    </div>
  );
};

export default PageSkeleton;
