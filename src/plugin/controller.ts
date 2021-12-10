figma.showUI(__html__, { width: 240, height: 240 });

function getNodeColors(nodes, colorArray) {
  nodes.forEach(n => {
    n.fills?.filter(f => f.type === "SOLID" && f.visible ).forEach(f => colorArray.push({ name: n.name, color: f.color }))
    if (n.children) getNodeColors(n.children, colorArray)
  })
}

function getStyleColors(colorArray) {
  figma.getLocalPaintStyles().forEach(s => {
    s.paints?.filter(p => p.type === "SOLID" && p.visible ).forEach(f => colorArray.push({ name: s.name, color: f.color }))
  })
}

figma.ui.onmessage = msg => {
  if (msg.type === 'copy') {
    let colors = []

    switch(msg.source) {
      case "selection":
        getNodeColors(figma.currentPage.selection, colors);
        figma.ui.postMessage({ type: 'colors', colors: colors, format: msg.format })
        break;
      case "styles":
        getStyleColors(colors);
        figma.ui.postMessage({ type: 'colors', colors: colors, format: msg.format })
        break;
      default:
        return;
    }
  }

  if (msg.type === 'notify' && msg.message) {
    figma.notify(msg.message)
  }

  // figma.closePlugin();
};
