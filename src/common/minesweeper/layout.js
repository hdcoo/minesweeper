import {exploreAroundGrids} from "./utils";

function random() {
  return Math.floor(Math.random() * 1000)
}

function layMines(mines, options) {
  const {
    col,
    row,
    width,
    height,
    minesCount,
  } = options;
  if(minesCount <= 0) {
    return
  }
  for(let index = 0;;) {
    let x = random() % width;
    let y = random() % height;
    if(
      (x === row || x === row - 1 || x === row + 1) &&
      (y === col || y === col - 1 || y === col + 1)
    ) {
      continue
    }
    if(!mines[y][x].isMine) {
      mines[y][x].isMine = true;
      index += 1;
    }
    if(index === minesCount) {
      break
    }
  }
}

function setMinesCount(mines, x, y) {
  const mine = mines[y][x];
  if(mine.isMine) {
    return
  }
  exploreAroundGrids(mines, x, y, (target, targetX, targetY) => {
    mines[targetY][targetX].isMine && (mine.minesCount += 1);
  })
}

function initMines(mines) {
  for(let y = 0;y < mines.length;y++) {
    for(let x = 0;x < mines[y].length;x++) {
      setMinesCount(mines, x, y)
    }
  }
}

export function Mine() {
  return {
    isMine: false,
    exposed: false,
    marked: false,
    exploring: false,
    minesCount: 0
  }
}

export function generateLayout(width, height) {
  let mines = [];
  for(let h = 0;h < height;h++) {
    mines[h] = [];
    for(let w = 0;w < width;w++) {
      mines[h].push(Mine())
    }
  }
  return mines
}

/**
 * 布局
 * @param {Object} options - 选项
 * @param {Number} options.width - 雷区宽
 * @param {Number} options.height - 雷区高
 * @param {Number} options.minesCount - 雷总数
 * @param {Number} [options.col] - 第一次点击的列号
 * @param {Number} [options.row] - 第一次点击的行号
 * @return {Object}
 * */
export default function(options) {
  const {width, height} = options;
  const mines = generateLayout(width, height);
  layMines(mines, options);
  initMines(mines);
  return mines
}