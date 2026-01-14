let temperatureChartInstance;
let humidityChartInstance;
let weatherConditionsChartInstance;

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
        .then(data => {
            displayCurrentWeather(data);
            const { lat, lon } = data.coord; // Extract latitude and longitude
            fetchSevenDayForecast(lat, lon, apiKey); // Fetch 7-day forecast using One Call API
        })
        .catch(error => alert(error.message))
        .finally(() => showLoading(false));
}

// Function to fetch 7-day forecast using One Call API
function fetchSevenDayForecast(lat, lon, apiKey) {
    const oneCallApiUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&appid=${apiKey}&units=metric`;

    fetch(oneCallApiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('7-day forecast not available for this location');
            }
            return response.json();
        })
        .then(data => displaySevenDayForecast(data))
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

// Function to display 7-day forecast
function displaySevenDayForecast(data) {
    const temperatures = [];
    const humidities = [];
    const windSpeeds = [];
    const labels = [];

    for (let i = 0; i < 7; i++) { // Get 7 days of data
        const dayData = data.daily[i];
        temperatures.push(dayData.temp.day); // Day temperature
        humidities.push(dayData.humidity); // Humidity
        windSpeeds.push(dayData.wind_speed); // Wind speed
        labels.push(`Day ${i + 1}`); // Day label
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

    // Render charts with new data (for 7 days)
    temperatureChartInstance = renderChart('temperatureChart', 'line', 'Temperature (°C)', temperatures, 'rgba(255, 99, 132, 0.2)', 'rgba(255, 99, 132, 1)', labels);
    humidityChartInstance = renderChart('humidityChart', 'line', 'Humidity (%)', humidities, 'rgba(54, 162, 235, 0.2)', 'rgba(54, 162, 235, 1)', labels);
    weatherConditionsChartInstance = renderChart('windSpeedChart', 'bar', 'Wind Speed (m/s)', windSpeeds, 'rgba(75, 192, 192, 0.2)', 'rgba(75, 192, 192, 1)', labels);
}

// Helper function to render charts
function renderChart(canvasId, chartType, label, data, bgColor, borderColor, labels) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    return new Chart(ctx, {
        type: chartType,
        data: {
            labels: labels,
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

