 $(function() {
  $("[data-gracket]").gracket();
})

 $("[data-gracket]").gracket({
    gracketClass : "g_gracket",
    gameClass : "g_game",
    roundClass : "g_round",
    teamClass : "g_team",
    winnerClass : "g_winner",
    spacerClass : "g_spacer",
    currentClass : "g_current",
    canvasId : "g_canvas",
    canvasClass : "g_canvas"
});

$("[data-gracket]").gracket({
    canvasLineWidth : 1,      // adjusts the thickness of a line
    canvasLineGap : 2,        // adjusts the gap between element and line
    cornerRadius : 3,         // adjusts edges of line
    canvasLineCap : "round",  // or "square"
    canvasLineColor : "white" // or #HEX
});

$("[data-gracket]").gracket({
    roundLabels : [""]
});