#### JSBridge 实现方式

**URL Scheme**

URL Scheme 是一种最简单的实现方式，通过在 URL 中传递参数，Native 端拦截特定的 URL Scheme 来处理相应的请求。这种方式适用于简单的交互。

| 优点                 | 缺点           |
| -------------------- | -------------- |
| 简单易懂，便于调试   | 数据传输量有限 |
| 不依赖特定的库或框架 | 安全性较低     |

```javascript
// JavaScript 端
function callNative(handlerName, data) {
    const url = `jsbridge://${handlerName}?data=${encodeURIComponent(JSON.stringify(data))}`;
    window.location.href = url;
}
```

**JavaScript Interface**

通过浏览器提供的接口直接调用Native代码，Android：`addJavascriptInterface`，iOS：`WKScriptMessageHandler`

| 优点           | 缺点                   |
| -------------- | ---------------------- |
| 支持双向通信   | 需要更多配置和实现细节 |
| 数据传输量较大 |                        |

```java
// Android
public class JSBridge {
    private Activity activity;

    public JSBridge(Activity activity) {
        this.activity = activity;
    }

    @JavascriptInterface
    public void callHandler(String handlerName, String data) {
        // 处理调用
    }
}

// 在 WebView 初始化时添加接口
webView.addJavascriptInterface(new JSBridge(this), "jsBridge");
```

```objective-c
// ios
@interface JSBridge : NSObject <WKScriptMessageHandler>
@property (nonatomic, weak) WKWebView *webView;

- (instancetype)initWithWebView:(WKWebView *)webView;

@end

@implementation JSBridge

- (instancetype)initWithWebView:(WKWebView *)webView {
    self = [super init];
    if (self) {
        self.webView = webView;
        [webView.configuration.userContentController addScriptMessageHandler:self name:@"jsBridge"];
    }
    return self;
}

- (void)userContentController:(WKUserContentController *)userContentController didReceiveScriptMessage:(WKScriptMessage *)message {
    // 处理消息
}

@end
```

**Custom Protocols**

自定义协议是一种灵活的方案，可以结合上述方式实现更复杂的通信逻辑

| 优点             | 缺点                 |
| ---------------- | -------------------- |
| 灵活性高         | 需要更多的配置和维护 |
| 可以结合多种方法 | 实现复杂             |

```javascript
// JavaScript 端
function callNative(handlerName, data) {
    if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.jsBridge) {
        // iOS
        window.webkit.messageHandlers.jsBridge.postMessage({ handlerName, data });
    } else if (window.jsBridge) {
        // Android
        window.jsBridge.callHandler(handlerName, JSON.stringify(data));
    } else {
        console.error('JSBridge is not available');
    }
}
```

---

#### 简单的来一个JSBridge的示例😄，比如调起摄像头

**web**

```javascript
class JSBridge {
    constructor() {
        window.handleNativeMessage = this.handleNativeMessage.bind(this);
        this.callbacks = {};
    }

    callHandler(handlerName, data, callback) {
        const message = { handlerName, data };
        const jsonMessage = JSON.stringify(message);

        if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.jsBridge) {
            // iOS
            window.webkit.messageHandlers.jsBridge.postMessage(jsonMessage);
        } else if (window.jsBridge) {
            // Android
            window.jsBridge.postMessage(jsonMessage);
        } else {
            console.error('JSBridge is not available');
        }

        if (callback) {
            this.callbacks[handlerName] = callback;
        }
    }

    handleNativeMessage(message) {
        const { handlerName, data } = message;
        if (this.callbacks[handlerName]) {
            this.callbacks[handlerName](data);
            delete this.callbacks[handlerName];
        }
    }
}

const jsBridge = new JSBridge();

