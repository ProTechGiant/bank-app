import { createNavigationContainerRef, ParamListBase } from "@react-navigation/native";

export const navigationRef = createNavigationContainerRef<ParamListBase>();

function navigate(name: string, params: Record<string, any> = {}): void {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
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
