export default function generateShadow(elevation: number) {
  return {
    elevation,
    shadowColor: "rgb(0, 51, 76)",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  };
}
