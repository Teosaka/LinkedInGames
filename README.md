# LinkedInGames

Solve LinkedIn’s mini-games **Zip**, **Tango**, and **Queens** automatically with a Chrome Extension built on **Manifest V3**.

> **Important:** For the extension to work, open games **directly** via their game URLs:
>
> - `https://www.linkedin.com/games/zip`
> - `https://www.linkedin.com/games/tango`
> - `https://www.linkedin.com/games/queens`
>
> Do **not** navigate through `linkedin.com/games` and click into a game. The chrome extension does not recognize the page redirection.

---

## ✨ Features

- Auto-detects the active game (Zip, Tango, or Queens) by URL.
- Runs a solver tailored to each game:
  - **Zip**: path/number logic solver.
  - **Tango**: binary grid with equality/opposite constraints and “no three in a row” + balanced rows/cols.
  - **Queens**: constraint solver placing non-adjacent queens with per-color uniqueness.
- Non-intrusive: shows moves by simulating clicks on the board.
- Modular code: one file per game + shared utilities.
