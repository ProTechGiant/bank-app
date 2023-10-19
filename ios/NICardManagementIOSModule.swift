//
//  This module provides programatic methods for various card management operations using the NICardManagementSDK.
//
//  NICardManagementIOSModule.swift
//  NIWrapperCardManagementRN
//
//  Created by Ovidius Zanfir on 22.08.2023.
//

import Foundation
import NICardManagementSDK // Import your SDK
import React

func createNIInput(from input: NSDictionary) -> NIInput {
    let bankCode = input["bankCode"] as? String ?? ""
    let cardIdentifierId = input["cardIdentifierId"] as? String ?? ""
    let cardIdentifierType = input["cardIdentifierType"] as? String ?? ""
    let connectionProperties = input["connectionProperties"] as? NSDictionary

    let rootUrl = connectionProperties?["rootUrl"] as? String ?? ""
    let token = connectionProperties?["token"] as? String ?? ""
        
    let niConnection = NIConnectionProperties(
      rootUrl: rootUrl,
      token: token
    )
        
    let niInput = NIInput(
        bankCode: bankCode,
        cardIdentifierId: cardIdentifierId,
        cardIdentifierType: cardIdentifierType,
        connectionProperties: niConnection
    )
    return niInput
}

@objc(NICardManagementIOSModule)
class NICardManagementIOSModule: NSObject {
  
  typealias Callback = (Result<String, Error>) -> Void

  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  @objc
  func getCardDetails(_ input: NSDictionary, callback: @escaping RCTResponseSenderBlock) {
      let niInput = createNIInput(from: input)
      NICardManagementAPI.getCardDetails(input: niInput) { successResponse, errorResponse, completion in
          if let error = errorResponse {
            let errorCode = Int(error.errorCode) ?? 500
            let customError: [String: Any?] = [
                            "domain": "com.NICardManagementSDK",
                            "code": errorCode,
                            "message": error.errorMessage
                        ]
            callback([customError, NSNull()])
          } else if let success = successResponse {
           let cardDetailsObject: [String: Any?] = [
                           "clearPan": success.clearPan,
                           "maskedPan": success.maskedPan,
                           "expiry": success.expiry,
                           "clearCVV2": success.clearCVV2,
                           "cardholderName": success.cardholderName
                       ]
            callback([NSNull(), cardDetailsObject])
          }
      }
  }
  
  @objc
  func setPin(_ pin: String, input: NSDictionary, callback: @escaping RCTResponseSenderBlock) {
      let niInput = createNIInput(from: input)
      
      NICardManagementAPI.setPin(pin: pin, input: niInput) { successResponse, errorResponse, completion in
          if let error = errorResponse {
            let errorCode = Int(error.errorCode) ?? 500
            let customError: [String: Any?] = [
                            "domain": "com.NICardManagementSDK",
                            "code": errorCode,
                            "message": error.errorMessage
                        ]
            callback([customError, NSNull()])
          } else if let success = successResponse {
            callback([NSNull(), success.message])
          }
      }
  }

  
  @objc
  func changePin(_ oldPin: String, newPin: String, input: NSDictionary, callback: @escaping RCTResponseSenderBlock) {
      let niInput = createNIInput(from: input)
      NICardManagementAPI.changePin(oldPin: oldPin, newPin: newPin, input: niInput) { successResponse, errorResponse, completion in
        if let error = errorResponse {
          let errorCode = Int(error.errorCode) ?? 500
          let customError: [String: Any?] = [
                          "domain": "com.NICardManagementSDK",
                          "code": errorCode,
                          "message": error.errorMessage
                      ]
          callback([customError, NSNull()])
        } else if let success = successResponse {
          callback([NSNull(), success.message])
        }
      }
  }

  @objc
  func verifyPin(_ pin: String, input: NSDictionary, callback: @escaping RCTResponseSenderBlock) {
      let niInput = createNIInput(from: input)
      
      NICardManagementAPI.verifyPin(pin: pin, input: niInput) { successResponse, errorResponse, completion in
        if let error = errorResponse {
          let errorCode = Int(error.errorCode) ?? 500
          let customError: [String: Any?] = [
                          "domain": "com.NICardManagementSDK",
                          "code": errorCode,
                          "message": error.errorMessage
                      ]
          callback([customError, NSNull()])
        } else if let success = successResponse {
          callback([NSNull(), success.message])
        }
      }
  }

}
