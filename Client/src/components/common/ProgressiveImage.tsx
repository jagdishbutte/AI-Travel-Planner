import React, { useState } from "react";

export const ProgressiveImage = ({ lowQualitySrc, highQualitySrc, alt }) => {
  const [src, setSrc] = useState(lowQualitySrc);

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onLoad={() => setSrc(highQualitySrc)}
      className="transition-opacity duration-300"
      style={{ opacity: src === lowQualitySrc ? 0.5 : 1 }}
    />
  );
};
