import Foundation
import React

#if !targetEnvironment(simulator)
// import RiCHNotificationService
#endif

@objc(T2PushNotificationsModule)
class T2PushNotificationsModule: RCTEventEmitter {
  private func requireAppDelegate() -> AppDelegate {
    return UIApplication.shared.delegate as! AppDelegate
  }

  @objc func getDeviceToken() -> String? {
    return requireAppDelegate().deviceToken
  }

  @objc(registerForNotifications:rejecter:)
  func registerForNotifications(_ resolver: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {
    #if targetEnvironment(simulator)
    resolver([true])
    #else
    DispatchQueue.main.async {
      #if !targetEnvironment(simulator)
      self.requireAppDelegate().setPromiseResolve(resolver, andPromiseReject: reject)
      #endif

      UIApplication.shared.registerForRemoteNotifications()
    }
    #endif
  }

  @objc(registerWithT2:resolver:rejecter:)
  func registerWithT2(_ phoneNumber: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {
    // #if targetEnvironment(simulator)
    print("Skipping registration with T2 since simulator does not support notifications")

    resolve([true])
    // #else
    // let deviceToken = self.getDeviceToken()

    // if (deviceToken == nil) {
    //   reject("T2PushNotificationsModule", "Cannot register with T2 without a device token available", nil)
    // } else {
    //   RiCHService().registerDevice(
    //     token: deviceToken!,
    //     deviceID: UUID().uuidString,
    //     imeI1: UUID().uuidString,
    //     imeI2: "",
    //     mobileNumber: phoneNumber,
    //     provider: .APNS
    //   ) { result in
    //     switch result {
    //     case .success:
    //       resolve([true])

    //     case .failure (let error):
    //       reject("T2PushNotificationsModule", "Cannot register with T2", error)
    //     }
    //   }
    // }
    // #endif
  }

  override func supportedEvents() -> [String] {
    return []
  }

  override static func requiresMainQueueSetup() -> Bool {
    return false
  }
}
