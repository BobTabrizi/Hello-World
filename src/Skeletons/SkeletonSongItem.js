import React from "react";
import SkeletonElement from "./SkeletonElement";
import SkeletonAnimation from "../Skeletons/SkeletonAnimation";
const SkeletonSongItem = () => {
  return (
    <div className="skeleton-wrapper">
      <div className="SongItem">
        <div className="skeletonDetails">
          <SkeletonElement type="songImg" />
          <SkeletonElement type="title" />
          <SkeletonElement type="artist" />
        </div>
      </div>
      <SkeletonAnimation />
    </div>
  );
};

export default SkeletonSongItem;
