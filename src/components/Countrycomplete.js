import React, { Fragment, useState, useEffect } from "react";
import Link from "next/link";
import Countries from "../../Data/Countries.json";
import countryMap from "../../Data/countryMap.json";
import styles from "../styles/CountryComplete.module.css";
import Router, { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
export default function Autocomplete(props) {
  const [currentPrediction, setCurrentPrediction] = useState(0);
  const [filteredPredictions, setFilteredPredictions] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [buttonState, setButtonState] = useState("Visible");
  const [predictionShown, setPredictionShown] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState("");
  const router = useRouter();
  const getKeyByValue = (obj, value) => {
    return Object.keys(obj).find((key) => obj[key] === value);
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
    var predictions = Countries;
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
      let countryCode = getKeyByValue(countryMap, userInput);
      let countryName;
      if (filteredPredictions.length === 1) {
        countryCode = filteredPredictions[0].code;
        countryName = filteredPredictions[0].name;
        setUserInput(filteredPredictions[0].name);
        setFilteredPredictions(["Selected"]);
        if (props.linkRef === "/country/") {
          Router.push({
            pathname: `${props.linkRef}${filteredPredictions[0].code}`,
          });
        }
      }
      if (countryCode && props.linkRef === "/country/") {
        router.push({
          pathname: `${props.linkRef}${countryCode}`,
        });
      }

      if (props.updateCountry && countryCode) {
        props.updateCountry([userInput, countryCode]);
      }
    }
  };

  const onClick = (e, countryCode) => {
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
    if (props.linkRef === "/country/") {
      router.push({
        pathname: `${props.linkRef}${countryCode}`,
      });
    }
  };

  let predictionComponent;
  let nullComponent;
  //Hide Main Page Buttons on search for transparent background
  nullComponent = (
    <div className={styles.nullComponent} style={{ visibility: "Hidden" }}>
      No Countries Found
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
            No Countries Found
          </div>
        );
      }
    }
  }
  let pageRef;
  if (props.linkRef) {
    let customRef = props.linkRef;
    pageRef = `${customRef}${selectedCountry}`;
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
              placeholder="Search for a Country"
              onChange={(e) => onTextChanged(e, userInput)}
              onKeyPress={(e) => handleKeyPress(e)}
              value={userInput}
              className={styles.input}
              autoComplete="off"
            />
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
