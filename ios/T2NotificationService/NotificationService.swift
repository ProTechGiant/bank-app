import RiCHNotificationService
import UserNotifications

class NotificationService: UNNotificationServiceExtension {
  var contentHandler: ((UNNotificationContent) -> Void)?
  var bestAttemptContent: UNMutableNotificationContent?
  struct MessageResponse: Codable {
    let title: String
    let body: String
    let stack: String
    let screen: String
    let params: String
  }

  override func didReceive(
    _ request: UNNotificationRequest,
    withContentHandler contentHandler: @escaping (UNNotificationContent) -> Void
  ) {
    self.contentHandler = contentHandler
    bestAttemptContent = (request.content.mutableCopy() as? UNMutableNotificationContent)
    RiCHNotificationExtensionHandler().handleNotification(
      request,
      contentHandler: { content in
        self.bestAttemptContent = content
        if let bestAttemptContent = self.bestAttemptContent {
          let jsonString = self.bestAttemptContent?.body ?? ""
          if let jsonData = jsonString.data(using: .utf8) {
            do {
              // Decode the JSON data into a Swift object
              let message = try JSONDecoder().decode(MessageResponse.self, from: jsonData)
              bestAttemptContent.title = message.title
              bestAttemptContent.body = message.body
              bestAttemptContent.userInfo["stack"] = message.stack
              bestAttemptContent.userInfo["screen"] = message.screen
              bestAttemptContent.userInfo["params"] = message.params
            } catch {
              print("Error decoding JSON: \(error)")
            }
          }
          contentHandler(bestAttemptContent)
        }
      })
  }

  override func serviceExtensionTimeWillExpire() {
    // Called just before the extension will be terminated by the system.
    // Use this as an opportunity to deliver your "best attempt" at modified content, otherwise the original push payload will be used.
    if let contentHandler = contentHandler, let bestAttemptContent = bestAttemptContent {
      contentHandler(bestAttemptContent)
    }
  }
}
