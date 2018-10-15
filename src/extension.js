const Me = imports.misc.extensionUtils.getCurrentExtension();
const Settings = Me.imports.settings;
const Widget = Me.imports.widgets;
const Lib = Me.imports.lib;

/**
 * Called when the extension is loaded.
 */
function init() {
}

/**
 * Enable the do not disturb extension. Adds all UI elements and monitors the settings object.
 */
function enable() {

    this._lastMuteState = false;

    this._disturbToggle = new Widget.DoNotDisturbToggle();
    this._disturbToggle.show();

    this._hideDotController = new Widget.HideDotController();

    this._enabledIcon = new Widget.DoNotDisturbIcon();

    this._settings = new Settings.SettingsManager();

    this._disturbToggle.onToggleStateChanged(() => _toggle());

    this._settings.onDoNotDisturbChanged(() => _sync());
    this._settings.onShowIconChanged(() => _sync());
    this._settings.onHideNotificationDotChanged(() => _sync());
    this._settings.onMuteSoundChanged(() => _sync());

    // TODO: load
    if(this._settings.isDoNotDisturb()){
      this.quietHoursState = 4;
    } else {
      this.quietHoursState = 1;
    }

    this.quietHoursIntervalID = Lib.setInterval(() => {

      switch(this.quietHoursState){
        case 1:
          if(this._settings.isQuietHours()){
            this._settings.setDoNotDisturb(true);
            this.quietHoursState = 3;
          }
          // TODO: If user turns off
        break;
        case 2:
          if(!this._settings.isQuietHours()){
            this.quietHoursState = 1;
          }
          // TODO: If user turns on
        break;
        case 3:
          if(!this._settings.isQuietHours()){
            this._settings.setDoNotDisturb(false);
            this.quietHoursState = 1;
          }
          // TODO: If user turns off
        break;
        case 4:
          // If user turns off
        break;
      }

    }, 1000);

    this._sync();
}

/**
 * Disables the extension. Tears down all UI components.
 */
function disable() {
    // TODO: save state
    if(this.quietHoursState === 3){
      this._settings.setDoNotDisturb(false);
    }

    this._disturbToggle.destroy();
    this._enabledIcon.destroy();
    this._hideDotController.unhideDot();
    this._settings.disconnectAll();
    Lib.clearInterval(this.quietHoursIntervalID);
}

/**
 * Toggle the status of the do not disturb mode in _settings.
 */
function _toggle(){
  switch(this.quietHoursState){
    case 1:
      this.quietHoursState = 4;
    break;
    case 2:
      this.quietHoursState = 4;
    break;
    case 3:
      this.quietHoursState =  2;
    break;
    case 4:
      if(this._settings.isQuietHours()){
        this.quietHoursState = 2;
      } else {
        this.quietHoursState = 1;
      }
    break;
  }
  this._settings.setDoNotDisturb(this._disturbToggle.getToggleState()); // This will trigger a call to _sync
}

/**
 * Updates the UI based on the _settings. Includes switching the toggle state and showing the status icon.
 */
function _sync(){
  let enabled = this._settings.isDoNotDisturb();
  let showIcon = this._settings.shouldShowIcon();
  let hideDot = this._settings.shouldHideNotificationDot();
  let muteSounds = this._settings.shouldMuteSound();
  if(enabled && showIcon){
      this._enabledIcon.hide();
      this._enabledIcon.show();
  } else {
    this._enabledIcon.hide();
  }

  if(enabled && hideDot){
    this._hideDotController.hideDot();
  } else {
    this._hideDotController.unhideDot();
  }

  if(enabled && muteSounds){
    this._settings.muteAllSounds();
  } else if (this._lastMuteState && !muteSounds){
    this._settings.unmuteAllSounds();
  }

  this._lastMuteState = muteSounds;

  this._disturbToggle.setToggleState(enabled);
}
