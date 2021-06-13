import React from "react";
import SkeletonElement from "./SkeletonElement";
import SkeletonAnimation from "../Skeletons/SkeletonAnimation";
const SkeletonListItem = () => {
  return (
    <div className="skeleton-wrapper-list">
      <SkeletonAnimation />
    </div>
  );
};

export default SkeletonListItem;
