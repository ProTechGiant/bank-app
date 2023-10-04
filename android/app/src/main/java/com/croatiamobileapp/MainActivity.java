package com.croatiamobileapp;

import android.os.Bundle;
import android.content.Intent;
import android.os.Handler;
import java.lang.Runnable;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactActivityDelegate;
import com.facebook.react.modules.i18nmanager.I18nUtil;

import com.zoontek.rnbootsplash.RNBootSplash;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class MainActivity extends ReactActivity {
  /**
  * Android Deeplink Setup
  * AppsFlyer SDK inspects activity intent object during onResume().
  * Because of that, for each activity that may be configured or launched with any non-standard launch mode
  */
  @Override
  public void onNewIntent(Intent intent) {
    super.onNewIntent(intent);
    setIntent(intent);
    sendEventToJS("notificationTapped" ,false);
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    RNBootSplash.init(this);
    super.onCreate(null);

    I18nUtil sharedI18nUtilInstance = I18nUtil.getInstance();
    sharedI18nUtilInstance.allowRTL(getApplicationContext(), true);
    sendEventToJS("notificationTapped" , true);
  }

  private void sendEventToJS(String eventName, Boolean appWasClosed ) {
    boolean startedFromNotification = getIntent().getBooleanExtra("FromNotification", false);
    if (startedFromNotification) {
      String data = getIntent().getStringExtra("notificationData");
      if (appWasClosed) {
        final Handler handler = new Handler();
        handler.postDelayed(new Runnable() {
          @Override
          public void run() {
          ReactContext reactContext = getReactInstanceManager().getCurrentReactContext();
          reactContext
                  .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                  .emit(eventName, data);
          }
        }, 1000);
      }else{
         ReactContext reactContext = getReactInstanceManager().getCurrentReactContext();
         reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit(eventName, data);
      }
    }
  }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "CroatiaMobileApp";
  }

  /**
   * Returns the instance of the {@link ReactActivityDelegate}. Here we use a util class {@link
   * DefaultReactActivityDelegate} which allows you to easily enable Fabric and Concurrent React
   * (aka React 18) with two boolean flags.
   */
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new DefaultReactActivityDelegate(
        this,
        getMainComponentName(),
        // If you opted-in for the New Architecture, we enable the Fabric Renderer.
        DefaultNewArchitectureEntryPoint.getFabricEnabled(), // fabricEnabled
        // If you opted-in for the New Architecture, we enable Concurrent React (i.e. React 18).
        DefaultNewArchitectureEntryPoint.getConcurrentReactEnabled() // concurrentRootEnabled
    );
  }

  @Override
  protected void onResume() {
    super.onResume();
    handleOnAppStateChange("active");
  }

  @Override
  protected void onPause() {
    super.onPause();
    handleOnAppStateChange("inactive");
  }

  @Override
  protected void onStop() {
    super.onStop();
    handleOnAppStateChange("background");
  }

  private void handleOnAppStateChange(String event) {
    ReactContext reactContext = getReactInstanceManager().getCurrentReactContext();
    if (reactContext != null) {
      reactContext
        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
        .emit("AppStateChange", event);
    }
  }
}
