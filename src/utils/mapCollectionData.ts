import { circle } from "@turf/turf";
import { Point, FeatureCollection } from "geojson";

export function mapData(
  collection: FeatureCollection<Point, any>,
  property = "population"
) {
  const dataArray: number[] = collection.features.map((point) =>
    Number(point.properties[property])
  );
  const min = Math.min(...dataArray);
  const max = Math.max(...dataArray);
  console.log({ min, max });

  function getPercentage(value: number) {
    if (!Number(value)) {
      return 0;
    }

    const totalDiff = max - min;
    const valueDiff = value - min;
    let percentage = (valueDiff / totalDiff) * 100;

    percentage = Math.max(percentage, 0);
    percentage = Math.min(percentage, 100);

    return percentage;
  }

  const begin = { red: 255, green: 242, blue: 0 };
  const end = { red: 237, green: 66, blue: 100 };

  function getColor(value: number) {
    const percentage = getPercentage(value) / 100;

    const red = begin.red + Math.floor(percentage * (end.red - begin.red));
    const green =
      begin.green + Math.floor(percentage * (end.green - begin.green));
    const blue = begin.blue + Math.floor(percentage * (end.blue - begin.blue));

    return `rgb(${red},${green},${blue})`;
  }

  function getHeight(value: number) {
    const percentage = Math.floor(getPercentage(value));
    const height = percentage * 100;

    return height;
  }

  const poly = collection.features.map((point) =>
    circle(point, 0.1, {
      steps: 10,
      properties: {
        color: getColor(Number(point.properties[property])),
        height: getHeight(Number(point.properties[property])),
        baseHeight: 0,
      },
    })
  );

  return poly;
}
