package com.croatiamobileapp.reloadapp;

import android.app.Application;
import android.os.Handler;
import android.os.Looper;

import androidx.annotation.NonNull;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class ReloadAppModule extends ReactContextBaseJavaModule {
  private boolean restartInProgress = false;

  public ReloadAppModule(ReactApplicationContext reactApplicationContext) {
    super(reactApplicationContext);
  }

  @ReactMethod
  public void reload() {
    if (this.restartInProgress) return;
    Application mainApplication = getCurrentActivity().getApplication();

    if (!(mainApplication instanceof ReactApplication)) {
      throw new RuntimeException("Application is not a ReactApplication");
    }

    ReactNativeHost reactNativeHost = ((ReactApplication) mainApplication).getReactNativeHost();
    if (reactNativeHost == null) {
      throw new RuntimeException("ReactNativeHost not available");
    }

    restartInProgress = true;
    new Handler(Looper.getMainLooper()).post(new Runnable() {
      @Override
      public void run() {
        reactNativeHost.getReactInstanceManager().recreateReactContextInBackground();
      }
    });
  }

  @NonNull
  @Override
  public String getName() {
    return "ReloadApp";
  }
}
