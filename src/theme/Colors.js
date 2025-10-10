export function mainColor(theme) {
    if (theme === 'LIGHT') return "#FFFFFF";
    if (theme === 'DARK') return "#1C1C1C";
}

export function secondColor(theme) {
    if (theme === 'LIGHT') return "#fffff7ff";
    if (theme === 'DARK') return "#272725";
}

export function secondColorInverse(theme) {
    if (theme === 'LIGHT') return "#272725";
    if (theme === 'DARK') return "#fffff7ff";
}

export function borderColor(theme) {
    if (theme === 'LIGHT') return "rgba(0, 0, 0, 0.1)";
    if (theme === 'DARK') return "rgba(255, 255, 255, 0.2)";
}

export function fontColorOne(theme) {
    if (theme === 'LIGHT') return "rgba(0, 0, 0, 1)";
    if (theme === 'DARK') return "rgba(255, 255, 255, 1)";
}



export function modalBackground(theme) {
    if (theme === 'LIGHT') return "rgba(0, 0, 0, 0.6)";
    if (theme === 'DARK') return "rgba(0, 0, 0, 0.7)";
}



export function greenOne(theme) {
    if (theme === 'LIGHT') return "#0A7D00";
    if (theme === 'DARK') return "#0A7D00";
}

export function redOne(theme) {
    if (theme === 'LIGHT') return "rgb(255, 0, 0)";
    if (theme === 'DARK') return "rgba(227, 0, 0, 1)";
}

export function blueOne(theme) {
    // if (theme === 'LIGHT') return "rgb(0, 47, 104)";
    if (theme === 'LIGHT') return "#059cf4ff";
    if (theme === 'DARK') return "#059cf4ff";
}

export function transparentCavasOne(theme) {
    if (theme === 'LIGHT') return "rgba(5, 156, 244, 0.6)";
    if (theme === 'DARK') return "rgba(255, 255, 255, 0.2)";
}

export function transparentCavasTwo(theme) {
    if (theme === 'LIGHT') return "rgba(5, 156, 244, 0.4)";
    if (theme === 'DARK') return "rgba(255, 255, 255, 0.1)";
}



export function floatingBlackButton(theme) {
    if (theme === 'LIGHT') return "#059cf4ff";
    if (theme === 'DARK') return "#272725";
}