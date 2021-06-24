import React from "react";
import SkeletonElement from "./SkeletonElement";
import SkeletonAnimation from "./SkeletonAnimation";
const SkeletonGenreItem = () => {
  return (
    <div className="skeleton-wrapper">
      <div className="genreItem">
        <div className="skeletonDetails">
          <SkeletonElement type="countryImage" />
        </div>
      </div>
      <SkeletonAnimation />
    </div>
  );
};

export default SkeletonGenreItem;
