
package com.croatiamobileapp.t2notifications;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.content.Intent;
import android.app.PendingIntent;

import androidx.core.app.NotificationCompat;

import com.croatiamobileapp.MainActivity;
import com.croatiamobileapp.R;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.util.Random;

public class NotificationUtils {

    public static void handleIncomingNotification(Context context, String body) {
      NotificationModel notification = parseBody(body);
            showNotification(context, notification, body);
    }

    private static void showNotification(Context context, NotificationModel notification, String NotificationBodyIntial) {
      String CHANNEL_ID = "RichNotificationChannelID";
        createChannelId(context, CHANNEL_ID);
        NotificationCompat.Builder builder = new NotificationCompat.Builder(context, CHANNEL_ID)
                .setSmallIcon(R.mipmap.ic_launcher)
                .setContentTitle(notification.title)
                .setContentText(notification.body)
                .setPriority(NotificationCompat.PRIORITY_MAX)
                .setContentIntent(getNotificationIntent(context, notification, NotificationBodyIntial))
                .setAutoCancel(true);
        int notificationId = new Random().nextInt(9999); // TODO will be replaced with id from notification content
        NotificationManager notificationManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        if (notificationManager != null) {
        notificationManager.notify(notificationId, builder.build());
        }
    }

    public static NotificationModel parseBody(String body) {
        try {
            Gson gson = new GsonBuilder().setLenient().create();
            return gson.fromJson(body, NotificationModel.class);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    private static void createChannelId(Context context, String channelId) {
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
            // Create the NotificationChannel.
            String name = "RichNotificationChannelID";
            String descriptionText = "RichNotificationChannelDescription";
            int importance = NotificationManager.IMPORTANCE_HIGH;
            NotificationChannel mChannel = new NotificationChannel(channelId, name, importance);
            mChannel.setDescription(descriptionText);
            NotificationManager notificationManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
            if (notificationManager != null) {
                notificationManager.createNotificationChannel(mChannel);
            }
        };
    }

    private static PendingIntent getNotificationIntent(Context context, NotificationModel notification, String NotificationBodyIntial) {
        Intent intent = new Intent(context, MainActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        intent.putExtra("FromNotification", true);
        intent.putExtra("notificationData", NotificationBodyIntial);
        return PendingIntent.getActivity(context, 0, intent, PendingIntent.FLAG_IMMUTABLE);
    }
}

 