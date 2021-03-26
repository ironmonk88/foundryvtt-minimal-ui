class MinimalUI {
  
  static hotbarLocked = false;
  static controlsLocked = false;
  static cssControlsLastPos = '0px';
  
  static cssLeftBarStartVisible = '0px';
  static cssLeftBarHiddenPosition = '-60px';
  
  static cssLeftBarSubMenuSmall = '50px';
  static cssLeftBarSubMenuStandard = '60px';
  
  static cssLeftBarPaddingDefault = '7px';
  static cssLeftBarPaddingSmall = '30px';
  static cssLeftBarPaddingStandard = '20px';
    
  static cssLeftBarSmallWidth = '25px';
  static cssLeftBarSmallHeight = '28px';
  static cssLeftBarSmallLineHeight = '30px';
  static cssLeftBarSmallFontSize = '15px';
  
  static cssLeftBarVerticalPositionTop = '8vmin';
  static cssLeftBarVerticalPositionCenter = '20vmin';
  static cssLeftBarVerticalPositionLower = '30vmin';
  static cssLeftBarVerticalPositionBottom = '40vmin';
  
  static cssHotbarHidden = '-50px';
  static cssHotbarReveal = '1px';
  static cssHotbarShown = '10px';
  
  static cssHotbarLeftControlsLineHeight = '12px';
  static cssHotbarRightControlsLineHeight = '20px';
  static cssHotbarControlsAutoHideHeight = '120%';
  static cssHotbarAutoHideHeight = '1px';
  static cssHotbarControlsMargin = '-10px';
  
  static cssSceneNavBullseyeStart = '125px';
  
  static cssMinimumMacroBarX = 170;
  
  static cssPlayersDefaultFontSize = '12px';
  static cssPlayersDefaultWidth = '150px';
  
  static htmlHotbarLockButton =
    `
    <a id="bar-lock">
      <i class="fas fa-lock-open"></i>
    </a>
    `
  
  static collapse(toggleId) {
    let target = document.getElementById(toggleId);
    if (target) {
      target.click();
    }
  }

  static lockControls(unlock) {
    let rootStyle = document.querySelector(':root').style;
    if (!MinimalUI.controlsLocked) {
      MinimalUI.controlsLocked = true;
      MinimalUI.cssControlsLastPos = rootStyle.getPropertyValue('--leftbarstart');
      rootStyle.setProperty('--leftbarstart', MinimalUI.cssLeftBarStartVisible);
      rootStyle.setProperty('--leftbarpad', MinimalUI.cssLeftBarPaddingDefault);
      if (game.settings.get('minimal-ui', 'sidePanelSize') == 'small') {
        rootStyle.setProperty('--leftbarstartsub', MinimalUI.cssLeftBarSubMenuSmall);
      } else {
        rootStyle.setProperty('--leftbarstartsub', MinimalUI.cssLeftBarSubMenuStandard);
      }
      $("#sidebar-lock > i").removeClass("fa-lock-open");
      $("#sidebar-lock > i").addClass("fa-lock");
    } else if (unlock) {
      MinimalUI.controlsLocked = false;
      $("#sidebar-lock > i").removeClass("fa-lock");
      $("#sidebar-lock > i").addClass("fa-lock-open");
      rootStyle.setProperty('--leftbarstart', MinimalUI.cssControlsLastPos);
      rootStyle.setProperty('--leftbarstartsub', MinimalUI.cssLeftBarHiddenPosition);
      if (game.settings.get('minimal-ui', 'sidePanelSize') == 'small') {
        rootStyle.setProperty('--leftbarpad', MinimalUI.cssLeftBarPaddingSmall);
      } else {
        rootStyle.setProperty('--leftbarpad', MinimalUI.cssLeftBarPaddingSmall);
      }
    }
  }

  static lockHotbar(unlock) {
    let rootStyle = document.querySelector(':root').style;
    if (MinimalUI.hotbarLocked && unlock) {
      rootStyle.setProperty('--hotbaranim', MinimalUI.cssHotbarHidden);
      $("#bar-lock > i").removeClass("fa-lock");
      $("#bar-lock > i").addClass("fa-lock-open");
      MinimalUI.hotbarLocked = false;
    } else {
      rootStyle.setProperty('--hotbaranim', MinimalUI.cssHotbarReveal);
      $("#bar-lock > i").removeClass("fa-lock-open");
      $("#bar-lock > i").addClass("fa-lock");
      MinimalUI.hotbarLocked = true;
    }
  }

  static addLockButton() {
    let locked = MinimalUI.controlsLocked ? 'fa-lock' : 'fa-lock-open';
    let htmlSidebarLockButton =
      `
      <li id="sidebar-lock" class="scene-control" title="Pin Sidebar" onclick="MinimalUI.lockControls(true)">
      <i class="fas ${locked}" style="color: red"></i>
      </li>
      `
    if (game.settings.get('minimal-ui', 'sidePanel') == 'autohide') {
      $("#controls").append(htmlSidebarLockButton);
    }
  }
  
}

