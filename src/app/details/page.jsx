"use client";

import IntroLayout from "../../components/layout/IntroLayout";
import SliceFormSlider from "./SliceFormSlider";
import ProgressNav from "./ProgressNav";
import useSliceSlider from "./useSliceSlider";

export default function DetailsPage() {
  const sliderControls = useSliceSlider();
  const { index, total } = sliderControls;

  return (
    <IntroLayout sidebar={null}>
      <div className="details-bg relative min-h-screen w-full">
        <div className="absolute top-30 left-30 text-gray-400 tracking-widest text-4xl">
          PERSONAL DETAILS
        </div>

        <SliceFormSlider sliderControls={sliderControls} />
        <ProgressNav currentIndex={index} total={total} />
      </div>
    </IntroLayout>
  );
}