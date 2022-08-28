import { MapContainer } from "react-leaflet/MapContainer";
import { TileLayer } from "react-leaflet/TileLayer";
import { GeoJSON, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import path from "path";

const Route = ({ track }) => {
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
        map.fitBounds(data.bounds, { padding: [50, 50] });
        setGeojson(data);
      });
  }, []);

  if (geojson) {
    return <GeoJSON data={geojson} />;
  } else {
    return null;
  }
};

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
          <Route track={track} />
        </MapContainer>
      </div>
    </div>
  );
}
