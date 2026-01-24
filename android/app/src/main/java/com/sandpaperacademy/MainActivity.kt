package com.sandpaperacademy

import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        // Show splash theme first
        setTheme(R.style.SplashTheme)
        super.onCreate(savedInstanceState)

        // Switch to normal app theme
        setTheme(R.style.AppTheme)
    }

    override fun getMainComponentName(): String = "SandpaperAcademy"

    override fun createReactActivityDelegate(): ReactActivityDelegate =
        DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
