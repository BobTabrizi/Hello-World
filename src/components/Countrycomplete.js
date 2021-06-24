import React, { Fragment, useState, useEffect } from "react";
import Link from "next/link";
import Countries from "../../Data/Countries.json";
import Genres from "../../Data/Genres.json";
import countryMap from "../../Data/countryMap.json";
import styles from "../styles/CountryComplete.module.css";
import Router, { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
export default function Autocomplete(props) {
  const [currentPrediction, setCurrentPrediction] = useState(0);
  const [filteredPredictions, setFilteredPredictions] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [predictionShown, setPredictionShown] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState("");
  const router = useRouter();

  const handleSearchSwitch = () => {
    if (props.searchType === "Country") {
      props.updateSearchMode("Genre");
    } else {
      props.updateSearchMode("Country");
    }
    //If change in search type, reset the component
    setCurrentPrediction(0);
    setFilteredPredictions([]);
    setUserInput("");
    setPredictionShown(false);
    setSelectedCountry("");
  };

  const getKeyByValue = (obj, value) => {
    return Object.keys(obj).find((key) => obj[key] === value);
  };

  String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
  };

  useEffect(() => {
    if (userInput.length > 0) {
      if (props.updateButtonState) {
        props.updateButtonState("hidden");
      }
    } else {
      if (props.updateButtonState) {
        props.updateButtonState("Visible");
      }
    }
  });

  const onTextChanged = (e, value) => {
    let userInput;
    var predictions;
    if (props.searchType === "Genre") predictions = Genres;
    else {
      predictions = Countries;
    }
    if (e.currentTarget.value[0] !== undefined) {
      userInput =
        e.currentTarget.value[0].toUpperCase() +
        e.currentTarget.value.substring(1);
    } else {
      userInput = e.currentTarget.value;
    }
    const filteredPredictions = predictions.filter(
      (prediction) =>
        prediction.name.toLowerCase().indexOf(userInput.toLowerCase()) > -1
    );
    setCurrentPrediction(0);
    setFilteredPredictions(filteredPredictions);
    setUserInput(userInput);
    setPredictionShown(true);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      let countryCode;
      let countryName;
      if (props.searchType === "Country") {
        countryCode = getKeyByValue(countryMap, userInput);
      }

      if (filteredPredictions.length === 1) {
        countryName = filteredPredictions[0].name;
        setUserInput(filteredPredictions[0].name.capitalize());
        setFilteredPredictions(["Selected"]);
        if (props.searchType === "Country" && props.pageType === "Home") {
          Router.push({
            pathname: `/country/${filteredPredictions[0].code}`,
          });
        }
        if (props.searchType === "Genre") {
          Router.push({
            pathname: `/genre/${filteredPredictions[0].name}`,
          });
        }
      }
      if (
        countryCode &&
        props.searchType === "Country" &&
        props.pageType === "Home"
      ) {
        router.push({
          pathname: `/country/${countryCode}`,
        });
      }

      if (props.updateCountry && countryCode) {
        props.updateCountry([userInput, countryCode]);
      }
      if (props.updateGenre && props.searchType === "Genre") {
        props.updateGenre(countryName);
      }
    }
  };

  const onClick = (e, val) => {
    setCurrentPrediction(0);
    setFilteredPredictions([]);
    setUserInput(e.currentTarget.innerText);
    setSelectedCountry(e.currentTarget.getAttribute("value"));
    setPredictionShown(false);
    if (props.updateCountry) {
      props.updateCountry([
        e.currentTarget.innerText,
        e.currentTarget.getAttribute("value"),
      ]);
    }
    if (props.updateGenre) {
      props.updateGenre([
        e.currentTarget.innerText,
        e.currentTarget.getAttribute("value"),
      ]);
    }
    if (props.searchType === "Country" && props.pageType === "Home") {
      router.push({
        pathname: `/country/${val}`,
      });
    }
    if (props.searchType === "Genre") {
      Router.push({
        pathname: `/genre/${val}`,
      });
    }
  };

  let predictionComponent;
  let nullComponent;
  //Hide Main Page Buttons on search for transparent background
  nullComponent = (
    <div className={styles.nullComponent} style={{ visibility: "Hidden" }}>
      No {props.searchType} Found
    </div>
  );
  if (predictionShown && userInput) {
    if (filteredPredictions.length && filteredPredictions[0] !== "Selected") {
      predictionComponent = (
        <div className={styles.predictionList}>
          <ul>
            {filteredPredictions.map((prediction, idx) => {
              let className = "prediction-inactive";
              if (idx === currentPrediction) {
                className = "prediction-active";
              }

              if (props.searchType === "Country") {
                return (
                  <li
                    className={className}
                    key={prediction.name}
                    value={prediction.code}
                    onClick={(e) => onClick(e, prediction.code)}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      {prediction.name}

                      <img
                        src={`/flags/${prediction.code}.png`}
                        height="50"
                        width="70"
                      ></img>
                    </div>
                  </li>
                );
              } else {
                return (
                  <li
                    className={className}
                    key={prediction.name}
                    value={prediction.name}
                    onClick={(e) => onClick(e, prediction.name)}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      {prediction.name.capitalize()}
                    </div>
                  </li>
                );
              }
            })}
          </ul>
        </div>
      );
    } else {
      predictionComponent = null;
      if (filteredPredictions[0] !== "Selected") {
        nullComponent = (
          <div
            className={styles.nullComponent}
            style={{ visibility: "Visible" }}
          >
            No {props.searchType} Found
          </div>
        );
      }
    }
  }
  let pageRef;

  if (props.linkRef && props.searchType === "Country") {
    let customRef = props.linkRef;
    pageRef = `${customRef}${selectedCountry}`;
  }

  //For now, keep the toggle to home page,
  //needs to be refactored for customized playlist feature expansion
  let searchSwitch;
  if (props.pageType === "Home") {
    searchSwitch = (
      <div
        className={styles.searchIconTwo}
        style={{ fontSize: 13 }}
        onClick={() => handleSearchSwitch()}
      >
        {props.searchType}
      </div>
    );
  }
  return (
    <div>
      <Fragment>
        {nullComponent}
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div className={styles.inputContainer}>
            <div className={styles.searchIcon}>
              <FontAwesomeIcon
                icon={faSearch}
                style={{
                  marginRight: 10,
                  color: "gray",
                  verticalAlign: "middle",
                }}
                size="1x"
              ></FontAwesomeIcon>
            </div>

            <input
              type="text"
              placeholder={`Search for a ${props.searchType}`}
              onChange={(e) => onTextChanged(e, userInput)}
              onKeyPress={(e) => handleKeyPress(e)}
              value={userInput}
              className={styles.input}
              autoComplete="off"
            />
            {searchSwitch}
          </div>
        </form>
        {props.linkRef && props.searchButton && (
          <Link href={pageRef}>
            <button style={{ height: 25, width: 25, borderRadius: 25 }}>
              <i className="fa fa-search"></i>
            </button>
          </Link>
        )}
        {predictionComponent}
      </Fragment>
    </div>
  );
}
