import React, { useState } from 'react';
import ReactMapGL, { Marker } from 'react-map-gl';
const apiKey = process.env.REACT_APP_MAPBOX_KEY;

export const ResponseMap = ({ responses }) => {
  const [latitude, longitude] =
    responses.filter((r) => r.geo)[0]?.geo?.ll ?? [];
  const [viewport, setViewport] = useState({
    width: '100%',
    height: 200,
    latitude,
    longitude,
    zoom: 1,
  });

  return (
    <div className="mb-4 rounded-3 overflow-hidden">
      <ReactMapGL
        mapboxApiAccessToken={apiKey}
        {...viewport}
        mapStyle="mapbox://styles/mapbox/streets-v8"
        onViewportChange={(nextViewport) => setViewport(nextViewport)}
      >
        {responses
          .filter((r) => r.geo && r.geo.ll)
          .map((response) => (
            <Marker
              key={response.id}
              latitude={response.geo.ll[0]}
              longitude={response.geo.ll[1]}
              offsetLeft={viewport.zoom - 10}
              offsetTop={viewport.zoom - 10}
            >
              <span role="img" aria-label="reponse map pin">
                📍
              </span>
            </Marker>
          ))}
      </ReactMapGL>
    </div>
  );
};
