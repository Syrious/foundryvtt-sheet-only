![](https://img.shields.io/badge/Foundry-v11-informational) ![GitHub All Releases](https://img.shields.io/github/downloads/Syrious/foundryvtt-sheet-only/total?label=Downloads+latest+release)  ![](https://img.shields.io/github/downloads-pre/Syrious/foundryvtt-sheet-only/latest/total)


# FoundryVTT Sheet-Only
Designed for in-person sessions. Players can connect with their tablets to foundry and will see their character sheet and only their character sheet. 
They can interact with the sheet, see all the relevant information and the sheet gets updated if the GM makes any changes such as inventory, HP and so on.

I built this simple module for my own in-person sessions, where I have a large display to show foundry (using [Monk's Common Display](https://github.com/ironmonk88/monks-common-display))

My players used digital character apps (e.g. D&D beyond). The problem I had with this was that their information about 
their character and my information were not in sync. If they lost HP both sheets (external and foundry sheet) had to be updated. Adding new items was also a nuisance. With this module
I fixed that problem. Both, GM and players are looking and updating the same sheet now.

### Installation and setup
* Go to Settings -> Sheet-Only and select the players which should only see their character sheets.
* There are also settings to change the default behaviour regarding notifications and the canvas

<img alt="setup.png" height="500" src="setup.png"/>

### Usage
* If sheet-only users log in they will only see their sheets
* If they have multiple characters, a sidebar is shown and the users are able to switch between characters
  * Works for companions and wild shapes (as long as the user has owner permission)

<img alt="example.png" height="500" src="example.png"/>

### Tested with
- [Cyberpunk RED](https://foundryvtt.com/packages/cyberpunk-red-core) (Little wonky though)
- [Das Schwarze Auge / The Dark Eye (5th Edition)](https://foundryvtt.com/packages/dsa5)
- [DnD5e](https://foundryvtt.com/packages/dnd5e)
- [Level Up: Advanced 5th Edition (Official)](https://foundryvtt.com/packages/a5e)

### Issues
* The UI is not very reactive. If you go from portrait to landscape or vice versa you probably need to reload
* Changing the permission on an actor does not get synced with connected users
* On some systems (e.g. TDE5e, Cyberpunk Red) Dice So Nice! doesn't show roll if the canvas is disabled. To make it work again, uncheck "Disable Canvas for users" in Sheet-Only settings  

### Support
If you like to support my work [![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/syrious). I really appreciate it!
