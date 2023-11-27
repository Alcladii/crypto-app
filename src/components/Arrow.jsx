export const Arrow = ({ priceChange }) => {
  return (
    <img
      className="triangle-arrow"
      src={
        priceChange > 0
          ? "https://i.postimg.cc/dttpyy5D/icons8-triangle-96.png"
          : "https://i.postimg.cc/wxknMVcS/icons8-triangle-arrow-96.png"
      }
    />
  );
};
