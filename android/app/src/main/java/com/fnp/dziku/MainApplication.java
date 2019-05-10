package com.fnp.dziku;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.swmansion.rnscreens.RNScreensPackage;
import com.facebook.react.bridge.ReadableNativeArray;
import com.facebook.react.bridge.ReadableNativeMap;
import com.github.wuxudong.rncharts.MPAndroidChartPackage;
import is.uncommon.rn.widgets.TabbedViewPagerAndroidPackage;

import cl.json.RNSharePackage;
import cl.json.ShareApplication;

import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.reactcommunity.rnlocalize.RNLocalizePackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.bugsnag.BugsnagReactNative;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.oblador.vectoricons.VectorIconsPackage;

import expo.modules.constants.ConstantsPackage;
import expo.modules.filesystem.FileSystemPackage;
import org.unimodules.adapters.react.ModuleRegistryAdapter;
import org.unimodules.adapters.react.ReactAdapterPackage;
import org.unimodules.adapters.react.ReactModuleRegistryProvider;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import expo.modules.documentpicker.DocumentPickerPackage;
import io.realm.react.RealmReactPackage;

public class MainApplication extends Application implements ReactApplication, ShareApplication {

  private final ReactModuleRegistryProvider mModuleRegistryProvider = new ReactModuleRegistryProvider(Arrays.asList(
      new ReactAdapterPackage(),
      new FileSystemPackage(),
      new ConstantsPackage(),
      new DocumentPickerPackage()
  ), Collections.emptyList());

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.asList(
          new MainReactPackage(),
          new RNScreensPackage(),
          new MPAndroidChartPackage(),
          new TabbedViewPagerAndroidPackage(),
          new AsyncStoragePackage(),
          new RNGestureHandlerPackage(),
          BugsnagReactNative.getPackage(),
          new RealmReactPackage(),
          new RNLocalizePackage(),
          new VectorIconsPackage(),
          new RNSharePackage(),
          new ModuleRegistryAdapter(mModuleRegistryProvider),
          new RNSplashScreenPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    ReadableNativeArray.setUseNativeAccessor(true);
    ReadableNativeMap.setUseNativeAccessor(true);
  }

  @Override
  public String getFileProviderAuthority() {
    return BuildConfig.APPLICATION_ID + ".provider";
  }
}
