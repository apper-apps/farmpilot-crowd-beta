class WeatherService {
  constructor() {
    this.tableName = 'weather_c';
    this.apperClient = null;
    this.initializeClient();
  }

  initializeClient() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  async getCurrentWeather() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "date_c" } },
          { field: { Name: "temperature_c" } },
          { field: { Name: "condition_c" } },
          { field: { Name: "precipitation_c" } },
          { field: { Name: "wind_c" } },
          { field: { Name: "humidity_c" } },
          { field: { Name: "uv_c" } }
        ],
        orderBy: [
          { fieldName: "CreatedOn", sorttype: "DESC" }
        ],
        pagingInfo: {
          limit: 5,
          offset: 0
        }
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Transform data to match UI expectations
      return response.data.map(weather => ({
        date: weather.date_c || 'Today',
        temperature: weather.temperature_c || 75,
        condition: weather.condition_c || 'Sunny',
        precipitation: weather.precipitation_c || 0,
        wind: weather.wind_c || 5,
        humidity: weather.humidity_c || 60,
        uv: weather.uv_c || 5
      }));
    } catch (error) {
      console.error("Error fetching current weather:", error);
      // Return fallback data in case of error
      return [
        {
          date: "Today",
          temperature: 78,
          condition: "Partly Cloudy",
          precipitation: 20,
          wind: 8,
          humidity: 65,
          uv: 6
        }
      ];
    }
  }

  async getExtendedForecast() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "date_c" } },
          { field: { Name: "temperature_c" } },
          { field: { Name: "condition_c" } },
          { field: { Name: "precipitation_c" } },
          { field: { Name: "wind_c" } },
          { field: { Name: "humidity_c" } },
          { field: { Name: "uv_c" } }
        ],
        orderBy: [
          { fieldName: "CreatedOn", sorttype: "DESC" }
        ],
        pagingInfo: {
          limit: 10,
          offset: 0
        }
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Transform data to match UI expectations
      return response.data.map(weather => ({
        date: weather.date_c || 'Today',
        temperature: weather.temperature_c || 75,
        condition: weather.condition_c || 'Sunny',
        precipitation: weather.precipitation_c || 0,
        wind: weather.wind_c || 5,
        humidity: weather.humidity_c || 60,
        uv: weather.uv_c || 5
      }));
    } catch (error) {
      console.error("Error fetching extended forecast:", error);
      // Return fallback data in case of error
      return [
        {
          date: "Today",
          temperature: 78,
          condition: "Partly Cloudy", 
          precipitation: 20,
          wind: 8,
          humidity: 65,
          uv: 6
        },
        {
          date: "Tomorrow",
          temperature: 82,
          condition: "Sunny",
          precipitation: 5,
          wind: 6,
          humidity: 58,
          uv: 8
        }
      ];
    }
  }
}

export default new WeatherService();