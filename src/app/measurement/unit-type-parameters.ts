import {UnitType} from './unit-type';
import {UnitTypeParameter} from './unit-type-parameter';
export class UnitTypeParameters {

  parameterX: UnitType;
  parameterY: UnitType;

  constructor(x: UnitType, y: UnitType) {
    this.parameterX = x;
    this.parameterY = y;
  }

  getParameterX(): UnitTypeParameter {
    return new UnitTypeParameter(this.parameterX);
  }

  getParameterY(): UnitTypeParameter {
    return new UnitTypeParameter(this.parameterY);
  }

}
