figma.showUI(__html__, { width: 240, height: 240 });

figma.ui.onmessage = msg => {
  if (msg.type === 'log-selection') {
    console.log(figma.currentPage.selection)
  }

  // figma.closePlugin();
};
