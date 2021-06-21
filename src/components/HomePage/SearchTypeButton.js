import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "../../styles/GeneratorButton.module.css";
export default function SearchTypeButton() {
  return (
    <>
      <button className={styles.typeButton} style={{ fontSize: 14 }}>
        Country
      </button>
      <button
        className={styles.typeButton}
        style={{ fontSize: 14, marginLeft: 5 }}
      >
        Genre
      </button>
    </>
  );
}
