import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { Card, CardContent } from "@/components/atoms/Card";

const WeatherCard = ({ weather, index = 0 }) => {
  const getWeatherIcon = (condition) => {
    switch (condition.toLowerCase()) {
      case "sunny":
      case "clear":
        return "Sun";
      case "cloudy":
      case "partly cloudy":
        return "Cloud";
      case "rainy":
      case "rain":
        return "CloudRain";
      case "stormy":
      case "thunderstorm":
        return "CloudLightning";
      case "snowy":
      case "snow":
        return "CloudSnow";
      default:
        return "Cloud";
    }
  };

  const getWeatherGradient = (condition) => {
    switch (condition.toLowerCase()) {
      case "sunny":
      case "clear":
        return "from-yellow-400 to-orange-500";
      case "rainy":
      case "rain":
        return "from-blue-400 to-blue-600";
      case "stormy":
      case "thunderstorm":
        return "from-gray-600 to-gray-800";
      case "snowy":
      case "snow":
        return "from-blue-200 to-blue-400";
      default:
        return "from-gray-400 to-gray-600";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="hover:shadow-lg transition-all duration-200 transform hover:scale-105">
        <CardContent className="p-4 text-center">
          <div className="space-y-3">
            <div className="text-sm font-medium text-gray-500">
{weather.date_c || weather.date}
            </div>
            
<div className={`w-12 h-12 mx-auto rounded-full bg-gradient-to-br ${getWeatherGradient(weather.condition_c || weather.condition)} flex items-center justify-center shadow-lg`}>
              <ApperIcon 
name={getWeatherIcon(weather.condition_c || weather.condition)}
                className="h-6 w-6 text-white" 
              />
            </div>

            <div className="space-y-1">
              <div className="text-2xl font-bold text-gray-900">
{weather.temperature_c || weather.temperature}°
              </div>
              <div className="text-sm text-gray-600 capitalize">
{weather.condition_c || weather.condition}
              </div>
            </div>

            <div className="flex items-center justify-center space-x-3 text-xs text-gray-500">
              <div className="flex items-center">
                <ApperIcon name="Droplets" className="h-3 w-3 mr-1" />
{weather.precipitation_c || weather.precipitation}%
              </div>
              <div className="flex items-center">
                <ApperIcon name="Wind" className="h-3 w-3 mr-1" />
{weather.wind_c || weather.wind} mph
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default WeatherCard;