import { useEffect, useRef, useState } from "react";

import "./Map.css";
import LoadingSpinner from "./LoadingSpinner";

const MAX_SDK_WAIT_ATTEMPTS = 20;
const SDK_WAIT_INTERVAL_MS = 250;

const Map = (props) => {
  const mapRef = useRef();
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let attempts = 0;
    let intervalId;

    const initMap = () => {
      clearInterval(intervalId);

      const map = new window.google.maps.Map(mapRef.current, {
        center: props.center,
        zoom: props.zoom,
      });

      new window.google.maps.Marker({
        position: props.center,
        map: map,
      });

      setStatus("ready");
    };

    const tryInitMap = () => {
      if (window.google && window.google.maps) {
        initMap();
        return;
      }

      attempts += 1;
      if (attempts >= MAX_SDK_WAIT_ATTEMPTS) {
        clearInterval(intervalId);
        setStatus("error");
      }
    };

    tryInitMap();
    intervalId = setInterval(tryInitMap, SDK_WAIT_INTERVAL_MS);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.center, props.zoom]);

  return (
    <div
      ref={mapRef}
      className={`map ${props.className}`}
      style={props.style}
    >
      {status === "loading" && (
        <div className="center" style={{ height: "100%" }}>
          <LoadingSpinner />
        </div>
      )}
      {status === "error" && (
        <div className="center" style={{ height: "100%" }}>
          <p>Unable to load the map. Please try again later.</p>
        </div>
      )}
    </div>
  );
};

export default Map;
