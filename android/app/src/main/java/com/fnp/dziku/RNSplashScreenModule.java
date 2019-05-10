package com.fnp.dziku;

import android.app.Activity;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import javax.annotation.Nonnull;

public class RNSplashScreenModule extends ReactContextBaseJavaModule {

  RNSplashScreenModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Nonnull
  @Override
  public String getName() {
    return "RNSplashScreen";
  }

  @ReactMethod
  public void hide() {
    final Activity activity = getCurrentActivity();
    if (activity != null) {
      activity.runOnUiThread(((MainActivity) activity)::switchToReactView);
    }
  }
}
