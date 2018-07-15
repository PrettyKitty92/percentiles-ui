import {Injectable} from '@angular/core';
import {MEASUREMENT_TYPE} from './measurement-type';
import {UnitType} from './unit-type';
import {UnitTypeParameters} from './unit-type-parameters';
import {TSMap} from 'typescript-map';


@Injectable()
export class MeasurementOptionsService {

  static options = new TSMap([
    ['LENGTH_HEIGHT_FOR_AGE', new UnitTypeParameters(UnitType.AGE_BY_DAY, UnitType.LENGTH_HEIGHT)],
    ['WEIGHT_FOR_AGE', new UnitTypeParameters(UnitType.AGE_BY_DAY, UnitType.WEIGHT)],
    ['WEIGHT_FOR_LENGTH', new UnitTypeParameters(UnitType.LENGTH, UnitType.WEIGHT)],
    ['WEIGHT_FOR_HEIGHT', new UnitTypeParameters(UnitType.HEIGHT, UnitType.WEIGHT)],
    ['BMI_FOR_AGE', new UnitTypeParameters(UnitType.AGE_BY_DAY, UnitType.BMI)],
    ['HEAD_CIRCUMFERENCE_FOR_AGE', new UnitTypeParameters(UnitType.AGE_BY_DAY, UnitType.HEAD_CIRCUMFERENCE)],
    ['ARM_CIRCUMFERENCE_FOR_AGE', new UnitTypeParameters(UnitType.AGE_BY_DAY, UnitType.HEAD_CIRCUMFERENCE)],
    ['TRICEPS_SKINFOLD_FOR_AGE', new UnitTypeParameters(UnitType.AGE_BY_DAY, UnitType.TRICEPS_SKINFOLD)],
    ['SUBSCAPULAR_SKINFOLD_FOR_AGE', new UnitTypeParameters(UnitType.AGE_BY_DAY, UnitType.SUBSCAPULAR_SKINFOLD)]
  ]);

  constructor() {
  }


  static getOptions() {
    return MEASUREMENT_TYPE;
  }

  static getParameters(MEASUREMENT_TYPE): any {
    return this.options.get(MEASUREMENT_TYPE);
  }
}
