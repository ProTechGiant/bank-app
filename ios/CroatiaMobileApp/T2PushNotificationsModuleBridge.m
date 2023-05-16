#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#import "AppDelegate.h"

@interface RCT_EXTERN_MODULE(T2PushNotificationsModule, NSObject)
  RCT_EXTERN_METHOD(
    registerForNotifications: (RCTPromiseResolveBlock)resolve
    rejecter: (RCTPromiseRejectBlock)reject
  )

  RCT_EXTERN_METHOD(
    registerWithT2: (NSString *)phoneNumber
    resolver: (RCTPromiseResolveBlock) resolve
    rejecter: (RCTPromiseRejectBlock) reject
  )
@end
