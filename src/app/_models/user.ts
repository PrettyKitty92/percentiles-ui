import {Baby} from './baby';
export class User {
  id: number;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  babies: Baby[];
  authorities: string[];
}
