// ! CONSTANTS
const MIN_DISK = 1;
const MAX_DISK = 8;
const DEFAULT_DISK = 3;

$(function () {
  // ! GAME INITIALIZATION
  let selectedDisk = null;
  let diskAmount = DEFAULT_DISK;
  let moves = [];
  let tempMoves = [];
  const rodOffset = [];
  $(".rod").each(function (index) {
    rodOffset.push($(this).offset());
    rodOffset[index].right = rodOffset[index].left + $(this).width();
    rodOffset[index].bottom = rodOffset[index].top + $(this).height();
  });
  console.log(rodOffset);
  $("disk-input").val(DEFAULT_DISK);
  generateDisks(diskAmount);
  $(document)
    .on("mousemove", function (e) {
      if (selectedDisk) {
        getDisk(selectedDisk).offset({ top: e.clientY, left: e.clientX });
        // $(selectedDisk).offset({ top: e.clientY, left: e.clientX });
      }
    })
    .on("mouseup", function () {
      if (selectedDisk) {
        let moved = false;
        const { top, left } = getDisk(selectedDisk).offset();
        console.log(top, left);
        for (rod of Object.entries(rodOffset)) {
          if (
            top >= rod[1].top &&
            top <= rod[1].bottom &&
            left >= rod[1].left &&
            left <= rod[1].right
          ) {
            moved = true;
            getDisk(selectedDisk).remove();
            const disk = $("<div></div>")
              .addClass(`disk bg-red-${selectedDisk * 100}`)
              .data("i", selectedDisk)
              .attr("draggable", true)
              .css("--i", selectedDisk)
              .on("mousedown", selectDisk);
            $(".rod").eq(rod[0]).prepend(disk);
            updateMoveLogs();
            break;
          }
        }
        if (moved == false)
          getDisk(selectedDisk).css({ position: "", left: "", top: "" });
        selectedDisk = null;
      }
    });

  // ! MOVEMENT CONFIGURATION
  function selectDisk() {
    selectedDisk = $(this).data("i");
  }
  $(".disk").on("mousedown", selectDisk);

  // ! DISK INPUT BUTTON
  $("button#disk-plus").on("click", () => {
    if (diskAmount == MAX_DISK) return;
    diskAmount++;
    $("#disk-input").val(diskAmount);
    resetGame();
  });
  $("button#disk-minus").on("click", () => {
    if (diskAmount == MIN_DISK) return;
    diskAmount--;
    $("#disk-input").val(diskAmount);
    resetGame();
  });

  // ! UNDO BUTTON
  $("button#undo-btn").on("click", function () {
    if (moves.length - tempMoves.length < -5) tempMoves = moves;
    if (moves.length == 0) return;
    if (moves.length == 1) return resetGame();
    moves.pop();
    console.log(moves.at(-1));
    $(".rod").each(function (index) {
      $(this).empty();
      moves.at(-1)[index].forEach((e, i) => {
        const disk = createDisk(e);
        $(this).append(disk);
      });
    });
  });

  // ! RESET BUTTON
  $("button#reset-btn").on("click", resetGame);

  // ! FUNCTIONS
  function getDisk(i) {
    return $(".disk").filter(function () {
      return $(this).data("i") == i;
    });
  }

  function updateMoveLogs() {
    const newMoves = [];
    $(".rod").each(function () {
      const rodDisk = [];
      $(this)
        .children()
        .each(function () {
          rodDisk.push($(this).data("i"));
        });
      newMoves.push(rodDisk);
    });
    console.log(newMoves);
    moves.push(newMoves);
    $("#move-count").text(moves.length);
  }

  function generateDisks(n) {
    const firstRod = $(".rod").first();
    for (let i = 1; i <= n; ++i) {
      const disk = $("<div></div>")
        .addClass(`disk bg-red-${i * 100}`)
        .data("i", i)
        .attr("draggable", true)
        .css("--i", i);
      firstRod.append(disk);
    }
  }

  function createDisk(i) {
    return $("<div></div>")
      .addClass(`disk bg-red-${i * 100}`)
      .data("i", i)
      .attr("draggable", true)
      .css("--i", i);
  }

  function resetGame() {
    moves = [];
    $("#move-count").text(0);
    $(".rod").each(function () {
      $(this).empty();
    });
    generateDisks(diskAmount);
    $(".disk").on("mousedown", selectDisk);
  }
});
