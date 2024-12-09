import React, { CSSProperties } from "react";
import ClipLoader from "react-spinners/ClipLoader";

const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };

const Spinners = ({ color, size }: { color: string; size: number }) => {
  return (
    <ClipLoader
      color={color}
      size={150}
      cssOverride={override}
      aria-label="Loading Spinner"
      data-testid="loader"
    />
  );
};

export default Spinners;
