export function alphaC(rgbColor, opacity = 1) {
  const values = rgbColor.match(/\d+/g);
  if (!values) return rgbColor;
  return `rgba(${values[0]}, ${values[1]}, ${values[2]}, ${opacity})`;
}

export function mainColor(theme) {
    if (theme === 'LIGHT') return "#FFFFFF";
    if (theme === 'DARK') return "#1C1C1C";
}

export function secondColor(theme) {
    if (theme === 'LIGHT') return "rgb(219,234,254)";
    if (theme === 'DARK') return "#272725";
}

export function secondColorInverse(theme, opacity = 1) {
    if (theme === 'LIGHT') return `rgba(219,234,254, ${opacity})`;
    if (theme === 'DARK') return `rgba(255, 255, 247, ${opacity})`;
}

export function borderColorOne(theme) {
    if (theme === 'LIGHT') return "rgba(0, 0, 0, 0.1)";
    if (theme === 'DARK') return "rgba(255, 255, 255, 0.2)";
}

export function borderColorTwo(theme, opacity = 1) {
    if (theme === 'LIGHT') return `rgba(5, 156, 244, ${opacity})`;
    if (theme === 'DARK') return `rgba(244, 121, 24, ${opacity})`;
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

export function greenTwo(theme) {
    if (theme === 'LIGHT') return 'rgba(0, 255, 0, 0.7)';
    if (theme === 'DARK') return 'rgba(0, 255, 0, 0.7)';
}
export function redOne(theme) {
    if (theme === 'LIGHT') return "rgb(255, 0, 0)";
    if (theme === 'DARK') return "rgba(227, 0, 0, 1)";
}
export function orangeOne(theme) {
    if (theme === 'LIGHT') return "rgba(244, 121, 24, 1)";
    if (theme === 'DARK') return "rgba(244, 121, 24, 1)";
}
export function blueOne(theme) {
    // if (theme === 'LIGHT') return "rgb(0, 47, 104)";
    if (theme === 'LIGHT') return "rgba(5, 156, 244, 1)";
    if (theme === 'DARK') return "rgba(5, 156, 244, 1)";
}
export function purpleOne(theme) {
    if (theme === 'LIGHT') return "rgba(125, 6, 194, 1)";
    if (theme === 'DARK') return "rgba(125, 6, 194, 1)";
}

export function transparentCanvasBgOne(theme, opacity = 0.6) {
    if (theme === 'LIGHT') return `rgba(5, 156, 244, 1)`;
    if (theme === 'DARK') return `rgba(255, 255, 255, 1)`;
}
export function transparentCanvasBgTwo(theme) {
    if (theme === 'LIGHT') return "rgba(5, 156, 244, 1)";
    if (theme === 'DARK') return "rgba(255, 255, 255, 1)";
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
    if (theme === 'LIGHT') return "rgba(5, 156, 244, 1)";
    if (theme === 'DARK') return "#272725";
}