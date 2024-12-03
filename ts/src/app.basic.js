"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
/**
 * Class only effect construct
 * @param logString
 * @constructor
 */
function Logger(logString) {
    console.log(logString);
    return function (construct) {
        console.log('Logging...');
        console.log(construct);
    };
}
function withTemplate(template, hookId) {
    console.log('TEMPLATE FACTORY');
    return function (originalConstructor) {
        return class extends originalConstructor {
            constructor(..._) {
                super();
                const hookEl = document.getElementById(hookId);
                if (hookEl) {
                    hookEl.innerHTML = template;
                    hookEl.querySelector('h1').textContent = _[0];
                }
            }
        };
    };
}
const template = '<h1>Template</h1>';
let Person = class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
};
Person = __decorate([
    withTemplate(template, 'app'),
    Logger('Logging now')
], Person);
const pers = new Person('Tao', 2);
console.log(pers);
/*---------------- Product -----------------*/
function propertyLog(target, propertyName) {
    console.log('Property decorator!');
    console.log(target, propertyName);
}
function accessorLog(target, name, descriptor) {
    console.log('Accessor decorator!');
    console.log(target, name, descriptor);
    // return
}
function methodLog(target, name, descriptor) {
    console.log('Method decorator!');
    console.log(target, name, descriptor);
}
function parameterLog(target, name, position) {
    console.log('parameter decorator');
    console.log(target, name, position);
}
class Product {
    set price(val) {
        if (val <= 0) {
            throw new Error('Invalid price - should be positive!');
        }
        this._price = val;
    }
    constructor(t, p) {
        this.title = t;
        this._price = p;
    }
    get_PriceWithTax(tax) {
        return this._price * (1 + tax);
    }
}
__decorate([
    propertyLog
], Product.prototype, "title", void 0);
__decorate([
    accessorLog
], Product.prototype, "price", null);
__decorate([
    methodLog,
    __param(0, parameterLog)
], Product.prototype, "get_PriceWithTax", null);
new Product('Clothes', 100);
function autoBind(_, __, description) {
    return {
        configurable: true,
        enumerable: false,
        get() {
            return description.value.bind(this);
        },
    };
}
class Printer {
    constructor() {
        this.message = 'This works!';
    }
    showMessage() {
        console.log(this.message);
    }
}
__decorate([
    autoBind
], Printer.prototype, "showMessage", null);
const p = new Printer();
p.showMessage();
const button = document.querySelector('button');
button.addEventListener('click', p.showMessage);
const registeredValidators = {};
function Required(target, propertyName) {
    var _a, _b;
    registeredValidators[target.constructor.name] = Object.assign(Object.assign({}, registeredValidators[target.constructor.name]), { [propertyName]: [
            ...((_b = (_a = registeredValidators[target.constructor.name]) === null || _a === void 0 ? void 0 : _a[propertyName]) !== null && _b !== void 0 ? _b : []),
            'required',
        ] });
}
function PositiveNumber(target, propertyName) {
    var _a, _b;
    registeredValidators[target.constructor.name] = Object.assign(Object.assign({}, registeredValidators[target.constructor.name]), { [propertyName]: [
            ...((_b = (_a = registeredValidators[target.constructor.name]) === null || _a === void 0 ? void 0 : _a[propertyName]) !== null && _b !== void 0 ? _b : []),
            'positive',
        ] });
}
function validate(obj) {
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
    constructor(t, p) {
        this.title = t;
        this.price = p;
    }
}
__decorate([
    Required
], Course.prototype, "title", void 0);
__decorate([
    PositiveNumber
], Course.prototype, "price", void 0);
const courseForm = document.querySelector('form');
courseForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const titleEl = document.getElementById('title');
    const priceEl = document.getElementById('price');
    const title = titleEl.value;
    const price = +priceEl.value;
    const createdCourse = new Course(title, price);
    if (!validate(createdCourse)) {
        alert('Invalid input, pls try again!');
    }
    console.log(createdCourse);
});
