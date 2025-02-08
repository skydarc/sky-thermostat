
# sky-thermostat

![Overview](https://github.com/user-attachments/assets/5c450676-acba-4c8b-a558-dc36ff85c208)

<img src="https://github.com/user-attachments/assets/7148bde1-ef7e-4869-b67a-e442fc76ba14" width="300">
<img src="https://github.com/user-attachments/assets/16c48420-e28a-472e-b3df-fe50922d1e70" width="300">

## **sky-thermostat ?**

sky-thermostat is a card that replicates the look and feel of nest thermostat for [Home Assistant][home-assistant] and for oekofen boiler. 
It is advisable to use the okofen plugin for this card to work properly :

https://github.com/dominikamann/oekofen-pellematic-compact

---

### Features

-   🛠  Full editor for all options (no need to edit `yaml`)
-   ⚓ Entity picker
-   🚀 Zero dependencies : no need to install additional cards.
-   🌈 Based on Material UI
-   🌎 Internationalization

---

## **Installation**

### HACS

*Not available yet (coming soon).*

### Manual Installation

1. Place this package inside the www directory (or any subdirectory within www) in Home Assistant.

2. Add the resource in Settings → Dashboards → Three dots (top right) → Resources.

3. Click on "Add resource" and enter the following URL :
  - If you placed the venus directory directly in www, use :

```bash
/local/sky-thermostat/sky-thermostat.js
```

  - If you placed it in www/community, use:
```bash
/local/community/sky-thermostat/sky-thermostat.js
```

4. Select "JavaScript Module" and click "Create".

5. Restart Home Assistant.

And voilà! Venus OS Dashboard should now be available in the Lovelace card picker menu.

Enjoy! 🎉

---

## Usage

sky-thermostat can be configured using Dashboard UI editor.

1. In Dashboard UI, click 3 dots in top right corner.
2. Click _Edit Dashboard_.
3. Click Plus button to add a new card.
4. Find the _Custom: sky-thermostat card in the list.
