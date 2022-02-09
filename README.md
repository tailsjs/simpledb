# SimpleDB [ES6]
Simple JSON database.

## Example
```js
import DB from './index.js';
const db = new DB({
    filename: "db.json",
    name: "users"
});
let user = {};
if(db.search({ id: 1 }).length == 0){
    user = db.new({
        id: 1,
        name: "Denis",
        lastname: "Stasov",
        phonenumber: "89275714852",
        activated: true
    });
    db.write()
};

user.name = "Vlad";
db.write()
```
## Need to work:
* Install module ```fs``` (or just type ```npm i``` in console)

## Functions
* Retrieving all entrys.
```js
db.get() // [{...}]
```
* Searching entry by JSON or function
```js
db.search({ name: "Vlad", lastname: "Stasov" }); // Example of JSON searching. [{ id: 1, name: "Vlad", lastname: "Stasov" ... }]
db.search(entry => entry.name == "Vlad" && entry.lastname == "Stasov") // Example of arrow function. [{ id: 1, name: "Vlad", lastname: "Stasov" ... }]
```
* Writing any changes. (Must be used after every post DB request, like as db.new() or db.clear())
```js
user.password = "secretPass<3";
db.write() // true
```
* Adding entry.
```js
db.new({
    id: 2,
    name: "Ivan",
    lastname: "Ivanov",
    phonenumber: "89276518535",
    activated: false
}) // { id: 2, name: "Ivan", lastname: "Ivanov" }
```
* Removing entry by key.
```js
db.remove({ id: 2 }) // true
```
* Add some values to all entries if they don't have this value.
```js
db.include({
    discord: "",
    minecraft: ""
}) // { discord: 2, minecraft: 2 }
```
* Clear DB.
```js
db.clear() // true
```
* Add some values to all entries with some key if they don't have this value.
```js
db.includeKey(e => e.activated == true, {
    twitch: ""
}) // { twitch: 1 }
```
## Some author words
### I do not recommend this database for large projects. Better use MySQL, MongoDB, etc.