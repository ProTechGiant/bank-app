package com.croatiamobileapp;

import android.util.Log;

import androidx.annotation.NonNull;

import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

import static com.google.firebase.messaging.Constants.MessageNotificationKeys.TAG;

public class FirebaseNotificationService extends FirebaseMessagingService {

@Override
public void onNewToken(@NonNull String token) {
  Log.d(TAG, "Token: " + token);

  }

@Override
public void onMessageReceived(@NonNull RemoteMessage message) {
  super.onMessageReceived(message);
  Log.i("FirebaseServiceMessage ", "Message :: " + message);
}
}

