import axios from "axios";
import { LocationEntity } from "@/types/locations";
import { OpenWeatherCurrent } from "@/types/openweathermap";

const BASE_URL = "https://api.openweathermap.org";
const DEFAULT_API_VERSION = "2.5";
const DEFAULT_UNIT = "metric";

const client = axios.create({
  baseURL: `${BASE_URL}/data/${DEFAULT_API_VERSION}`,
  params: {
    APPID: process.env.VUE_APP_OPENWEATHER_APIKEY,
    units: DEFAULT_UNIT,
  },
});

function mapItem(item: OpenWeatherCurrent) {
  return {
    temperature: item.main.temp,
    humidity: item.main.humidity,
    windSpeed: item.wind.speed,
  };
}

export async function getCurrentWeather({
  lat,
  lng,
}: LocationEntity): Promise<OpenWeatherCurrent> {
  const { data } = await client.get("/weather", {
    params: {
      ...client.defaults.params,
      lat,
      lon: lng,
    },
  });

  return data;
}

export async function getMultipointWeather(
  points: LocationEntity[]
): Promise<LocationEntity[]> {
  const responses = await Promise.all(points.map(getCurrentWeather));

  console.log({ responses });
  const res = points.map((item: LocationEntity) => {
    const weather = responses.find((res) => res.name === item.name);
    return {
      ...item,
      ...((weather && mapItem(weather)) || {}),
    };
  });
  console.log({ res });
  return res;
}
