function random() {
  return Math.floor(Math.random() * 100)
}

function generateLayout(width, height) {
  let mines = [];
  for(let h = 0;h < height;h++) {
    mines[h] = [];
    for(let w = 0;w < width;w++) {
      mines[h].push(Mine())
    }
  }
  return mines
}

function layMines(mines, options) {
  const {
    col,
    row,
    width,
    height,
    minesCount,
  } = options;
  for(let index = 0;;) {
    let x = random() % width;
    let y = random() % height;
    if(x === row && y === col) {
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
  for(let i = -1;i < 2;i++) {
    for(let j = -1;j < 2;j++) {
      const _y = y + i;
      const _x = x + j;
      if(_y === y && _x === x) {
        continue
      }
      const referenceMine = (mines[_y] || [])[_x] || {isMine: false};
      referenceMine.isMine && (mine.minesCount += 1);
    }
  }
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
    minesCount: 0
  }
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