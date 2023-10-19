//
//  NICardManagementIOSModuleBridge.m
//  NIWrapperCardManagementRN
//
//  Created by Ovidius Zanfir on 22.08.2023.
//

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(NICardManagementIOSModule, NSObject)

RCT_EXTERN_METHOD(getCardDetails:(NSDictionary *)input
                  callback: (RCTResponseSenderBlock)callback)

RCT_EXTERN_METHOD(setPin:(NSString *)pin
                  input:(NSDictionary *)input
                  callback: (RCTResponseSenderBlock)callback)

RCT_EXTERN_METHOD(changePin:(NSString *)oldPin
                  newPin:(NSString *)newPin
                  input:(NSDictionary *)input
                  callback: (RCTResponseSenderBlock)callback)

RCT_EXTERN_METHOD(verifyPin:(NSString *)pin
                  input:(NSDictionary *)input
                  callback: (RCTResponseSenderBlock)callback)
@end

