#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTI18nUtil.h>
#import <React/RCTConvert.h>
#import "RNBootSplash.h"
#import <RNAppsFlyer.h>

#import "CroatiaMobileApp-Bridging-Header.h"

// Deletes all Keychain items accessible by this app if this is the first time the user launches the app
static void ClearKeychainIfNecessary() {
    // Checks wether or not this is the first time the app is run
    if ([[NSUserDefaults standardUserDefaults] boolForKey:@"HAS_RUN_BEFORE"] == NO) {
        // Set the appropriate value so we don't clear next time the app is launched
        [[NSUserDefaults standardUserDefaults] setBool:YES forKey:@"HAS_RUN_BEFORE"];
        NSArray *secItemClasses = @[
            (__bridge id)kSecClassGenericPassword,
            (__bridge id)kSecClassInternetPassword,
            (__bridge id)kSecClassCertificate,
            (__bridge id)kSecClassKey,
            (__bridge id)kSecClassIdentity
        ];
        // Maps through all Keychain classes and deletes all items that match
        for (id secItemClass in secItemClasses) {
            NSDictionary *spec = @{(__bridge id)kSecClass: secItemClass};
            SecItemDelete((__bridge CFDictionaryRef)spec);
        }
    }
}

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  ClearKeychainIfNecessary();
  [[RCTI18nUtil sharedInstance] allowRTL: YES];

  self.moduleName = @"CroatiaMobileApp";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

  [super application:application didFinishLaunchingWithOptions:launchOptions];
  [RNBootSplash initWithStoryboard:@"BootSplash" rootView:self.window.rootViewController.view];

  return YES;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

/// This method controls whether the `concurrentRoot`feature of React18 is turned on or off.
///
/// @see: https://reactjs.org/blog/2022/03/29/react-v18.html
/// @note: This requires to be rendering on Fabric (i.e. on the New Architecture).
/// @return: `true` if the `concurrentRoot` feature is enabled. Otherwise, it returns `false`.
- (BOOL)concurrentRootEnabled
{
  return true;
}

#pragma mark - AppsFlyer

// Deep linking open URI-scheme for iOS 9 and above
- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url options:(NSDictionary *) options {
  [[AppsFlyerAttribution shared] handleOpenUrl:url options:options];
    return YES;
}

// Open Universal Links
- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity restorationHandler:(void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler {
  [[AppsFlyerAttribution shared] continueUserActivity:userActivity restorationHandler:restorationHandler];

  return YES;
}

#pragma mark - T2 (Push) Notifications

// used to temporarily store a promise instance to resolve calls to `registerForRemoteNotifications`
- (void)setPromiseResolve:(RCTPromiseResolveBlock)resolve
         andPromiseReject:(RCTPromiseRejectBlock)reject {
  _registerPromiseResolver = resolve;
  _registerPromiseRejecter = reject;
}

// called when `registerForRemoteNotifications` completes successfully
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
  self.deviceToken = [self APNSTokenFromNSData:deviceToken];

  if (_registerPromiseResolver != nil) {
    _registerPromiseResolver(@(
        [RCTConvert BOOL:@([UIApplication sharedApplication].isRegisteredForRemoteNotifications)]));
    _registerPromiseResolver = nil;
    _registerPromiseRejecter = nil;
  }
}

// called when `registerForRemoteNotifications` fails to complete
- (void)application:(UIApplication *)application
    didFailToRegisterForRemoteNotificationsWithError:(NSError *)error {
  if (_registerPromiseRejecter != nil) {
    [self rejectPromiseWithNSError:_registerPromiseRejecter error:error];
    _registerPromiseResolver = nil;
    _registerPromiseRejecter = nil;
  }
}

- (void)rejectPromiseWithNSError:(RCTPromiseRejectBlock)reject error:(NSError *)error {
  NSMutableDictionary *userInfo = [NSMutableDictionary dictionary];

  [userInfo setValue:@(NO) forKey:@"fatal"];
  [userInfo setValue:@"unknown" forKey:@"code"];
  [userInfo setValue:error.localizedDescription forKey:@"message"];
  [userInfo setValue:@(error.code) forKey:@"nativeErrorCode"];
  [userInfo setValue:error.localizedDescription forKey:@"nativeErrorMessage"];

  NSError *newErrorWithUserInfo = [NSError errorWithDomain:RCTErrorDomain
                                                      code:666
                                                  userInfo:userInfo];
  reject(@"unknown", error.localizedDescription, newErrorWithUserInfo);
}

- (NSString *)APNSTokenFromNSData:(NSData *)tokenData {
  const char *data = (const char*)[tokenData bytes];

  NSMutableString *token = [NSMutableString string];
  for (NSInteger i = 0; i < tokenData.length; i++) {
    [token appendFormat:@"%02.2hhX", data[i]];
  }

  return [token copy];
}

@end
