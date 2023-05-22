export default function generateShadow(elevation: number) {
  return {
    elevation,
    shadowColor: "#282f86",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  };
}
