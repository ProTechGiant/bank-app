package com.croatiamobileapp;

import android.app.Application;
import android.media.RingtoneManager;
import android.net.Uri;

import com.croatiamobileapp.reloadapp.ReloadAppPackage;

import com.croatiamobileapp.t2notifications.T2PushNotificationsPackage;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactNativeHost;
import com.facebook.soloader.SoLoader;
import com.t2.t2notifysdk.Notify;
import com.t2.t2notifysdk.data.ApiConfig;
import com.t2.t2notifysdk.data.ProviderType;
import com.t2.t2notifysdk.notification.NotificationManagerSDK;

import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost =
      new DefaultReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          @SuppressWarnings("UnnecessaryLocalVariable")
          List<ReactPackage> packages = new PackageList(this).getPackages();
          // Packages that cannot be autolinked yet can be added manually here, for example:
          packages.add(new ReloadAppPackage());
          packages.add(new T2PushNotificationsPackage());

          return packages;
        }

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }

        @Override
        protected boolean isNewArchEnabled() {
          return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
        }

        @Override
        protected Boolean isHermesEnabled() {
          return BuildConfig.IS_HERMES_ENABLED;
        }
      };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      // If you opted-in for the New Architecture, we load the native entry point for this app.
      DefaultNewArchitectureEntryPoint.load();
    }
    ReactNativeFlipper.initializeFlipper(this, getReactNativeHost().getReactInstanceManager());

    try {
      Notify notify = new Notify.Builder(this, "https://notificationrb.rich.sa/api/",
        new ApiConfig(
          BuildConfig.T2_CLIENT_SECRET,
          BuildConfig.T2_CLIENT_ID,
          "",
          ProviderType.FCM,
          "",
          BuildConfig.APPLICATION_ID
        ),
        BuildConfig.DEBUG, // enable logging
        false, // show error UI
        new NotificationManagerSDK.Builder(
          this,
          getString(R.string.app_name),
          000,
          true, // enable lights
          true, // enable vibration
          true, // enable sound
          false, // enable "Open" action
          null,
          getDefaultRingtone()).build()
      ).build();
    } catch (Exception e) {
      e.printStackTrace();
    }
  }
  private Uri getDefaultRingtone() {
    return RingtoneManager.getDefaultUri(RingtoneManager.TYPE_RINGTONE);
  }
}