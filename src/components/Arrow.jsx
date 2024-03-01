export const Arrow = ({ priceChange }) => {
  return (
    <img
      className="w-2"
      src={
        priceChange > 0
        ? "https://i.ibb.co/zbDF1N6/icons8-triangle-48.png"
        : "https://i.ibb.co/DzMdxQ0/icons8-triangle-48-2.png"
      }
    />
  );
};
