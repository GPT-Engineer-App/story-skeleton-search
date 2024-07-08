import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Cloud, Sun, CloudRain, Thermometer } from "lucide-react";

const API_KEY = "YOUR_API_KEY"; // Replace with your actual API key
const CITY = "Istanbul";

const fetchWeather = async () => {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric`);
  if (!response.ok) {
    throw new Error('Weather data fetch failed');
  }
  return response.json();
};

const WeatherIcon = ({ condition }) => {
  switch (condition) {
    case "Clear":
      return <Sun className="h-6 w-6 text-yellow-500" />;
    case "Clouds":
      return <Cloud className="h-6 w-6 text-gray-500" />;
    case "Rain":
      return <CloudRain className="h-6 w-6 text-blue-500" />;
    default:
      return <Thermometer className="h-6 w-6 text-red-500" />;
  }
};

const WeatherModule = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["weather", CITY],
    queryFn: fetchWeather,
    refetchInterval: 600000, // Refetch every 10 minutes
  });

  if (error) return <div>Error fetching weather data</div>;

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Weather in {CITY}
          {!isLoading && data && <WeatherIcon condition={data.weather[0].main} />}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ) : data ? (
          <div className="space-y-2">
            <p className="text-2xl font-bold">{Math.round(data.main.temp)}°C</p>
            <p>{data.weather[0].description}</p>
            <p>Humidity: {data.main.humidity}%</p>
            <p>Wind: {data.wind.speed} m/s</p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default WeatherModule;