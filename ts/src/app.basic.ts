/**
 * Class only effect construct
 * @param logString
 * @constructor
 */
function Logger(logString: string) {
  console.log(logString);
  return function (construct: any) {
    console.log('Logging...');
    console.log(construct);
  };
}

function withTemplate(template: string, hookId: string) {
  console.log('TEMPLATE FACTORY');

  return function <
    T extends { new (...args: any[]): { name?: string; age?: number } },
  >(originalConstructor: T) {
    return class extends originalConstructor {
      constructor(..._: any[]) {
        super();
        const hookEl = document.getElementById(hookId);

        if (hookEl) {
          hookEl.innerHTML = template;
          hookEl.querySelector('h1')!.textContent = _[0];
        }
      }
    };
  };
}

const template = '<h1>Template</h1>';

@withTemplate(template, 'app')
@Logger('Logging now')
class Person {
  constructor(
    public name?: string,
    public age?: number,
  ) {}
}

const pers = new Person('Tao', 2);
console.log(pers);

/*---------------- Product -----------------*/
function propertyLog(target: any, propertyName: string | symbol) {
  console.log('Property decorator!');
  console.log(target, propertyName);
}

function accessorLog(
  target: any,
  name: string,
  descriptor: PropertyDescriptor,
) {
  console.log('Accessor decorator!');
  console.log(target, name, descriptor);
  // return
}

function methodLog(
  target: any,
  name: string | symbol,
  descriptor: PropertyDescriptor,
) {
  console.log('Method decorator!');
  console.log(target, name, descriptor);
}

function parameterLog(target: any, name: string | symbol, position: number) {
  console.log('parameter decorator');
  console.log(target, name, position);
}

class Product {
  @propertyLog
  title: string;
  private _price: number;

  @accessorLog
  set price(val: number) {
    if (val <= 0) {
      throw new Error('Invalid price - should be positive!');
    }
    this._price = val;
  }

  constructor(t: string, p: number) {
    this.title = t;
    this._price = p;
  }

  @methodLog
  get_PriceWithTax(@parameterLog tax: number) {
    return this._price * (1 + tax);
  }
}

new Product('Clothes', 100);

function autoBind(
  _: any,
  __: string,
  description: PropertyDescriptor,
): PropertyDescriptor {
  return {
    configurable: true,
    enumerable: false,
    get() {
      return description.value.bind(this);
    },
  };
}

class Printer {
  message = 'This works!';

  @autoBind
  showMessage() {
    console.log(this.message);
  }
}

const p = new Printer();
p.showMessage();

const button = document.querySelector('button');
button!.addEventListener('click', p.showMessage);

interface ValidatorConfig {
  [property: string]: {
    [validatableProp: string]: string[];
  };
}

const registeredValidators: ValidatorConfig = {};

function Required(target: any, propertyName: string) {
  registeredValidators[target.constructor.name] = {
    ...registeredValidators[target.constructor.name],
    [propertyName]: [
      ...(registeredValidators[target.constructor.name]?.[propertyName] ?? []),
      'required',
    ],
  };
}
function PositiveNumber(target: any, propertyName: string) {
  registeredValidators[target.constructor.name] = {
    ...registeredValidators[target.constructor.name],
    [propertyName]: [
      ...(registeredValidators[target.constructor.name]?.[propertyName] ?? []),
      'positive',
    ],
  };
}
function validate(obj: any) {
  const objValidatorConfig = registeredValidators[obj.constructor.name];
  if (!objValidatorConfig) {
    return true;
  }

  let isValid = true;
  for (const prop in objValidatorConfig) {
    for (const validator of objValidatorConfig[prop]) {
      switch (validator) {
        case 'required':
          isValid = isValid && !!obj[prop];
          break;
        case 'positive':
          isValid = isValid && obj[prop] > 0;
          break;
      }
    }
  }

  return isValid;
}

class Course {
  @Required
  title: string;
  @PositiveNumber
  price: number;

  constructor(t: string, p: number) {
    this.title = t;
    this.price = p;
  }
}

const courseForm = document.querySelector('form');
courseForm!.addEventListener('submit', (event) => {
  event.preventDefault();
  const titleEl = document.getElementById('title') as HTMLInputElement;
  const priceEl = document.getElementById('price') as HTMLInputElement;
  const title = titleEl.value;
  const price = +priceEl.value;
  const createdCourse = new Course(title, price);
  if (!validate(createdCourse)) {
    alert('Invalid input, pls try again!');
  }
  console.log(createdCourse);
});
