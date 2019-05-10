#ifndef RNSplashScreen_h
#define RNSplashScreen_h

#import <React/RCTBridgeModule.h>
#import <UIKit/UIKit.h>

@interface RNSplashScreen : NSObject<RCTBridgeModule>
+ (void)show;
+ (void)hide;
@end

#endif /* RNSplashScreen_h */