Hooks.on('init', () => {
  game.settings.register('minimal-ui', 'sceneNavigation', {
    name: "Scene Navigation",
    hint: "Customize scene navigation UI. Consider 'DF Scene Enhancement' module when this option is set to hidden",
    scope: 'world',
    config: true,
    type: String,
    choices: {
      "shown": "Show Normally",
      "collapsed": "Start Collapsed by Default",
      "hidden": "Hide Completely"
    },
    default: "collapsed",
    onChange: value => {
      window.location.reload()
    }
  });

  game.settings.register('minimal-ui', 'macroBar', {
    name: "Macro Bar",
    hint: "Customize Macro Bar UI. Auto-Hide Ignored when using Custom Hotbar module.",
    scope: 'world',
    config: true,
    type: String,
    choices: {
      "shown": "Show Normally",
      "autohide": "Auto-Hide",
      "collapsed": "Start Collapsed by Default",
      "hidden": "Hide Completely"
    },
    default: "autohide",
    onChange: value => {
      window.location.reload()
    }
  });

  game.settings.register('minimal-ui', 'macroBarPosition', {
    name: "Macro Bar Position",
    hint: `Reference at 400. Minimum is ${MinimalUI.cssMinimumMacroBarX}. Increase value to move it to right. Reduce to the left.`,
    scope: 'world',
    config: true,
    type: Number,
    default: 400,
    onChange: value => {
      window.location.reload()
    }
  });

  game.settings.register('minimal-ui', 'playerList', {
    name: "Player List",
    hint: "Customize Player List UI",
    scope: 'world',
    config: true,
    type: String,
    choices: {
      "default": "Always Visible",
      "autohide": "Auto-Hide",
      "hidden": "Hide Completely"
    },
    default: "autohide",
    onChange: value => {
      window.location.reload()
    }
  });

  game.settings.register('minimal-ui', 'sidePanel', {
    name: "Left panel behavior",
    hint: "Choose whether left panel is always visible or auto hides",
    scope: 'world',
    config: true,
    type: String,
    choices: {
      "always": "Always Visible",
      "autohide": "Auto-Hide"
    },
    default: "autohide",
    onChange: value => {
      window.location.reload()
    }
  });

  game.settings.register('minimal-ui', 'sidePanelSize', {
    name: "Left panel size",
    hint: "Choose favorite side panel size.",
    scope: 'world',
    config: true,
    type: String,
    choices: {
      "small": "Small",
      "standard": "Standard"
    },
    default: "small",
    onChange: value => {
      window.location.reload()
    }
  });

  game.settings.register('minimal-ui', 'sidePanelPosition', {
    name: "Left panel position",
    hint: "Choose favorite side panel position. Will be ignored if using 'Keep a single column' style.",
    scope: 'world',
    config: true,
    type: String,
    choices: {
      "top": "Top Left",
      "center": "Center Upper Left",
      "lower": "Center Lower Left",
      "bottom": "Bottom Left"
    },
    default: "center",
    onChange: value => {
      window.location.reload()
    }
  });

  game.settings.register('minimal-ui', 'sidePanelMenuStyle', {
    name: "Left panel menu style",
    hint: "Choose whether to expand to the right or keep a single column of buttons",
    scope: 'world',
    config: true,
    type: String,
    choices: {
      "default": "Controls to the right",
      "column": "Keep a single column"
    },
    default: "default",
    onChange: value => {
      window.location.reload()
    }
  });
  
  game.settings.register("minimal-ui", "borderColor", {
    name: "Border Colors",
    hint: "Default: #ff4900bd | Disable with: #ffffff00 | Get codes: w3schools.com/colors/colors_picker.asp",
    scope: "world",
    config: true,
    default: "#ff4900bd",
    type: String,
    onChange: lang => {
      window.location.reload()
    }
  });
  
  game.settings.register("minimal-ui", "shadowColor", {
    name: "Shadow Colors",
    hint: "Default: #ff4900bd | Disable with: #ffffff00 | Get codes: w3schools.com/colors/colors_picker.asp",
    scope: "world",
    config: true,
    default: "#ff4900bd",
    type: String,
    onChange: lang => {
      window.location.reload()
    }
  });
  
  game.settings.register("minimal-ui", "shadowStrength", {
    name: "Shadow Strength",
    hint: "How gloomy and shadow are the borders? Default: 10",
    scope: "world",
    config: true,
    default: "10",
    type: String,
    onChange: lang => {
      window.location.reload()
    }
  });

});

