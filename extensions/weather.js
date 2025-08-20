// Name: Weather
// Image: ./assets/extensions-images/weather.png
// Author: XmerOriginals
// ID: birthday
// Description: Provides free weather forecast with WTTR. WTTR is an Open Source Project "https://github.com/chubin/wttr.in"
// License: MPL-2.0

(function (Scratch) {
  "use strict";

  class Weather {
    constructor() {
      this.location = "London";
      this.weatherData = null;
    }

    getInfo() {
      return {
        id: "weather",
        name: "Weather",
        color1: "#4286f4",
        blocks: [
          {
            opcode: "updateWeatherData",
            blockType: Scratch.BlockType.COMMAND,
            text: "Update Weather in [LOCATION]",
            arguments: {
              LOCATION: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "London",
              },
            },
          },
          {
            opcode: "getTemperatureC",
            blockType: Scratch.BlockType.REPORTER,
            text: "Temperature (°C)",
          },
          {
            opcode: "getTemperatureF",
            blockType: Scratch.BlockType.REPORTER,
            text: "Temperature (°F)",
          },
          {
            opcode: "getFeelsLikeC",
            blockType: Scratch.BlockType.REPORTER,
            text: "Feels Like (°C)",
          },
          {
            opcode: "getFeelsLikeF",
            blockType: Scratch.BlockType.REPORTER,
            text: "Feels Like (°F)",
          },
          {
            opcode: "getWeatherDescription",
            blockType: Scratch.BlockType.REPORTER,
            text: "Weather Description",
          },
          {
            opcode: "getWindSpeedKmph",
            blockType: Scratch.BlockType.REPORTER,
            text: "Wind Speed (km/h)",
          },
          {
            opcode: "getHumidity",
            blockType: Scratch.BlockType.REPORTER,
            text: "Humidity",
          },
          {
            opcode: "getLocalObsDateTime",
            blockType: Scratch.BlockType.REPORTER,
            text: "Local Observation Time",
          },
          {
            opcode: "getObservationTime",
            blockType: Scratch.BlockType.REPORTER,
            text: "Observation Time (UTC)",
          },
        ],
      };
    }

    async updateWeatherData(args) {
      const location = args.LOCATION;
      try {
        const url = `https://wttr.in/${location}?format=j1`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! status ${response.status}`);
        }

        this.weatherData = await response.json();
      } catch (error) {
        console.error("Weather Error ", error);
        this.weatherData = null;
      }
    }

    getTemperatureC() {
      if (
        this.weatherData &&
        this.weatherData.current_condition &&
        this.weatherData.current_condition[0]
      ) {
        return this.weatherData.current_condition[0].temp_C;
      }
      return "No Data";
    }

    getTemperatureF() {
      if (
        this.weatherData &&
        this.weatherData.current_condition &&
        this.weatherData.current_condition[0]
      ) {
        return this.weatherData.current_condition[0].temp_F;
      }
      return "No Data";
    }

    getFeelsLikeC() {
      if (
        this.weatherData &&
        this.weatherData.current_condition &&
        this.weatherData.current_condition[0]
      ) {
        return this.weatherData.current_condition[0].FeelsLikeC;
      }
      return "No Data";
    }

    getFeelsLikeF() {
      if (
        this.weatherData &&
        this.weatherData.current_condition &&
        this.weatherData.current_condition[0]
      ) {
        return this.weatherData.current_condition[0].FeelsLikeF;
      }
      return "No Data";
    }

    getWeatherDescription() {
      if (
        this.weatherData &&
        this.weatherData.current_condition &&
        this.weatherData.current_condition[0]
      ) {
        return this.weatherData.current_condition[0].weatherDesc[0].value;
      }
      return "No Data";
    }

    getWindSpeedKmph() {
      if (
        this.weatherData &&
        this.weatherData.current_condition &&
        this.weatherData.current_condition[0]
      ) {
        return this.weatherData.current_condition[0].windspeedKmph;
      }
      return "No Data";
    }

    getHumidity() {
      if (
        this.weatherData &&
        this.weatherData.current_condition &&
        this.weatherData.current_condition[0]
      ) {
        return this.weatherData.current_condition[0].humidity;
      }
      return "No Data";
    }

    getLocalObsDateTime() {
      if (
        this.weatherData &&
        this.weatherData.current_condition &&
        this.weatherData.current_condition[0]
      ) {
        return this.weatherData.current_condition[0].localObsDateTime;
      }
      return "No Data";
    }

    getObservationTime() {
      if (
        this.weatherData &&
        this.weatherData.current_condition &&
        this.weatherData.current_condition[0]
      ) {
        return this.weatherData.current_condition[0].observation_time;
      }
      return "No Data";
    }
  }

  Scratch.extensions.register(new Weather());
})(Scratch);
