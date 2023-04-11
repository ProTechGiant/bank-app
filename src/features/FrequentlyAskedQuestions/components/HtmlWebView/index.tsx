import { useState } from "react";
import { Platform } from "react-native";
import WebView from "react-native-webview";
import { ShouldStartLoadRequest, WebViewMessageEvent } from "react-native-webview/lib/WebViewTypes";

import { useThemeStyles } from "@/theme";

interface WebViewDimensionsMessage {
  type: "dimensions";
  dimensions: {
    layoutViewport: { width: number; height: number };
    content: { width: number; height: number };
  };
}

interface HtmlWebViewProps {
  html: string;
  onLinkPress: (href: string) => void;
}

export default function HtmlWebView({ html, onLinkPress }: HtmlWebViewProps) {
  const [webViewHeight, setWebViewHeight] = useState(100);

  const fontSize = useThemeStyles<number>(theme => theme.typography.text.sizes.callout);
  const fontColor = useThemeStyles<string>(theme => theme.palette["neutralBase+30"]);
  const spacing = useThemeStyles<number>(theme => theme.spacing["16p"]);

  const fontFamily = Platform.OS === "ios" ? "-apple-system, BlinkMacSystemFont, sans-serif" : "Roboto";

  const htmlStyle = `<style type="text/css"> 
  body {
    white-space: pre-line; 
    color: ${fontColor}; 
    font-size: ${fontSize}px; 
    font-family: ${fontFamily}; 
    margin: 0; padding: 0; 
  }
 
  b { 
    font-size: ${fontSize}px; 
    font-family: ${fontFamily}; 
  } 
  
  span, div { 
      font-size: ${fontSize}px; 
  }
 
  /* Removes redundant margins around p-elements */ 
  body > p:first-child, body > div > p:first-child, body > div > span:first-child { 
    margin: 0; 
    padding: 0; 
  } 
  
  table {
    width: 100%; 
    border-collapse: collapse; 
    margin-top: ${spacing}px; 
    margin-bottom: ${spacing}px; 
  } 
  
  tr:first-child td { 
    background: ${undefined}; 
  }
 
  tr:first-child td > strong { 
    color: ${fontColor}; 
    font-weight: normal; 
  }
 
  td, th { 
    padding: 4px 2px 4px 2px; 
    border: 1px solid ${fontColor}; 
    border-left: none; 
    border-right: none; 
    text-align: left; 
    font-size: ${fontSize}px; 
  }

</style>`;

  const source = {
    html: ` 
  <!DOCTYPE html> 
    <html> 
      <head> 
        ${htmlStyle}
        <meta http-equiv="content-type" content="text/html; charset=utf-8"> 
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" /> 
      </head> 
        <body> 
          ${html} 
        </body> 
    </html> `,
    baseUrl: "",
  };

  // Injected Js will calulcate size of webview and sends this using postMessage method
  const injectedJs = `
  /* Need to remove target=_blank on links or onShoudStartLoadingWithRequest doesnt get called on Android */
  Array.from(document.querySelectorAll('a[target="_blank"]')) .forEach(link => link.removeAttribute('target')); 
  
  var deltaMin = 0; 
  
  var oldDimensions = { 
    layoutViewport: { width: 0, height: 0 },
    content: { width: 0, height: 0 } 
  }; 
  
  function extractNumericValue(pixelString) { 
    return pixelString ? parseFloat(pixelString.match(/[\\d.]+/)) : 0; 
  } 
  
  function dimensionsAreEqual(d1, d2) { 
    return ( 
      Math.abs(d1.layoutViewport.width - d2.layoutViewport.width) < deltaMin && 
      Math.abs(d1.layoutViewport.height - d2.layoutViewport.height) < deltaMin && 
      Math.abs(d1.content.width - d2.content.width) < deltaMin && 
      Math.abs(d1.content.height - d2.content.height) < deltaMin 
      ); 
    } 
    
  function postSize() { 
    var bodyStyle = window.getComputedStyle(document.body); 
    var bodySize = document.body.getBoundingClientRect(); 
    var marginRight = extractNumericValue(bodyStyle.marginRight); 
    var marginBottom = extractNumericValue(bodyStyle.marginBottom); 
    var layoutViewport = { 
      width: document.documentElement.clientWidth, 
      height: document.documentElement.clientHeight 
    }; 
    var dimensions = { 
      layoutViewport, 
      content: { 
        width: bodySize.right + marginRight, 
        height: bodySize.bottom + marginBottom 
      } 
    }; 
    
    if (!dimensionsAreEqual(oldDimensions, dimensions)) { 
      window.ReactNativeWebView.postMessage(JSON.stringify({ dimensions, type: "dimensions" }));
      oldDimensions = dimensions; 
    } 
  } 
  
  const resizeObserver = new window.ResizeObserver(() => postSize()); 
  resizeObserver.observe(document.body); 
  postSize();
  `;

  const handleShoudStartLoadingWithRequest = (request: ShouldStartLoadRequest) => {
    setImmediate(() => {
      if (!request.url || request.url === "about:blank" || request.url.startsWith("file://")) return;
      onLinkPress(request.url);
    });
    return request.url === "about:blank" || request.url.startsWith("file://");
  };

  // InjectedJS will send postMessage with dimensions, when recieved webviewHeight can be dynamically set
  const handleOnMessage = (event: WebViewMessageEvent) => {
    const content = JSON.parse(event.nativeEvent.data) as WebViewDimensionsMessage;
    if (content.type === "dimensions") setWebViewHeight(content.dimensions.content.height);
  };

  return (
    <WebView
      originWhitelist={["*"]}
      injectedJavaScript={injectedJs}
      onMessage={handleOnMessage}
      onShouldStartLoadWithRequest={handleShoudStartLoadingWithRequest}
      scrollEnabled={false}
      scalesPageToFit={false}
      source={source}
      // eslint-disable-next-line react-native/no-inline-styles
      style={{ flex: 1, height: webViewHeight + 1, backgroundColor: "#FF00FF00", opacity: 0.99 }}
    />
  );
}
