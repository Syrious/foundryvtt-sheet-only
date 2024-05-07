![](https://img.shields.io/badge/Foundry-v11-informational) ![GitHub All Releases](https://img.shields.io/github/downloads/Syrious/foundryvtt-sheet-only/total?label=Downloads+latest+release) [![Support me on Patreon](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Fshieldsio-patreon.vercel.app%2Fapi%3Fusername%3DSyriousWorkshop%26type%3Dpatrons&style=flat)](https://patreon.com/SyriousWorkshop)

[Discord](https://discord.gg/VMqndcyUGS)

# FoundryVTT Sheet-Only
Designed for in-person sessions. Players can connect with their tablets to foundry and will see their character sheet and only their character sheet. 
They can interact with the sheet, see all the relevant information and the sheet gets updated if the GM makes any changes such as inventory, HP and so on.

I built this simple module for my own in-person sessions, where I have a large display to show foundry (using [Monk's Common Display](https://github.com/ironmonk88/monks-common-display))

### Installation and setup
* Go to Settings -> Sheet-Only and select the players which should only see their character sheets
* There you can also set a screen-width so that this module only activates if the screen width it below a certain value
  * Let's say you want to use it only if you are logging in with your mobile. Set it to 800 (or whatever you mobile screen maximum width is) and you will see your sheet only if you are logged in with your mobile device
* There are also settings to change the default behaviour regarding notifications and the canvas

<img alt="setup.png" height="500" src="setup.png"/>

### Usage
* If sheet-only users log in they will only see their sheets
* If they have multiple characters, a sidebar is shown and the users are able to switch between characters
  * Works for companions and wild shapes (as long as the user has owner permission)
* You can drag the button bar if it is in your way. It starts always in the top left corner after login

#### Zooming
* In the bottom right corner there are buttons to resize the UI. Depending on the browser you are using it works differently
  * Firefox: If you are using firefox, only the font size gets adjusted (like you would in the core setting) and therefore does only work with sheets that uses relative font-size units (rem instead of px). A working example is the default sheet of [Level Up: Advanced 5th Edition (Official)](https://foundryvtt.com/packages/a5e)
  * Non-Firefox: Taking advantage of the 'zoom'-property, this should zoom in and out quite nicely regardless of the font size units

<img alt="example1.png" height="500" src="example2.png"/>

#### Actor List
* If you own more than one actor a button at the bottom right can be used to toggle a list of all your actors
* If you don't have more than one actor, this button does nothing

<img alt="example2.png" height="500" src="example1.png"/>

### Sheet-Only-Plus
These features are [Patreon-Only](https://www.patreon.com/SyriousWorkshop). For a very small fee, you gain access to the additional features. 
Your support helps immensely to keep developing foundry modules, but I understand if you don't like to continuously support the project. In this case, you can cancel your subscription anytime and continue to use the module. You only need to re-subscribe if you want newer features or upgrade to a compatible version. 

The current features in the Plus-Version are:
* Targeting
* Journal
* (Upcomming) Movement

### Compatibility
* [Real-Dice](https://foundryvtt.com/packages/real-dice) If installed, you can enable manual rolling in sheet-only settings.

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
If you like to support my work find me on [Patreon](https://www.patreon.com/SyriousWorkshop).
