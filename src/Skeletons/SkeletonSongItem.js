import React from "react";
import SkeletonElement from "./SkeletonElement";
import SkeletonAnimation from "../Skeletons/SkeletonAnimation";
const SkeletonSongItem = () => {
  return (
    <div className="skeleton-wrapper">
      <div className="SongItem">
        <SkeletonElement type="songBG" />
        <SkeletonElement type="title" />
        <SkeletonElement type="artist" />
      </div>
      <SkeletonAnimation />
    </div>
  );
};

export default SkeletonSongItem;
