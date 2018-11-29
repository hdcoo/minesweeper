import validate from "validate.js";

export default {
  forConstructor(data) {
    return validate(data, {
      width: {
        numericality: {
          strict: true,
          greaterThan: 0,
          notGreaterThan: 'width must greater than 0',
        },
        presence: {
          allowEmpty: false,
          message: 'width is required'
        }
      },
      height: {
        numericality: {
          strict: true,
          greaterThan: 0,
          notGreaterThan: 'height must greater than 0'
        },
        presence: {
          allowEmpty: false,
          message: 'height is required'
        }
      },
      minesCount: {
        numericality: {
          strict: true,
          greaterThan: -1,
          notGreaterThan: 'minesCount must greater than 0'
        },
        presence: {
          allowEmpty: false,
          message: 'minesCount is required'
        }
      }
    })
  }
}