// Global variables to hold chart instances
let temperatureChartInstance;
let humidityChartInstance;
let weatherConditionsChartInstance;
//let windSpeeds;

// Event listener to fetch weather when the button is clicked
document.getElementById('fetchWeatherBtn').addEventListener('click', function () {
    const city = document.getElementById('cityInput').value.trim();
    if (city) {
        fetchWeather(city);
    } else {
        alert('Please enter a city name');
    }
});

// Function to fetch weather data for a specific city
function fetchWeather(city) {
    const apiKey = 'f4bc47b04f9b9d9d5feb913b52299539';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    showLoading(true);

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found');
            }
            return response.json();
        })
        .then(data => displayCurrentWeather(data))
        .catch(error => alert(error.message))
        .finally(() => showLoading(false));

    const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    fetch(forecastApiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Forecast not available for this city');
            }
            return response.json();
        })
        .then(data => displayForecast(data))
        .catch(error => alert(error.message));
}

// Function to display current weather data
function displayCurrentWeather(data) {
    document.getElementById('weatherCondition').innerText = `Condition: ${data.weather[0].description}`;
    document.getElementById('temperature').innerText = `Temperature: ${data.main.temp} °C`;
    document.getElementById('humidity').innerText = `Humidity: ${data.main.humidity}%`;
    document.getElementById('windSpeed').innerText = `Wind Speed: ${data.wind.speed} m/s`;
    document.getElementById('dateTime').innerText = `Date & Time: ${new Date(data.dt * 1000).toLocaleString()}`;
}

// Function to display forecast data
function displayForecast(data) {
    const temperatures = [];
    const humidities = [];
    //const weatherConditions = [];
    const windSpeeds=[];
    console.log(data.list.length)
    for (let i = 0; i < data.list.length; i += 8) { // Get data every 24 hours
        const dayData = data.list[i];
        console.log(dayData)
        temperatures.push(dayData.main.temp);
        humidities.push(dayData.main.humidity);
        //weatherConditions.push(dayData.weather[0].main);
        windSpeeds.push(dayData.wind.speed);
    }

    // Destroy existing charts before creating new ones
    if (temperatureChartInstance) {
        temperatureChartInstance.destroy();
    }
    if (humidityChartInstance) {
        humidityChartInstance.destroy();
    }
    if (weatherConditionsChartInstance) {
        weatherConditionsChartInstance.destroy();
    }

    // Render charts with new data
    temperatureChartInstance = renderChart('temperatureChart', 'line', 'Temperature (°C)', temperatures, 'rgba(255, 99, 132, 0.2)', 'rgba(255, 99, 132, 1)');
    humidityChartInstance = renderChart('humidityChart', 'line', 'Humidity (%)', humidities, 'rgba(54, 162, 235, 0.2)', 'rgba(54, 162, 235, 1)');
    //weatherConditionsChartInstance = renderChart('weatherConditionsChart', 'bar', 'Weather Condition', weatherConditions, 'rgba(75, 192, 192, 0.2)', 'rgba(75, 192, 192, 1)');
    weatherConditionsChartInstance = renderChart('windSpeedChart', 'bar', 'Wind Speed (m/s)', windSpeeds, 'rgba(75, 192, 192, 0.2)', 'rgba(75, 192, 192, 1)');
}

// Helper function to render charts
function renderChart(canvasId, chartType, label, data, bgColor, borderColor) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    return new Chart(ctx, {
        type: chartType,
        data: {
            labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'],
            datasets: [{
                label: label,
                data: data,
                backgroundColor: bgColor,
                borderColor: borderColor,
                borderWidth: 1
            }]
        }
    });
}

// Show or hide loading indicator
function showLoading(isLoading) {
    const loadingElement = document.getElementById('loading');
    loadingElement.style.display = isLoading ? 'block' : 'none';
}

// No longer need to fetch default weather on load
window.onload = function () {
    // Do nothing
};
