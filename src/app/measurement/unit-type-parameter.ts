import {UnitType} from './unit-type';
import {TSMap} from 'typescript-map';
export class UnitTypeParameter {
  unitType: UnitType;
  placeholder: string;
  parameters = new TSMap<UnitType, string>([
    [UnitType.AGE_BY_DAY, 'wiek w dniach'],
    [UnitType.AGE_BY_WEEK, 'wiek w tygodniach'],
    [UnitType.AGE_BY_MONTH, 'wiek w miesiącach'],
    [UnitType.LENGTH_HEIGHT, 'długość/wysokość w centymetrach'],
    [UnitType.LENGTH, 'długość w centymetrach'],
    [UnitType.HEIGHT, 'wysokość w centymetrach'],
    [UnitType.WEIGHT, 'waga w kilogramach'],
    [UnitType.ARM_CIRCUMFERENCE, 'obwód ramienia w centymetrach'],
    [UnitType.BMI, 'bmi'],
    [UnitType.HEAD_CIRCUMFERENCE, 'obwód głowy w centymetrach'],
    [UnitType.SUBSCAPULAR_SKINFOLD, 'zawartość procentowa tyłuszczu'],
    [UnitType.TRICEPS_SKINFOLD, 'zawartość procentowa tyłuszczu'],
    [UnitType.AGE_BY_BIRTHDAY, 'data urodzin'],
    [UnitType.AGE_BY_DATE, 'data pomiaru']
  ]);

  constructor(unitType: UnitType) {
    this.unitType = unitType;
    this.placeholder = this.parameters.get(unitType);
  }
}
