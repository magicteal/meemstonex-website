"use client";

import { useEffect, useRef } from "react";
import ImageTrail from "./ImageTrail";
import { exampleImages } from "@/utils/demo-images";

const defaultUrls = exampleImages.map((img) => img.url);

// Wrapper that only enables the trail when the mouse is inside this section
const AboutImageTrail = ({ items }) => {
  const urls = items && items.length > 0 ? items : defaultUrls;
  return (
    <ImageTrail items={urls} variant={2} listenTarget="container" />
  );
};

export default AboutImageTrail;
