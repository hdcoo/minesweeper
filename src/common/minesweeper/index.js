import validator from "./validators";
import {TypeError} from "./error";
import layout from "./layout";
import {getExecutor} from "buttercam/utils";
import EventEmitter from "butter-event-emitter";
import {exploreAroundGrids} from "./utils";

export default class Minesweeper extends EventEmitter {
  constructor(options) {
    super();
    
    const invalid = validator.forConstructor(options);
    
    if(invalid) {
      throw TypeError(invalid)
    }
    
    this.width = options.width;
    
    this.height = options.height;
    
    this.minesCount = options.minesCount;
    
    this.safeGridCount = options.width * options.height - options.minesCount;
    
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
      this.exposeAllMines();
      this.emit('defeat')
    } else {
      Minesweeper.expose(grid);
      if(grid.minesCount === 0) {
        this.spread(x, y)
      }
    }
    this.winning() && this.emit('winning')
  }
  
  exposeAllMines() {
    Minesweeper.mapGrids(this.grids, grid => {
      grid.isMine && Minesweeper.expose(grid)
    })
  }
  
  exposeAllNotMines() {
    Minesweeper.mapGrids(this.grids, grid => {
      !grid.isMine && Minesweeper.expose(grid)
    })
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
    this.winning() && this.emit('winning');
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
  
  clearAllExploring() {
    Minesweeper.mapGrids(this.grids, grid => {
      grid.exploring = false
    })
  }
  
  winning() {
    let exposedCount = 0;
    Minesweeper.mapGrids(this.grids, grid => {
      if(grid.exposed && !grid.isMine) {
        exposedCount += 1
      }
    });
    return exposedCount === this.safeGridCount
  }
  
  static expose(grid) {
    grid.exposed = true
  }
  
  static exploreAroundGrids(...args) {
    return exploreAroundGrids(...args)
  };
  
  static mapGrids(grids, callback) {
    grids.forEach(row => {
      row.forEach(grid => {
        getExecutor(callback)(grid)
      })
    })
  }
}