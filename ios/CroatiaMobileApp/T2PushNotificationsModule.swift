import Foundation
import React
import RiCHNotificationService

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
    DispatchQueue.main.async {
      self.requireAppDelegate().setPromiseResolve(resolver, andPromiseReject: reject)
      UIApplication.shared.registerForRemoteNotifications()
    }
  }

  @objc(registerWithT2:resolver:rejecter:)
  func registerWithT2(_ phoneNumber: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {
    DispatchQueue.main.async {
      self.registerWithT2Exec(phoneNumber, resolver: resolve, rejecter: reject)
    }
  }
  
  private func registerWithT2Exec(_ phoneNumber: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {
     let deviceToken = self.getDeviceToken()

     if (deviceToken == nil) {
       reject("T2PushNotificationsModule", "Cannot register with T2 without a device token available", nil)
     } else {
       RiCHService().registerDevice(
         token: deviceToken!,
         deviceID: UUID().uuidString,
         imeI1: UUID().uuidString,
         imeI2: "",
         mobileNumber: phoneNumber,
         provider: .APNS
       ) { result in
         switch result {
         case .success:
           resolve([true])

         case .failure (let error):
           reject("T2PushNotificationsModule", "Cannot register with T2", error)
         }
       }
     }
  }

  override func supportedEvents() -> [String] {
    return []
  }

  override static func requiresMainQueueSetup() -> Bool {
    return false
  }
}
