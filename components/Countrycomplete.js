import React, { Fragment } from "react";
import PropTypes from "prop-types";
import Countries from "../Countries";
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
      predictionShown: false,
    });
    this.props.updateCountry([
      e.currentTarget.innerText,
      e.currentTarget.getAttribute("value"),
    ]);
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
          <div className="predictionList">
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
          <div className="null-predictions">No Countries Found</div>
        );
      }
    }

    return (
      <div>
        <Fragment>
          <input type="text" onChange={onTextChanged} value={userInput} />
          {predictionComponent}
        </Fragment>
        <style jsx>
          {`
            body {
              font-family: sans-serif;
            }

            input {
              border: 1px solid #999;
              padding: 0.5rem;
              width: 300px;
            }

            .null-predictions {
              color: #999;
              padding: 0.5rem;
            }

            .predictionList {
              border: 1px solid #999;
              border-top-width: 0;
              list-style: none;
              margin-top: 0;
              max-height: 143px;
              overflow-y: auto;
              padding-left: 0;
              width: calc(300px + 1rem);
            }

            .predictionList li {
              padding: 0.5rem;
            }

            li:hover {
              background-color: #d3d3d3;
              cursor: pointer;
              font-weight: 700;
            }

            .prediction-active,
            .predictionList {
              background-color: #d3d3d3;
              cursor: pointer;
              font-weight: 700;
            }

            .predictionList li:not(:last-of-type) {
              border-bottom: 1px solid #999;
            }
          `}
        </style>
      </div>
    );
  }
}
export default Autocomplete;
