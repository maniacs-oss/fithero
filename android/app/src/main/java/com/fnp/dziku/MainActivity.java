package com.fnp.dziku;

import android.content.res.Configuration;
import android.os.Bundle;
import android.view.animation.AnimationUtils;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;

import javax.annotation.Nullable;

public class MainActivity extends ReactActivity {

  static String currentLocale;
  private @Nullable ReactRootView mReactRootView;

  /**
   * Returns the name of the main component registered from JavaScript.
   * This is used to schedule rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "Dziku";
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    setTheme(R.style.AppTheme);
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_main);
    MainActivity.currentLocale = getResources().getConfiguration().locale.toString();
  }

  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {

    return new ReactActivityDelegate(this, getMainComponentName()) {
      @Override
      protected ReactRootView createRootView() {
        return new RNGestureHandlerEnabledRootView(MainActivity.this);
      }

      @Override
      protected void loadApp(String appKey) {
        if (mReactRootView != null) {
          throw new IllegalStateException("Cannot loadApp while app is already running.");
        }
        mReactRootView = createRootView();
        mReactRootView.startReactApplication(
            getReactNativeHost().getReactInstanceManager(),
            appKey,
            getLaunchOptions());
      }

      @Override
      protected void onDestroy() {
        if (mReactRootView != null) {
          mReactRootView.unmountReactApplication();
          mReactRootView = null;
        }
        if (getReactNativeHost().hasInstance()) {
          getReactNativeHost().getReactInstanceManager().onHostDestroy(getPlainActivity());
        }
      }
    };
  }

  public void switchToReactView() {
    if (mReactRootView != null && !mReactRootView.isAttachedToWindow()) {
      mReactRootView.startAnimation(AnimationUtils.loadAnimation(this, R.anim.fade_in));
      setContentView(mReactRootView);
    }
  }

  @Override
  public void onConfigurationChanged(Configuration newConfig) {
    super.onConfigurationChanged(newConfig);

    String locale = newConfig.locale.toString();
    if (!MainActivity.currentLocale.equals(locale)) {
      MainActivity.currentLocale = locale;
      final ReactInstanceManager instanceManager = getReactInstanceManager();
      instanceManager.recreateReactContextInBackground();
    }
  }
}
