"use client";
import Lottie from "lottie-react";
import emailAnimation from "../../../public/lottie/email.json"; // Adjust the path if necessary

type LottieComponentProps = {
  animationData?: object; // The animation data
  width?: number | string; // Width of the animation
  height?: number | string; // Height of the animation
};
const LottieComponent: React.FC<LottieComponentProps> = ({
  animationData = emailAnimation,
  width = 300,
  height = 300,
}) => {
  return (
    <div
      style={{
        width,
        height,
      }}
    >
      <Lottie
        animationData={animationData}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};

export default LottieComponent;
