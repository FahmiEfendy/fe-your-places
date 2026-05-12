import { useEffect, useRef } from "react";

import "./Map.css";

const Map = (props) => {
  const mapRef = useRef();

  useEffect(() => {
    if (!window.google || !window.google.maps) {
      console.error("Google Maps SDK not loaded.");
      return;
    }

    const map = new window.google.maps.Map(mapRef.current, {
      center: props.center,
      zoom: props.zoom,
    });

    new window.google.maps.Marker({
      position: props.center,
      map: map,
    });
  }, [props.center, props.zoom]);

  return (
    <div
      ref={mapRef}
      className={`map ${props.className}`}
      style={props.style}
    ></div>
  );
};

export default Map;
