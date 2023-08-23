import { createNavigationContainerRef, ParamListBase } from "@react-navigation/native";

export const navigationRef = createNavigationContainerRef<ParamListBase>();

function navigate(stack: string, screen: string | undefined, params: Record<string, unknown> | undefined) {
  if (screen === undefined) {
    navigationRef.navigate(stack, params);
  } else {
    navigationRef.navigate(stack, { screen, params });
  }
}

function reset(state: Partial<Readonly<ReturnType<typeof navigationRef.getCurrentRoute>>>): void {
  if (navigationRef.isReady()) {
    navigationRef.reset(state);
  }
}

function getCurrentRoute(): ReturnType<typeof navigationRef.getCurrentRoute> | undefined {
  if (navigationRef.isReady()) {
    return navigationRef.getCurrentRoute();
  }
  return undefined;
}

export default { navigate, reset, getCurrentRoute };
