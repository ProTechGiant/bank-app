package com.croatiamobileapp.t2notifications;

import android.util.Log;
import androidx.annotation.NonNull;
import com.google.firebase.messaging.RemoteMessage;
import com.t2.t2notifysdk.service.AppFirebaseMessagingService;

public class FirebaseNotificationService extends AppFirebaseMessagingService {
  @Override
  public void onNewToken(@NonNull String token) {
    super.onNewToken(token);

    Log.d("FirebaseNotificationService", "Received FCM token: " + token);
  }

  @Override
  public void onMessageReceived(@NonNull RemoteMessage message) {
    super.onMessageReceived(message);
    Log.i("FirebaseNotificationService ", "Received message : " + message.getMessageType());
  }
}
