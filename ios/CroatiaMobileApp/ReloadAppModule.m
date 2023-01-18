#import "ReloadAppModule.h"

@implementation ReloadAppModule

RCT_EXPORT_MODULE(ReloadApp);

RCT_EXPORT_METHOD(reload)
{
  // This needs to be async dispatched because the bridge is not set on init
  // when the app first starts, therefore rollbacks will not take effect.
  dispatch_async(dispatch_get_main_queue(), ^{
    RCTTriggerReloadCommandListeners(@"Reloading app");
  });
}

@end
