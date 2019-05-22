package com.fnp.fithero;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.res.Configuration;
import android.os.Bundle;
import android.os.PowerManager;
import android.view.animation.AnimationUtils;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactRootView;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;

import java.util.Objects;

import javax.annotation.Nullable;

public class MainActivity extends ReactActivity {

  static String currentLocale;
  private @Nullable ReactRootView mReactRootView;
  private BroadcastReceiver mPowerSaverChangeReceiver;

  /**
   * Returns the name of the main component registered from JavaScript.
   * This is used to schedule rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "FitHero";
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    setTheme(R.style.AppTheme);
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_main);
    MainActivity.currentLocale = getResources().getConfiguration().locale.toString();
  }

  @Override
  protected void onStart() {
    super.onStart();
    mPowerSaverChangeReceiver = new BroadcastReceiver() {
      @Override
      public void onReceive(Context context, Intent intent) {
        final PowerManager pm = (PowerManager) context.getSystemService(Context.POWER_SERVICE);
        assert pm != null;

        Objects.requireNonNull(getReactInstanceManager().getCurrentReactContext())
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit("POWER_SAVE_MODE_CHANGED", pm.isPowerSaveMode());
      }
    };

    IntentFilter filter = new IntentFilter();
    filter.addAction(PowerManager.ACTION_POWER_SAVE_MODE_CHANGED);
    registerReceiver(mPowerSaverChangeReceiver, filter);
  }

  @Override
  protected void onStop() {
    super.onStop();
    unregisterReceiver(mPowerSaverChangeReceiver);
    mPowerSaverChangeReceiver = null;
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
