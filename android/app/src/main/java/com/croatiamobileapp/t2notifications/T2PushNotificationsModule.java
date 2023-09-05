package com.croatiamobileapp.t2notifications;

import android.media.RingtoneManager;
import android.net.Uri;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.croatiamobileapp.BuildConfig;
import com.croatiamobileapp.R;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import com.google.android.gms.tasks.Task;
import com.google.firebase.FirebaseApp;
import com.google.firebase.messaging.FirebaseMessaging;

import com.t2.t2notifysdk.ClientListener;
import com.t2.t2notifysdk.Notify;
import com.t2.t2notifysdk.data.ApiConfig;
import com.t2.t2notifysdk.data.ProviderType;
import com.t2.t2notifysdk.notification.NotificationManagerSDK;

import java.util.Objects;

public class T2PushNotificationsModule extends ReactContextBaseJavaModule {
  @Nullable private Notify notify;

  public T2PushNotificationsModule(ReactApplicationContext reactApplicationContext) {
    super(reactApplicationContext);
  }

  @NonNull @Override public String getName() {
    return "T2PushNotificationsModule";
  }

  @ReactMethod
  public void registerForNotifications(Promise promise) {
    promise.resolve(null);
  }

  @ReactMethod
  public void registerWithT2(@NonNull String phoneNumber, Promise promise) {
    Task<String> task = FirebaseApp.getInstance().get(FirebaseMessaging.class).getToken();

    task.addOnCompleteListener(Objects.requireNonNull(getCurrentActivity()), result -> {
      if (result.isSuccessful()) {
        registerWithT2Exec(result.getResult(), phoneNumber, promise);
      } else {
        Log.e("T2NotificationsModule", "Could not retrieve FCM token: " + result.getException().getMessage());
        promise.reject("T2NotificationsModule", "Could not retrieve FCM token");
      }
    });
  }

  private void registerWithT2Exec(@NonNull String deviceToken, @NonNull String phoneNumber, Promise promise) {
    try {
      Log.d("T2NotificationsModule", String.format("Registering with device token '%s' and phone number '%s'", deviceToken, phoneNumber));

      notify = new Notify.Builder(getReactApplicationContext(), "https://notificationrb.rich.sa/api/",
        new ApiConfig(
          BuildConfig.T2_CLIENT_SECRET,
          BuildConfig.T2_CLIENT_ID,
          deviceToken,
          ProviderType.FCM,
          "",
          BuildConfig.APPLICATION_ID
        ),
        BuildConfig.DEBUG, // enable logging
        false, // show error UI
        new NotificationManagerSDK.Builder(
          getReactApplicationContext(),
          getReactApplicationContext().getString(R.string.app_name),
          000,
          true, // enable lights
          true, // enable vibration
          true, // enable sound
          false, // enable "Open" action
          null,
          getDefaultRingtone()).build()
      ).build();
      notify=Notify.Companion.getINSTANCE();
      notify.register(phoneNumber, true, true, new ClientListener() {
        @Override public void onSuccess() {
          Log.d("T2NotificationsModule", "Successfully registered with T2");
          promise.resolve(null);
        }

        @Override public void onFail(@NonNull String errorMessage) {
          Log.e("T2NotificationsModule", "Failed to register with T2: " + errorMessage);
          promise.reject("T2NotificationsModule", "Failed to register with T2: " + errorMessage);
        }
      });
    } catch (Exception e) {
      Log.e("T2NotificationsModule", "Failed to create T2 instance: " + e.getMessage());
      promise.reject("T2NotificationsModule", "Failed to create T2 instance: " + e.getMessage());
    }
  }

  private Uri getDefaultRingtone() {
    return RingtoneManager.getDefaultUri(RingtoneManager.TYPE_RINGTONE);
  }
}
