import React, { Fragment } from "react";
import Link from "next/link";
import Countries from "../../Data/Countries.json";
import styles from "../styles/CountryComplete.module.css";
class Autocomplete extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPrediction: 0,
      filteredPredictions: [],
      userInput: "",
      finalPrediction: "",
      predictionShown: true,
    };
  }

  onTextChanged = (e) => {
    var predictions = Countries;
    const userInput = e.currentTarget.value;

    const filteredPredictions = predictions.filter(
      (prediction) =>
        prediction.name.toLowerCase().indexOf(userInput.toLowerCase()) > -1
    );
    this.setState({
      currentPrediction: 0,
      filteredPredictions,
      userInput: e.currentTarget.value,
      predictionShown: true,
    });
  };

  onClick = (e) => {
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

    if (predictionShown && userInput) {
      if (filteredPredictions.length) {
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
                    onClick={onClick}
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
                        width="50"
                      ></img>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      } else {
        predictionComponent = (
          <div className={styles.nullpredictions}>No Countries Found</div>
        );
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
          <input
            type="text"
            placeholder="Select a Country"
            onChange={onTextChanged}
            value={userInput}
            className={styles.input}
          />
          {this.props.linkRef && (
            <Link href={pageRef}>
              <button style={{ height: 30, width: 30, borderRadius: 30 }}>
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
export default Autocomplete;
