# 1.8.2
- Sets the maximum foundry version to 12.343
- 
# 1.8.1

- [DND5e] fixes issue with the sheet not receiving updates and not be able to edit

# 1.8.0
- Removes 'black bar' behind ability scores (dnd5e)
- Adds setting to disable bottom button bar for small displays 

# 1.7.2
- Fixes missing button to roll for HP on short rest in dnd5e

# 1.7.1
- Fixes a bug where the chat was not well visible 
- Fixes a bug where the settings window was hidden behind the bottom button bar 
- On smaller screens the settings window now has two rows instead of two columns, making it more usable

# 1.7.0
- Fixes a bug where the journal could not be re-opened
- Improves dragging behaviour
- The time it takes before the drag functionality kicks in can now be set in the settings

# 1.6.3
- [DND5e] Fixes a bug where the control bar did not respond if the GM disabled the morph feature

# 1.6.2
- Fixes a bug where the new dnd5e-morph-button conflicts with non-dnd5e systems

# 1.6.1
- [DND5e] Only shows Morph-Button if all requirements are met (FoundryVTT is at least v12, socketlib and 
either Quick Insert or Spotlight Omnisearch is installed)

# 1.6.0 (The Fehr-Update)
Thanks to [TheFehr](https://github.com/TheFehr) for this awesome contribution. It contains the following changes:

- [DND5e] Adds a morph-button to the controls, which lets the player polymorph/wildshape their characters
- [DND5e] Adds some styling for Tidy5e-Sheet. Thanks to []() for that incredible contribituion

# 1.5.2
- [DND3.5] Fixes bug where character sheet closes automatically when changing values on the sheet. Thanks to [DavidAremaCarretero](https://github.com/DavidAremaCarretero)

# 1.5.1
- Fixes issue with the manual roll window hidden behind chat

# 1.5.0 (The Eddie-Update)

Thanks to [Eddie](https://github.com/eddiecooro) for this contribution containing the following changes:
- Improved handling for smaller displays
- Dnd5e: Opens the chat window when using item or spell 
- Renders dialogs on top of the chat window
- Disables drag & drop for the chat window if the chat is set to fullscreen
- Moves the main buttons to the bottom for smaller displays (width < 800px)
  - The sheet might still look squished on such a small resolution
  - For Dnd5e use the legacy sheet for best results 

# 1.4.4
- Adds a settings option to display chat window fullscreen
- Fixes minor incompatibilities with sheet-only-plus

# 1.4.3
- Fixes bug introduced with new dragging method

# 1.4.2 
- Changes drag and drop functionality
  - Now, you need to press and hold to activate the drag and drop
- Applies drag and drop to the chat window

# 1.4.1
- Adds token movement

# 1.3.1
- Changes Real-Dice option to a client setting
- Prompts users when they are not 'sheet-only' but have disabled canvas

# 1.3.0
- Adds volume settings

# 1.2.0
- v12 compatibility

# 1.1.15
- Fixes bug with fullscreen

# 1.1.14
- Fixes minor issues
- Rollout new build. The last might be corrupt

# 1.1.13
- Fixes bug with sheet popping up when any actor gets deleted

# 1.1.12
- Adds german translation. Thanks to [Niclasp1501](https://github.com/Niclasp1501)
 
# 1.1.11
- Fixed a bug where dialogs popped up twice
- Dnd5e: Using the new character sheet, clicking on a spell/item additionally opens the tooltip

# 1.1.10
- Fixes bug that closes virtual keyboard when trying to enter something
- Modifies the height of the sheet to fit better on screen 
- Changes styling of actor list. The last actor should now be fully visible
- Moves the edit slider for dnd5e's new character sheet from the header to the sheet itself so that the character sheet can now be edited

# 1.1.9
- Fixes bug that closes virtual keyboard when trying to enter something
- Adds compatibility with sheet-only-plus journals 

# 1.1.8
- Better responsiveness of the sheet when tilting the device

# 1.1.7
- Fixed a minor bug when checking for sheet-only-plus 

# 1.1.6
- Changes canvas behaviour. Canvas is disabled by default and needs to be manually enabled for targeting
- Adds button to enable fullscreen
- Buttons can now be re-positioned by dragging (it always starts at the top left corner)

# 1.1.5
- Disables playlist-, ambience- and interface sounds for Sheet-Only clients

# 1.1.4
- Pops up character sheet after initial choice of character
- Closes actor list when selecting new character
- Hides canvas instead of disabling it
- Adds settings button for player

# 1.1.3
- Internal code to improve targeting in sheet-only-plus

# 1.1.2
- Fixes bug where the backpack (dnd5e) was not usable

# 1.1.1
- Enables support for [Real-Dice](https://foundryvtt.com/packages/real-dice)

# 1.1.0
- Adds support for Sheet-Only-Plus

# 1.0.15
- Removes dice tray and chat controls

# 1.0.14
- Fixes bug where chat input was always disabled, not matter if sheet-only was enabled or not

# 1.0.13
- Hotfix: Fixes bug preventing interactions with the sheet
- 
# 1.0.12
- Adds a button to toggle chat

# 1.0.11
- Fixes bug with activation by screen size not working
- Adds a bit more styling to the nav bar at the top right of the sheet

# 1.0.10
- Fixes bug with auto-closing item entry on legacy sheet

# 1.0.9
- Adds D&D 5e v 3.0.0 support (Thanks to [ZeroXNoxus](https://github.com/ZeroXNoxus))
- Adds the option to set a screen width as a trigger. If the screen width is above the entered value, sheet-only gets not activated. This idea was brought to you by [ZeroXNoxus](https://github.com/ZeroXNoxus)

# 1.0.8
- Adds dynamic actor list (Thanks to [ZeroXNoxus](https://github.com/ZeroXNoxus))

# 1.0.7
- Improved zooming (does not work for Firefox)

# 1.0.6
- Adds buttons to resize UI. !!! This only works for sheets that uses relative font size values (rem) e.g. the default sheet of the 'Level Up: Advanced 5th Edition' system !!! 

# 1.0.5
- Compatibility with 'Level Up! Advanced 5th Edition'
- Added higher system compatibility in general

# 1.0.4
- Added a setting to enable/disable notifications for all clients. 
- Added a setting to enable/disable canvas rendering. In some systems the canvas is needed in combination with some modules (e.g. The Dark Eye 5e + Dice So Nice)

# 1.0.3
- Adds support for multiple characters (like familiars or wild shapes)

# 1.0.2
- Disabling Canvas instead of hiding it (Thanks to [jsavko](https://github.com/jsavko))
- Therefor sheetonly map is not needed anymore

# 1.0.1
- Refactorings

# 1.0.0
- Initial version
