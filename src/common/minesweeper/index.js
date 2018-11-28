import validator from "./validators";
import {TypeError} from "./error";
import layout from "./layout";


export default class Minesweeper {
  constructor(options) {
    const invalid = validator.forConstructor(options);
    
    if(invalid) {
      throw TypeError(invalid)
    }
    
    this.width = options.width;
    
    this.height = options.height;
    
    this.minesCount = options.minesCount;
    
    this.grids = layout(options)
  }
  
  expose(x, y) {
  
  }
}