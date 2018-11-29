import validator from "./validators";
import {TypeError} from "./error";
import layout from "./layout";
import {getExecutor} from "buttercam/utils";

export default class Minesweeper {
  constructor(options) {
    const invalid = validator.forConstructor(options);
    
    if(invalid) {
      throw TypeError(invalid)
    }
    
    this.width = options.width;
    
    this.height = options.height;
    
    this.minesCount = options.minesCount;
    
    this.grids = layout(options);
    
    this.markedCount = 0;
  }
  
  getGrid(x, y) {
    return this.grids[y][x]
  }
  
  expose(x, y) {
    const grid = this.getGrid(x, y);
    if(grid.marked) {
      return
    }
    if(grid.isMine) {
      this.exposeAllMines()
    } else {
      Minesweeper.expose(grid);
      if(grid.minesCount === 0) {
        this.spread(x, y)
      }
    }
    return this
  }
  
  exposeAllMines() {
    this.grids.forEach(row => {
      row.forEach(grid => {
        grid.isMine && Minesweeper.expose(grid)
      })
    });
    return this
  }
  
  spread(x, y) {
    Minesweeper.exploreAroundGrids(this.grids, x, y, (target, x, y) => {
      if(!target.isMine && !target.exposed && !target.marked) {
        Minesweeper.expose(target);
        if(target.minesCount === 0) {
          this.spread(x, y)
        }
      }
    })
  }
  
  mark(x, y) {
    const grid = this.getGrid(x, y);
    grid.marked = !grid.marked;
    this.markedCount += grid.marked ? 1 : -1;
    return grid.marked
  }
  
  explore(x, y) {
    Minesweeper.exploreAroundGrids(this.grids, x, y, (target) => {
      if(!target.exposed) {
        target.exploring = true;
      }
    });
  }
  
  finishExplore(x, y) {
    const targets = [];
    const grid = this.getGrid(x, y);
    let minesCount = 0;
    Minesweeper.exploreAroundGrids(this.grids, x, y, (target, x, y) => {
      if(!target.exposed) {
        target.marked && (minesCount += 1);
        !target.marked && targets.push({x, y});
        target.exploring = false;
      }
    });
    if(minesCount === grid.minesCount) {
      targets.forEach(({x, y}) => {
        this.expose(x, y)
      })
    }
  }
  
  static expose(grid) {
    grid.exposed = true
  }
  
  static exploreAroundGrids(grids, x, y, callback) {
    for(let i = -1;i < 2;i++) {
      const row = grids[y + i];
      if(!row) continue;
      for(let j = -1;j < 2;j++) {
        const target = row[x + j];
        if(!target) continue;
        getExecutor(callback, this)(target, x + j, y + i)
      }
    }
  }
}