Hooks.once('ready', async function() {

  let rootStyle = document.querySelector(':root').style;
  
  // Compatibility Workaround for bullseye module
  if (game.modules.has('bullseye') && game.modules.get('bullseye').active) {
    rootStyle.setProperty('--navistart', MinimalUI.cssSceneNavBullseyeStart);
    rootStyle.setProperty('--logovisibility', 'visible');
  }

  switch(game.settings.get('minimal-ui', 'sceneNavigation')) {
    case 'collapsed': {
      rootStyle.setProperty('--visinav', 'visible');
      MinimalUI.collapse("nav-toggle");
      break;
    }
    case 'shown': {
      rootStyle.setProperty('--visinav', 'visible');
      break;
    }
  }

  switch(game.settings.get('minimal-ui', 'playerList')) {
    case 'default': {
      rootStyle.setProperty('--playerfsize', MinimalUI.cssPlayersDefaultFontSize);
      rootStyle.setProperty('--playerwidth', MinimalUI.cssPlayersDefaultWidth);
      rootStyle.setProperty('--visiplay', 'visible');
      break;
    }
    case 'autohide': {
      rootStyle.setProperty('--visiplay', 'visible');
      break;
    }
  }

  $("#players")[0].val = "";

});

Hooks.once('renderSceneControls', async function() {
  
  let rootStyle = document.querySelector(':root').style;
  
  rootStyle.setProperty('--bordercolor', game.settings.get('minimal-ui', 'borderColor'));
  rootStyle.setProperty('--shadowcolor', game.settings.get('minimal-ui', 'shadowColor'));
  rootStyle.setProperty('--shadowstrength', game.settings.get('minimal-ui', 'shadowStrength') + 'px');

  if (game.settings.get('minimal-ui', 'sidePanelSize') == 'small') {
    rootStyle.setProperty('--leftbarstartsub', MinimalUI.cssLeftBarSubMenuSmall);
    rootStyle.setProperty('--submenuhover', MinimalUI.cssLeftBarSubMenuSmall);
    rootStyle.setProperty('--leftbarw', MinimalUI.cssLeftBarSmallWidth);
    rootStyle.setProperty('--leftbarh', MinimalUI.cssLeftBarSmallHeight);
    rootStyle.setProperty('--leftbarlh', MinimalUI.cssLeftBarSmallLineHeight);
    rootStyle.setProperty('--leftbarfs', MinimalUI.cssLeftBarSmallFontSize);
  } else {
    rootStyle.setProperty('--leftbarstartsub', MinimalUI.cssLeftBarSubMenuStandard);
    rootStyle.setProperty('--submenuhover', MinimalUI.cssLeftBarSubMenuStandard);
  }

  switch(game.settings.get('minimal-ui', 'sidePanel')) {
    case 'autohide': {
      if (!MinimalUI.controlsLocked) {
        rootStyle.setProperty('--leftbarstart', MinimalUI.cssLeftBarHiddenPosition);
        rootStyle.setProperty('--leftbarstartsub', MinimalUI.cssLeftBarHiddenPosition);
      }
      break;
    }
  }

  switch(true) {
    case (game.settings.get('minimal-ui', 'sidePanelPosition') == 'top' || game.settings.get('minimal-ui', 'sidePanelMenuStyle') == 'column'): {
      rootStyle.setProperty('--leftbarpos', MinimalUI.cssLeftBarVerticalPositionTop);
      break;
    }
    case (game.settings.get('minimal-ui', 'sidePanelPosition') == 'center'): {
      rootStyle.setProperty('--leftbarpos', MinimalUI.cssLeftBarVerticalPositionCenter);
      break;
    }
    case (game.settings.get('minimal-ui', 'sidePanelPosition') ==  'lower'): {
      rootStyle.setProperty('--leftbarpos', MinimalUI.cssLeftBarVerticalPositionLower);
      break;
    }
    case (game.settings.get('minimal-ui', 'sidePanelPosition') ==  'bottom'): {
      rootStyle.setProperty('--leftbarpos', MinimalUI.cssLeftBarVerticalPositionBottom);
      break;
    }
  }

  switch(game.settings.get('minimal-ui', 'sidePanelMenuStyle')) {
    case 'default': {
      rootStyle.setProperty('--submenustyle', 'block');
      break;
    }
    case 'column': {
      rootStyle.setProperty('--submenustyle', 'contents');
      break;
    }
  }
})

