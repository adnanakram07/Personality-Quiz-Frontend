"use client";

import IntroLayout from "../../components/layout/IntroLayout";
import SliceFormSlider from "./SliceFormSlider";
import useSliceSlider from "./useSliceSlider";
import BrandTags from "../../components/BrandTags";
import NavigationSidebar from "../../components/NavigationSidebar";

import { Manrope } from "next/font/google";

const manrope = Manrope({ 
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"]
});

export default function DetailsPage() {
  const sliderControls = useSliceSlider();

  return (
    <IntroLayout sidebar={<NavigationSidebar />}>
      <div className={`details-bg relative min-h-screen w-full ${manrope.className}`}>
        <div className="details-header">
          PERSONAL DETAILS
        </div>

        <SliceFormSlider sliderControls={sliderControls} />
        
        <BrandTags />
      </div>
    </IntroLayout>
  );
}