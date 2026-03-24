const API_KEY = '60cd929853a7126e32474435012191dd';
const API_BASE = 'https://api.openweathermap.org/data/2.5';

// Local Storage Keys
const STORAGE_KEYS = {
    FAVORITES: 'weather_favorites',
    RECENT_SEARCHES: 'weather_recent_searches',
    USER_PREFERENCES: 'weather_preferences',
    LAST_CITY: 'weather_last_city'
};

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const cityInput = document.getElementById('cityInput');
    const searchBtn = document.getElementById('searchBtn');
    const errorMsg = document.getElementById('errorMsg');
    const loading = document.getElementById('loading');
    const todayWeather = document.getElementById('todayWeather');
    const forecastSection = document.getElementById('forecastSection');
    const forecastContainer = document.getElementById('forecastContainer');
    const locationBtn = document.getElementById('locationBtn');
    const favoritesContainer = document.getElementById('favoritesContainer');
    const recentSearchesContainer = document.getElementById('recentSearchesContainer');
    const unitToggle = document.getElementById('unitToggle');
    const themeToggle = document.getElementById('themeToggle');

    // State Management
    let currentCity = null;
    let userPreferences = loadUserPreferences();
    let favorites = loadFavorites();
    let recentSearches = loadRecentSearches();

    // Initialize app
    initializeApp();

    function initializeApp() {
        // Apply saved preferences
        applyUserPreferences();
        
        // Setup event listeners
        setupEventListeners();
        
        // Load favorites and recent searches
        displayFavorites();
        displayRecentSearches();
        
        // Load last city if available
        loadLastCity();
    }

    function setupEventListeners() {
        // Search events
        searchBtn.addEventListener('click', searchWeather);
        cityInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchWeather();
            }
        });

        // Geolocation
        if (locationBtn) {
            locationBtn.addEventListener('click', getCurrentLocationWeather);
        }

        // Unit toggle
        if (unitToggle) {
            unitToggle.addEventListener('change', toggleTemperatureUnit);
        }

        // Theme toggle
        if (themeToggle) {
            themeToggle.addEventListener('change', toggleTheme);
        }
    }

    async function searchWeather() {
        const city = cityInput.value.trim();
        
        if (!city) {
            showError('Please enter a city name');
            return;
        }

        hideError();
        showLoading();
        hideSections();

        try {
            const data = await getWeatherData(city);
            currentCity = data.city;
            
            displayTodayWeather(data.current);
            displayForecast(data.forecast);
            
            // Save to recent searches and last city
            saveRecentSearch(city);
            saveLastCity(city);
            
            // Update favorites display
            displayFavorites();
            
        } catch (error) {
            showError('City not found. Please check spelling and try again.');
            console.error('Error:', error);
        } finally {
            hideLoading();
        }
    }

    // Geolocation Function
    async function getCurrentLocationWeather() {
        if (!navigator.geolocation) {
            showError('Geolocation is not supported by your browser');
            return;
        }

        hideError();
        showLoading();
        hideSections();

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    const data = await getWeatherByCoords(latitude, longitude);
                    currentCity = data.city;
                    
                    displayTodayWeather(data.current);
                    displayForecast(data.forecast);
                    
                    // Save location as last city
                    saveLastCity(data.city);
                    
                } catch (error) {
                    showError('Unable to get weather for your location');
                    console.error('Geolocation error:', error);
                } finally {
                    hideLoading();
                }
            },
            (error) => {
                hideLoading();
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        showError('Location access denied. Please enable location services.');
                        break;
                    case error.POSITION_UNAVAILABLE:
                        showError('Location information is unavailable.');
                        break;
                    case error.TIMEOUT:
                        showError('Location request timed out.');
                        break;
                    default:
                        showError('An unknown error occurred while getting location.');
                }
            }
        );
    }

    // Get Weather by Coordinates
    async function getWeatherByCoords(lat, lon) {
        const forecastResponse = await fetch(
            `${API_BASE}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${userPreferences.temperatureUnit}&cnt=40`
        );

        if (!forecastResponse.ok) {
            throw new Error('Weather data not available');
        }

        const forecastData = await forecastResponse.json();
        const current = forecastData.list[0];
        
        const dailyForecast = [];
        const days = new Set();
        
        for (let i = 0; i < forecastData.list.length && dailyForecast.length < 5; i++) {
            const item = forecastData.list[i];
            const date = new Date(item.dt * 1000);
            const dayKey = date.toDateString();
            
            if (!days.has(dayKey) && date.getDate() !== new Date().getDate()) {
                days.add(dayKey);
                dailyForecast.push({
                    date: formatForecastDate(date),
                    temp: Math.round(item.main.temp),
                    feelsLike: Math.round(item.main.feels_like),
                    description: item.weather[0].description,
                    icon: item.weather[0].icon,
                    humidity: item.main.humidity,
                    pressure: item.main.pressure,
                    wind: Math.round(item.wind.speed * 3.6)
                });
            }
        }

        return { current, forecast: dailyForecast, city: forecastData.city.name };
    }

    async function getWeatherData(city) {
        // Get current weather + 5-day forecast
        const forecastResponse = await fetch(
            `${API_BASE}/forecast?q=${city}&appid=${API_KEY}&units=metric&cnt=40`
        );

        if (!forecastResponse.ok) {
            throw new Error(`City not found`);
        }

        const forecastData = await forecastResponse.json();
        
        // Current weather (first item)
        const current = forecastData.list[0];
        
        // Group forecast by day (next 5 days)
        const dailyForecast = [];
        const days = new Set();
        
        for (let i = 0; i < forecastData.list.length && dailyForecast.length < 5; i++) {
            const item = forecastData.list[i];
            const date = new Date(item.dt * 1000);
            const dayKey = date.toDateString();
            
            if (!days.has(dayKey) && date.getDate() !== new Date().getDate()) {
                days.add(dayKey);
                dailyForecast.push({
                    date: formatForecastDate(date),
                    temp: Math.round(item.main.temp),
                    feelsLike: Math.round(item.main.feels_like),
                    description: item.weather[0].description,
                    icon: item.weather[0].icon,
                    humidity: item.main.humidity,
                    pressure: item.main.pressure,
                    wind: Math.round(item.wind.speed * 3.6) // Convert m/s to km/h
                });
            }
        }

        return { current, forecast: dailyForecast, city: forecastData.city.name };
    }

    function displayTodayWeather(current) {
        const unit = userPreferences.temperatureUnit === 'metric' ? '°C' : '°F';
        const windUnit = userPreferences.temperatureUnit === 'metric' ? 'km/h' : 'mph';
        
        document.getElementById('todayTemp').textContent = `${Math.round(current.main.temp)}${unit}`;
        document.getElementById('todayDesc').textContent = current.weather[0].description;
        document.getElementById('todayFeels').textContent = `${Math.round(current.main.feels_like)}${unit}`;
        document.getElementById('todayHumidity').textContent = `${current.main.humidity}%`;
        document.getElementById('todayWind').textContent = `${Math.round(current.wind.speed * (userPreferences.temperatureUnit === 'metric' ? 3.6 : 2.237))} ${windUnit}`;
        document.getElementById('todayPressure').textContent = `${current.main.pressure} hPa`;
        
        const iconElement = document.getElementById('todayIcon');
        iconElement.className = `fas ${getIconClass(current.weather[0].icon)}`;
        
        // Add favorite button functionality
        addFavoriteButton(currentCity);
        
        todayWeather.classList.remove('hidden');
    }

    function displayForecast(forecast) {
        forecastContainer.innerHTML = '';
        
        forecast.forEach(day => {
            const card = createForecastCard(day);
            forecastContainer.appendChild(card);
        });
        
        forecastSection.classList.remove('hidden');
    }

    function createForecastCard(day) {
        const card = document.createElement('div');
        card.className = 'forecast-card';
        
        card.innerHTML = `
            <div class="forecast-date">${day.date}</div>
            <div class="forecast-icon">
                <i class="${getIconClass(day.icon)}"></i>
            </div>
            <div class="forecast-temp">${day.temp}°C</div>
            <div class="forecast-desc">${day.description}</div>
            <div class="forecast-details">
                Feels: ${day.feelsLike}°C | 
                Humidity: ${day.humidity}% | 
                Wind: ${day.wind} km/h
            </div>
        `;
        
        return card;
    }

    function getIconClass(iconCode) {
        const iconMap = {
            '01d': 'fas fa-sun', '01n': 'fas fa-moon',
            '02d': 'fas fa-cloud-sun', '02n': 'fas fa-cloud-moon',
            '03d': 'fas fa-cloud', '03n': 'fas fa-cloud',
            '04d': 'fas fa-clouds', '04n': 'fas fa-clouds',
            '09d': 'fas fa-cloud-rain', '09n': 'fas fa-cloud-rain',
            '10d': 'fas fa-cloud-sun-rain', '10n': 'fas fa-cloud-moon-rain',
            '11d': 'fas fa-bolt', '11n': 'fas fa-bolt',
            '13d': 'fas fa-snowflake', '13n': 'fas fa-snowflake',
            '50d': 'fas fa-smog', '50n': 'fas fa-smog'
        };
        return iconMap[iconCode] || 'fas fa-cloud';
    }

    function formatForecastDate(date) {
        const options = { weekday: 'short', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    function showError(message) {
        errorMsg.textContent = message;
        errorMsg.style.display = 'block';
    }

    function hideError() {
        errorMsg.style.display = 'none';
    }

    function showLoading() {
        loading.classList.remove('hidden');
    }

function createForecastCard(day) {
    const card = document.createElement('div');
    card.className = 'forecast-card';
    
    const unit = userPreferences.temperatureUnit === 'metric' ? '°C' : '°F';
    
    card.innerHTML = `
        <div class="forecast-date">${day.date}</div>
        <div class="forecast-icon">
            <i class="${getIconClass(day.icon)}"></i>
        </div>
        <div class="forecast-temp">${day.temp}${unit}</div>
        <div class="forecast-desc">${day.description}</div>
        <div class="forecast-details">
            Feels: ${day.feelsLike}${unit} | 
            Humidity: ${day.humidity}% | 
            Wind: ${day.wind} km/h
        </div>
    `;
    
    return card;
}

function getIconClass(iconCode) {
    const iconMap = {
        '01d': 'fas fa-sun', '01n': 'fas fa-moon',
        '02d': 'fas fa-cloud-sun', '02n': 'fas fa-cloud-moon',
        '03d': 'fas fa-cloud', '03n': 'fas fa-cloud',
        '04d': 'fas fa-clouds', '04n': 'fas fa-clouds',
        '09d': 'fas fa-cloud-rain', '09n': 'fas fa-cloud-rain',
        '10d': 'fas fa-cloud-sun-rain', '10n': 'fas fa-cloud-moon-rain',
        '11d': 'fas fa-bolt', '11n': 'fas fa-bolt',
        '13d': 'fas fa-snowflake', '13n': 'fas fa-snowflake',
        '50d': 'fas fa-smog', '50n': 'fas fa-smog'
    };
    return iconMap[iconCode] || 'fas fa-cloud';
}

function formatForecastDate(date) {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function showError(message) {
    errorMsg.textContent = message;
    errorMsg.style.display = 'block';
}

function hideError() {
    errorMsg.style.display = 'none';
}

function showLoading() {
    loading.classList.remove('hidden');
}

function hideLoading() {
    loading.classList.add('hidden');
}

function hideSections() {
    todayWeather.classList.add('hidden');
    forecastSection.classList.add('hidden');
}

// Favorites Management
function addFavoriteButton(city) {
    const existingBtn = document.querySelector('.favorite-btn');
    if (existingBtn) existingBtn.remove();
    
    const favoriteBtn = document.createElement('button');
    favoriteBtn.className = `favorite-btn ${isFavorite(city) ? 'favorited' : ''}`;
    favoriteBtn.innerHTML = `<i class="fas fa-heart"></i> ${isFavorite(city) ? 'Remove from Favorites' : 'Add to Favorites'}`;
    favoriteBtn.onclick = () => toggleFavorite(city);
    
    const todaySection = document.querySelector('.today-card');
    if (todaySection) {
        todaySection.appendChild(favoriteBtn);
    }
}

function toggleFavorite(city) {
    if (isFavorite(city)) {
        removeFavorite(city);
    } else {
        addFavorite(city);
    }
    displayFavorites();
    addFavoriteButton(currentCity);
}

function addFavorite(city) {
    if (!favorites.includes(city)) {
        favorites.unshift(city);
        favorites = favorites.slice(0, 10); // Limit to 10 favorites
        saveFavorites();
    }
}

function removeFavorite(city) {
    favorites = favorites.filter(fav => fav !== city);
    saveFavorites();
}

function isFavorite(city) {
    return favorites.includes(city);
}

function displayFavorites() {
    if (!favoritesContainer) return;
    
    if (favorites.length === 0) {
        favoritesContainer.innerHTML = '<p class="no-favorites">No favorite cities yet</p>';
        return;
    }

    favoritesContainer.innerHTML = favorites.map(city => `
        <div class="favorite-item" onclick="searchFavoriteCity('${city}')">
            <span>${city}</span>
            <button class="remove-favorite" onclick="event.stopPropagation(); removeFavorite('${city}')">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
}

// Recent Searches Management
function saveRecentSearch(city) {
    if (!recentSearches.includes(city)) {
        recentSearches.unshift(city);
        recentSearches = recentSearches.slice(0, 5); // Limit to 5 recent searches
        saveRecentSearches();
    }
    displayRecentSearches();
}

function displayRecentSearches() {
    if (!recentSearchesContainer) return;
    
    if (recentSearches.length === 0) {
        recentSearchesContainer.innerHTML = '<p class="no-recent">No recent searches</p>';
        return;
    }

    recentSearchesContainer.innerHTML = recentSearches.map(city => `
        <div class="recent-item" onclick="searchRecentCity('${city}')">
            <i class="fas fa-history"></i>
            <span>${city}</span>
        </div>
    `).join('');
}

// User Preferences Management
function toggleTemperatureUnit() {
    userPreferences.temperatureUnit = unitToggle.checked ? 'imperial' : 'metric';
    saveUserPreferences();
    
    // Refresh current weather if available
    if (currentCity) {
        searchWeather();
    }
}

function toggleTheme() {
    userPreferences.theme = themeToggle.checked ? 'dark' : 'light';
    saveUserPreferences();
    applyTheme();
}

function applyUserPreferences() {
    // Apply temperature unit
    if (unitToggle) {
        unitToggle.checked = userPreferences.temperatureUnit === 'imperial';
    }
    
    // Apply theme
    if (themeToggle) {
        themeToggle.checked = userPreferences.theme === 'dark';
    }
    applyTheme();
}

function applyTheme() {
    document.body.className = userPreferences.theme === 'dark' ? 'dark-theme' : '';
}

// Local Storage Functions
function loadUserPreferences() {
    const saved = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
    return saved ? JSON.parse(saved) : {
        temperatureUnit: 'metric',
        theme: 'light'
    };
}

function saveUserPreferences() {
    localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(userPreferences));
}

function loadFavorites() {
    const saved = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    return saved ? JSON.parse(saved) : [];
}

function saveFavorites() {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
}

function loadRecentSearches() {
    const saved = localStorage.getItem(STORAGE_KEYS.RECENT_SEARCHES);
    return saved ? JSON.parse(saved) : [];
}

function saveRecentSearches() {
    localStorage.setItem(STORAGE_KEYS.RECENT_SEARCHES, JSON.stringify(recentSearches));
}

function saveLastCity(city) {
    localStorage.setItem(STORAGE_KEYS.LAST_CITY, city);
}

function loadLastCity() {
    const lastCity = localStorage.getItem(STORAGE_KEYS.LAST_CITY);
    if (lastCity) {
        cityInput.value = lastCity;
        searchWeather();
    }
}

// Global Functions for HTML onclick handlers
window.searchFavoriteCity = function(city) {
    cityInput.value = city;
    searchWeather();
};

window.searchRecentCity = function(city) {
    cityInput.value = city;
    searchWeather();
};

window.removeFavorite = function(city) {
    removeFavorite(city);
    displayFavorites();
    if (currentCity === city) {
        addFavoriteButton(currentCity);
    }
};   
});