Hooks.on('renderHotbar', async function() {
  
  let rootStyle = document.querySelector(':root').style;
  
  let mbPos = game.settings.get('minimal-ui', 'macroBarPosition');
  if (mbPos < MinimalUI.cssMinimumMacroBarX) {
    rootStyle.setProperty('--macrobarpos', String(MinimalUI.cssMinimumMacroBarX)+'px');
  } else {
    rootStyle.setProperty('--macrobarpos', String(mbPos)+'px');
  }
  
  switch(game.settings.get('minimal-ui', 'macroBar')) {
    case 'collapsed': {
      rootStyle.setProperty('--visihotbar', 'visible');
      MinimalUI.collapse("bar-toggle");
      if (game.modules.has("custom-hotbar") && game.modules.get('custom-hotbar').active) {
        MinimalUI.collapse("custom-bar-toggle");
      };
      break;
    }
    case 'autohide': {
      if (!(game.modules.has("custom-hotbar") && game.modules.get('custom-hotbar').active)) {
        rootStyle.setProperty('--hotbaranim', MinimalUI.cssHotbarHidden);
        rootStyle.setProperty('--macrobarlh1', MinimalUI.cssHotbarLeftControlsLineHeight);
        rootStyle.setProperty('--macrobarlh2', MinimalUI.cssHotbarRightControlsLineHeight);
        rootStyle.setProperty('--macrobarmg', MinimalUI.cssHotbarControlsMargin);
        rootStyle.setProperty('--macrobarhh', MinimalUI.cssHotbarControlsAutoHideHeight);
        rootStyle.setProperty('--macrobarhv', MinimalUI.cssHotbarAutoHideHeight);
        $("#hotbar-directory-controls").append(MinimalUI.htmlHotbarLockButton);
        $("#macro-directory").click(function() {MinimalUI.lockHotbar(false)});
        $("#bar-lock").click(function() {MinimalUI.lockHotbar(true)});
        if (MinimalUI.hotbarLocked) {
          MinimalUI.lockHotbar(false);
        }
      }
      rootStyle.setProperty('--visihotbar', 'visible');
      break;
    }
    case 'shown': {
      rootStyle.setProperty('--visihotbar', 'visible');
      break;
    }
  }
  
})

Hooks.on('renderSceneControls', async function() {
  
  let rootStyle = document.querySelector(':root').style;
  
  if (game.settings.get('minimal-ui', 'sidePanel') == 'autohide' && !MinimalUI.controlsLocked) {
    if (game.settings.get('minimal-ui', 'sidePanelSize') == 'small') {
      rootStyle.setProperty('--leftbarpad', MinimalUI.cssLeftBarPaddingSmall);
    } else {
      rootStyle.setProperty('--leftbarpad', MinimalUI.cssLeftBarPaddingSmall);
    }
  } else {
    rootStyle.setProperty('--leftbarpad', MinimalUI.cssLeftBarPaddingDefault);
  }
  
  MinimalUI.addLockButton();
  
  // --------------- COMPATIBILITY SECTION ------------------
  // Here we add workarounds for minimal UI to work well with modules that affect UI components
  
  // Give a little time for other modules to add their controls first, and reapply changes
  await new Promise(waitABit => setTimeout(waitABit, 1));
  
  $("#controls > li.scene-control").on('click', function() {
    MinimalUI.lockControls(false);
    $("#controls > li.scene-control.active > ol > li").on('click', function() {MinimalUI.lockControls(false)});
  });
  $("#controls > li.scene-control.active > ol > li").on('click', function() {
    MinimalUI.lockControls(false);
  });
  
  // Delete and add lock button if needed, so the lock is always at the bottom
  if ($("#controls > li").index($("#sidebar-lock")) != $("#controls > li").length) {
    $("#sidebar-lock").remove();
    MinimalUI.addLockButton();
  }
  
  // Support for Simple Dice Roller
  if (game.modules.has('simple-dice-roller') && game.modules.get('simple-dice-roller').active) {
    $("#controls > li.scene-control.sdr-scene-control").click(function() {
      let olControl = $("#controls > li.scene-control.sdr-scene-control.active > ol")[0];
      if (olControl) {
        olControl.style.setProperty('display', 'inherit');
      }
    });
  }
  
  // ----------------------------------------------------------------------

})