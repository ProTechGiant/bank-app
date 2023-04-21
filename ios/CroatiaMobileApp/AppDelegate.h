#import <RCTAppDelegate.h>
#import <UIKit/UIKit.h>

@interface AppDelegate : RCTAppDelegate

@property NSString * _Nullable deviceToken;
@property _Nullable RCTPromiseRejectBlock registerPromiseRejecter;
@property _Nullable RCTPromiseResolveBlock registerPromiseResolver;

- (void)setPromiseResolve:(RCTPromiseResolveBlock _Nonnull )resolve
         andPromiseReject:(RCTPromiseRejectBlock _Nonnull )reject;

@end