// 示例：调用摄像头
document.getElementById('openCameraButton').addEventListener('click', function() {
    jsBridge.callHandler('openCamera', {}, function(response) {
        console.log('Camera opened:', response);
    });
});
```

**android**

1. 消息处理

   ```java
   import android.app.Activity;
   import android.content.Intent;
   import android.provider.MediaStore;
   import android.webkit.JavascriptInterface;
   import android.webkit.WebView;
   
   import org.json.JSONObject;
   
   public class JSBridge {
       private Activity activity;
       private WebView webView;
   
       public JSBridge(Activity activity, WebView webView) {
           this.activity = activity;
           this.webView = webView;
           this.webView.addJavascriptInterface(this, "jsBridge");
       }
   
       @JavascriptInterface
       public void postMessage(String jsonMessage) {
           try {
               JSONObject message = new JSONObject(jsonMessage);
               String handlerName = message.getString("handlerName");
               JSONObject data = message.getJSONObject("data");
   
               if (handlerName.equals("openCamera")) {
                   openCamera(data);
               }
           } catch (Exception e) {
               e.printStackTrace();
           }
       }
   
       public void openCamera(JSONObject data) {
           Intent intent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
           activity.startActivityForResult(intent, REQUEST_CAMERA);
       }
   
       public void sendMessage(String handlerName, JSONObject data, final JSCallback callback) {
           final String javascript = String.format("window.handleNativeMessage('%s', %s)", handlerName, data.toString());
           webView.post(new Runnable() {
               @Override
               public void run() {
                   webView.evaluateJavascript(javascript, null);
               }
           });
       }
   
       public interface JSCallback {
           void onResult(JSONObject response);
       }
   }
   ```

2. 调用摄像头

   ```java
   import android.app.Activity;
   import android.content.Intent;
   import android.provider.MediaStore;
   import android.webkit.WebView;
   
   public class CameraHandler {
       private Activity activity;
       private WebView webView;
   
       public CameraHandler(Activity activity, WebView webView) {
           this.activity = activity;
           this.webView = webView;
       }
   
       public void openCamera() {
           Intent intent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
           activity.startActivityForResult(intent, REQUEST_CAMERA);
       }
   
       @Override
       public void onActivityResult(int requestCode, int resultCode, Intent data) {
           if (requestCode == REQUEST_CAMERA && resultCode == Activity.RESULT_OK) {
               // Process the image and send response via JSBridge
           }
       }
   }
   ```

**ios**

1. 消息处理

   ```objective-c
   #JSBridge.h
   
   #import <Foundation/Foundation.h>
   #import <WebKit/WebKit.h>
   
   @interface JSBridge : NSObject <WKScriptMessageHandler>
   
   @property (nonatomic, weak) WKWebView *webView;
   
   - (instancetype)initWithWebView:(WKWebView *)webView;
   - (void)callHandler:(NSString *)handlerName data:(NSDictionary *)data responseCallback:(void (^)(NSDictionary *response))callback;
   
   @end
   ```

   ```objective-c
   #JSBridge.m
   
   #import "JSBridge.h"
   #import <UIKit/UIKit.h>
   
   @implementation JSBridge
   
   - (instancetype)initWithWebView:(WKWebView *)webView {
       self = [super init];
       if (self) {
           self.webView = webView;
           [webView.configuration.userContentController addScriptMessageHandler:self name:@"jsBridge"];
       }
       return self;
   }
   
   - (void)callHandler:(NSString *)handlerName data:(NSDictionary *)data responseCallback:(void (^)(NSDictionary *response))callback {
       NSDictionary *message = @{@"handlerName": handlerName, @"data": data};
       NSData *jsonData = [NSJSONSerialization dataWithJSONObject:message options:0 error:nil];
       NSString *jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
       NSString *javascript = [NSString stringWithFormat:@"window.handleNativeMessage(%@)", jsonString];
       [self.webView evaluateJavaScript:javascript completionHandler:^(id _Nullable result, NSError * _Nullable error) {
           if (callback) {
               callback(result);
           }
       }];
   }
   
   - (void)userContentController:(WKUserContentController *)userContentController didReceiveScriptMessage:(WKScriptMessage *)message {
       if ([message.name isEqualToString:@"jsBridge"]) {
           NSDictionary *body = message.body;
           NSString *handlerName = body[@"handlerName"];
           NSDictionary *data = body[@"data"];
           
           if ([handlerName isEqualToString:@"openCamera"]) {
               [self openCamera:data];
           }
       }
   }
   
   - (void)openCamera:(NSDictionary *)data {
       UIImagePickerController *picker = [[UIImagePickerController alloc] init];
       picker.sourceType = UIImagePickerControllerSourceTypeCamera;
       picker.delegate = self;
       [self.viewController presentViewController:picker animated:YES completion:nil];
   }
   
   @end
   
   @implementation JSBridge (UIImagePickerControllerDelegate)
   
   - (void)imagePickerController:(UIImagePickerController *)picker didFinishPickingMediaWithInfo:(NSDictionary<UIImagePickerControllerInfoKey,id> *)info {
       UIImage *image = info[UIImagePickerControllerOriginalImage];
       // Process the image and send response via callback
       [picker dismissViewControllerAnimated:YES completion:nil];
   }
   
   - (void)imagePickerControllerDidCancel:(UIImagePickerController *)picker {
       [picker dismissViewControllerAnimated:YES completion:nil];
   }
   
   @end
   ```

2. 调用摄像头

   ```objective-c
   #import <UIKit/UIKit.h>
   #import "JSBridge.h"
   
   @implementation JSBridge (CameraHandler)
   
   - (void)openCamera:(NSDictionary *)data callback:(void (^)(NSDictionary *response))callback {
       UIImagePickerController *picker = [[UIImagePickerController alloc] init];
       picker.sourceType = UIImagePickerControllerSourceTypeCamera;
       picker.delegate = self;
       [self.viewController presentViewController:picker animated:YES completion:nil];
   }
   
   @end
   
   @implementation JSBridge (UIImagePickerControllerDelegate)
   
   - (void)imagePickerController:(UIImagePickerController *)picker didFinishPickingMediaWithInfo:(NSDictionary<UIImagePickerControllerInfoKey,id> *)info {
       UIImage *image = info[UIImagePickerControllerOriginalImage];
       // Process the image and send response via callback
       [picker dismissViewControllerAnimated:YES completion:nil];
   }
   
   - (void)imagePickerControllerDidCancel:(UIImagePickerController *)picker {
       [picker dismissViewControllerAnimated:YES completion:nil];
   }
   
   @end
   ```

   