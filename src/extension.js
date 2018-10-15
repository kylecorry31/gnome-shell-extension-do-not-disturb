const Me = imports.misc.extensionUtils.getCurrentExtension();
const Settings = Me.imports.settings;
const Widget = Me.imports.widgets;
const Lib = Me.imports.lib;

const QuietHoursState = {
  OFF_NOT_QH: 1,
  OFF_USER: 2,
  ON_QH: 3,
  ON_USER: 4
};

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
      this.quietHoursState = QuietHoursState.ON_USER;
    } else {
      this.quietHoursState = QuietHoursState.OFF_NOT_QH;
    }

    this.quietHoursIntervalID = Lib.setInterval(() => {

      switch(this.quietHoursState){
        case QuietHoursState.OFF_NOT_QH:
          if(this._settings.isQuietHours()){
            this._settings.setDoNotDisturb(true);
            this.quietHoursState = QuietHoursState.ON_QH;
          }
        break;
        case QuietHoursState.OFF_USER:
          if(!this._settings.isQuietHours()){
            this.quietHoursState = QuietHoursState.OFF_NOT_QH;
          }
        break;
        case QuietHoursState.ON_QH:
          if(!this._settings.isQuietHours()){
            this._settings.setDoNotDisturb(false);
            this.quietHoursState = QuietHoursState.OFF_NOT_QH;
          }
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
    if(this.quietHoursState === QuietHoursState.ON_QH){
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
    case QuietHoursState.OFF_NOT_QH:
      this.quietHoursState = QuietHoursState.ON_USER;
    break;
    case QuietHoursState.OFF_USER:
      this.quietHoursState = QuietHoursState.ON_USER;
    break;
    case QuietHoursState.ON_QH:
      this.quietHoursState =  QuietHoursState.OFF_USER;
    break;
    case QuietHoursState.ON_USER:
      if(this._settings.isQuietHours()){
        this.quietHoursState = QuietHoursState.OFF_USER;
      } else {
        this.quietHoursState = QuietHoursState.OFF_NOT_QH;
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
