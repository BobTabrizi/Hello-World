import React, { Fragment } from "react";
import Link from "next/link";
import Countries from "../../Data/Countries.json";
import styles from "../styles/CountryComplete.module.css";
import Router, { withRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
class Autocomplete extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPrediction: 0,
      filteredPredictions: [],
      userInput: "",
      finalPrediction: "",
      nullPrediction: "hidden",
      predictionShown: true,
      searchButton: this.props.searchButton,
    };
  }

  onTextChanged = (e, value) => {
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
    this.setState({
      currentPrediction: 0,
      filteredPredictions,
      userInput: userInput,
      predictionShown: true,
    });
  };

  onClick = (e, countryCode) => {
    this.setState({
      currentPrediction: 0,
      filteredPredictions: [],
      userInput: e.currentTarget.innerText,
      finalPrediction: e.currentTarget.innerText,
      selectedCountry: e.currentTarget.getAttribute("value"),
      predictionShown: false,
    });
    if (this.props.updateCountry) {
      this.props.updateCountry([
        e.currentTarget.innerText,
        e.currentTarget.getAttribute("value"),
      ]);
    }
    if (this.props.linkRef === "/playlist/") {
      Router.push({
        pathname: `${this.props.linkRef}${countryCode}`,
      });
    }
  };

  render() {
    const {
      onTextChanged,
      onClick,
      state: {
        currentPrediction,
        filteredPredictions,
        userInput,
        predictionShown,
      },
    } = this;

    let predictionComponent;
    let nullComponent;

    //Hide Main Page Buttons on search for transparent background
    if (this.props.updateButtonState) {
      this.props.updateButtonState("Visible");
    }
    nullComponent = (
      <div className={styles.nullComponent} style={{ visibility: "Hidden" }}>
        No Countries Found
      </div>
    );
    if (predictionShown && userInput) {
      if (filteredPredictions.length && filteredPredictions[0] !== "Selected") {
        if (this.props.updateButtonState) {
          this.props.updateButtonState("Hidden");
        }

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
    if (this.props.linkRef) {
      let customRef = this.props.linkRef;
      pageRef = `${customRef}${this.state.selectedCountry}`;
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
                placeholder="Select a Country"
                onChange={(e) => onTextChanged(e, userInput)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    if (this.props.linkRef === "/playlist/") {
                      Router.push({
                        pathname: `${this.props.linkRef}${userInput}`,
                      });
                    } else {
                      this.setState({ filteredPredictions: ["Selected"] });
                    }
                  }
                }}
                value={userInput}
                className={styles.input}
                autoComplete="off"
              />
            </div>
          </form>
          {this.props.linkRef && this.props.searchButton && (
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
}
export default withRouter(Autocomplete);
