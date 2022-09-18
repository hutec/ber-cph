import { MapContainer } from "react-leaflet/MapContainer";
import { TileLayer } from "react-leaflet/TileLayer";
import { GeoJSON, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import path from "path";

import chroma from "chroma-js";

const Route = ({ track, updateMapBounds = true, color = "#000000" }) => {
  // See https://stackoverflow.com/questions/68758035/how-to-render-geojson-polygon-in-react-leaflet-mapcontainer
  const [geojson, setGeojson] = useState(0);
  const map = useMap();
  const router = useRouter();

  useEffect(() => {
    const url = path.join(router.basePath, track);

    // Replace .gpx with .geojson
    const geojsonFile = url.replace(".gpx", ".geojson");

    // read geojson file
    fetch(geojsonFile)
      .then((response) => response.json())
      .then((data) => {
        if (updateMapBounds) {
          // Update map bounds
          map.fitBounds(data.bounds, { padding: [50, 50] });
        }
        setGeojson(data);
      });
  }, []);

  if (geojson) {
    return <GeoJSON data={geojson} color={color} />;
  } else {
    return null;
  }
};

export function MapOverview({ posts, bounds }) {
  const tracks = posts.map((post) => post.track);

  const colors = chroma.scale(["hotpink", "#2A4858"]).mode("lch").colors(3);
  const tracksAndColors = tracks.map((track, index) => {
    return { track, color: colors[index % colors.length] };
  });

  return (
    <div>
      <div className="my-5 h-1/2">
        <MapContainer
          bounds={bounds}
          zoom={4}
          scrollWheelZoom={true}
          className="h-96 w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {tracksAndColors.map((track) => (
            <Route
              key={track.track}
              track={track.track}
              updateMapBounds={false}
              color={track.color}
            />
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

export default function MapPreview({ track }) {
  return (
    <div>
      <div className="my-5 h-1/2">
        <MapContainer
          center={[51.505, -0.09]}
          zoom={4}
          scrollWheelZoom={false}
          className="h-96 w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Route track={track} updateMapBounds={true} />
        </MapContainer>
      </div>
    </div>
  );
}
