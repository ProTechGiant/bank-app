import noop from "lodash/noop";

export default function useNavigation() {
  return { navigate: noop, goBack: noop };
}
