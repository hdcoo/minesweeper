import {getExecutor} from "buttercam/utils";

export function exploreAroundGrids(grids, x, y, callback) {
  for(let i = -1;i < 2;i++) {
    const row = grids[y + i];
    if(!row) continue;
    for(let j = -1;j < 2;j++) {
      const target = row[x + j];
      const targetX = x + j;
      const targetY = y + i;
      if(!target || (targetX === x && targetY === y)) continue;
      getExecutor(callback)(target, targetX, targetY)
    }
  }
}