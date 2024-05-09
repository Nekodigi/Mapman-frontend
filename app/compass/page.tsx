import { useEffect, useState } from "react";

const Compass = () => {
  const [heading, setHeading] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleOrientation = (event: DeviceOrientationEvent) => {
    if (event.alpha !== null) {
      setHeading(event.alpha);
    }
  };

  const requestPermission = async () => {
    window.addEventListener("deviceorientation", handleOrientation);
  };

  useEffect(() => {
    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <button onClick={requestPermission}>Enable Compass</button>
      <h1>
        Compass Heading:{" "}
        {heading !== null ? `${Math.round(heading)}°` : "Unavailable"}
      </h1>
      <div
        style={{
          width: "200px",
          height: "200px",
          backgroundImage: 'url("/compass-image.png")',
          backgroundSize: "cover",
          transform: `rotate(${-(heading || 0)}deg)`,
          transition: "transform 0.5s ease-out",
        }}
      />
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default Compass;
