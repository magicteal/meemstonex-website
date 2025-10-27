"use client";

import Image from "next/image";
import ImageTrail, { ImageTrailItem } from "./fancy/image/image-trail";
import { exampleImages } from "@/utils/demo-images";

const AboutImageTrail = ({ bindRef }) => {
  return (
  <div className="absolute inset-0 z-0 pointer-events-none">
      <ImageTrail
        bindRef={bindRef}
        threshold={50}
        keyframes={{ opacity: [0, 1, 1, 0], scale: [1, 1, 2] }}
        keyframesOptions={{
          opacity: { duration: 2, times: [0, 0.001, 0.9, 1] },
          scale: { duration: 2, times: [0, 0.8, 1] },
        }}
        repeatChildren={1}
      >
        {[...exampleImages].map((image, index) => (
          <ImageTrailItem key={index}>
            <div className="h-20 w-20 sm:w-28 sm:h-24 relative overflow-hidden rounded-md shadow-lg">
              <Image
                src={image.url}
                alt="trail"
                fill
                className="object-cover"
                sizes="112px"
                priority={false}
              />
            </div>
          </ImageTrailItem>
        ))}
      </ImageTrail>
    </div>
  );
};

export default AboutImageTrail;
