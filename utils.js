function simulateClick(el, n) {
  for (let i = 0; i < n; i++) {
    ["mousedown", "mouseup", "click"].forEach(type => {
      el.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true }));
    });
  }
}

function waitForElement(selector, callback) {
    const existing = document.querySelector(selector);
    if (existing) {
        callback(existing);
        return;
    }
    const observer = new MutationObserver(() => {
        const el = document.querySelector(selector);
        if (el) {
            observer.disconnect();
            callback(el);
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
}

// Start the game for a given gameName
function startGame(gameName) {
    console.log(`Starting game: ${gameName}`);

    let selector;
    switch (gameName) {
        case "zip":
            selector = "section.trail-board";
            break;
        case "tango":
            selector = "div.lotka-grid";
            break;
        case "queens":
            selector = "div#queens-grid"; // replace with the actual selector for Queens
            break;
        default:
            console.log("Unknown game");
            return;
    }

    // Wait for the game board to appear
    waitForElement(selector, (boardSection) => {
        console.log("Game board found:", boardSection);

        // Run the appropriate bot immediately
        if (gameName === "zip") {
            runZipGame();
        } else if (gameName === "tango") {
            runTangoGame();
        } else if (gameName === "queens") {
            runQueensGame();
        }
    });
}