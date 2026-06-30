// NOTES OF LEC-6 SEASON 2

This is exactly the kind of question that helps you move from "copying code" to actually understanding programming. Let's break it down step by step.

## 1. What is Mongoose?

**Mongoose is a library (or package).**

People often use these terms interchangeably, but technically:

* **Package** = something you install using npm

```bash
npm install mongoose
```

* **Library** = a collection of code written by someone else that helps you do something.

So Mongoose is:

* a **library** for working with MongoDB
* distributed as an npm **package**

---

## 2. What happens here?

```js
import mongoose from "mongoose";
```

Think of this as:

> "Bring the mongoose package into my file and store it in a variable called `mongoose`."

Now the variable `mongoose` contains lots of things:

```js
mongoose.Schema
mongoose.model
mongoose.connect
mongoose.Types
```

etc.

It's actually an **object** with many properties and methods.

Similar to:

```js
const person = {
    name: "Abiha",
    age: 23,
    greet() {
        console.log("Hello");
    }
};
```

You can access:

```js
person.name
person.age
person.greet()
```

using the dot (`.`) operator.

Same idea:

```js
mongoose.Schema
mongoose.model
mongoose.connect
```

---

## 3. What is the dot (`.`)?

The dot operator means:

> "Go inside this object and access one of its properties."

Example:

```js
const student = {
    name: "Ali",
    age: 20
};

console.log(student.name);
```

Output:

```js
Ali
```

Here:

```js
student.name
```

means:

> "Get the `name` property from the `student` object."

Similarly:

```js
mongoose.Schema
```

means:

> "Get the `Schema` property from the mongoose object."

---

## 4. What is `mongoose.Schema`?

Inside mongoose, there is a constructor/function called `Schema`.

You can imagine mongoose looks somewhat like:

```js
const mongoose = {
    Schema: function() {},
    model: function() {},
    connect: function() {}
};
```

So:

```js
mongoose.Schema
```

refers to that function.

---

## 5. What is happening here?

```js
const userSchema = mongoose.Schema({
```

or more commonly:

```js
const userSchema = new mongoose.Schema({
```

You are calling the Schema constructor and passing an object.

The object describes:

> "What fields should a User document have?"

---

## 6. Why do we need a Schema?

MongoDB itself is flexible.

Without Mongoose you could store:

```js
{
   name: "Abiha"
}
```

and later

```js
{
   age: 23
}
```

and later

```js
{
   banana: true
}
```

MongoDB doesn't complain.

Mongoose Schema adds structure.

You tell Mongoose:

```js
A User should have:
- firstName
- lastName
- emailId
- password
- age
- gender
```

Now Mongoose can validate data.

---

## 7. Let's understand the schema object

```js
{
    firstName: {
        type: String
    }
}
```

means:

> Create a field called `firstName` whose value should be a string.

Example valid:

```js
{
    firstName: "Abiha"
}
```

Example invalid:

```js
{
    firstName: 123
}
```

because 123 is a number.

---

### Same for age

```js
age: {
    type: Number
}
```

Valid:

```js
{
    age: 23
}
```

Invalid:

```js
{
    age: "twenty three"
}
```

---

## 8. What does the entire schema mean?

```js
const userSchema = new mongoose.Schema({
    firstName:{type:String},
    lastName:{type:String},
    emailId:{type:String},
    password:{type:String},
    age:{type:Number},
    gender:{type:String}
});
```

Translation:

> "Hey Mongoose, I want a blueprint for User documents. Every User document may contain these fields and these data types."

Think of a schema as a **blueprint of a house**.

Before building houses, an architect creates a blueprint.

Before storing users, we create a schema.

---

## 9. What is happening here?

```js
const userModel = mongoose.model("User", userSchema);
```

This is the next step.

You already created the blueprint:

```js
userSchema
```

Now you tell Mongoose:

```js
Create a model called User using this blueprint.
```

The model is what you actually use to interact with MongoDB.

---

## 10. Schema vs Model

A common confusion.

### Schema

Blueprint

```js
const userSchema = new mongoose.Schema({
    firstName:String
});
```

Just defines structure.

---

### Model

Machine built using blueprint.

```js
const User = mongoose.model("User", userSchema);
```

Now you can:

```js
User.find()
User.create()
User.deleteOne()
User.updateOne()
```

---

## Real-world analogy

### Schema = House Blueprint

```js
userSchema
```

Defines:

* 2 bedrooms
* 1 kitchen
* 1 bathroom

---

### Model = Construction Company

```js
User
```

Actually builds houses.

You can say:

```js
User.create(...)
```

like:

> Build a new house.

---

## 11. Example flow

### Step 1

Import mongoose

```js
import mongoose from "mongoose";
```

---

### Step 2

Create schema

```js
const userSchema = new mongoose.Schema({
    firstName:String,
    age:Number
});
```

---

### Step 3

Create model

```js
const User = mongoose.model("User", userSchema);
```

---

### Step 4

Create document

```js
const user = new User({
    firstName: "Abiha",
    age: 23
});
```

---

### Step 5

Save to database

```js
await user.save();
```

MongoDB stores:

```js
{
   "_id": "...",
   "firstName": "Abiha",
   "age": 23
}
```

---

The key idea is:

**`mongoose` is an object exported by the Mongoose package.**
**`Schema` and `model` are functions/properties inside that object.**
**The dot operator (`.`) is used to access properties of an object.**
**A Schema describes the structure of data, and a Model lets you create, read, update, and delete that data in MongoDB.**

Once you understand JavaScript objects and the dot operator, most Express/Mongoose code starts looking much less magical.


Excellent observation. This gets into how JavaScript functions and constructors work.

You wrote:

```js
const userSchema = mongoose.Schema({
    firstName: String
});
```

instead of:

```js
const userSchema = new mongoose.Schema({
    firstName: String
});
```

and it still worked.

### Normally, `new` is required

Consider this constructor:

```js
function Person(name) {
    this.name = name;
}
```

Correct:

```js
const p = new Person("Abiha");
```

Without `new`:

```js
const p = Person("Abiha");
```

`p` becomes `undefined` and the code behaves incorrectly.

---

### Then why does Mongoose work?

Because the Mongoose developers intentionally wrote `Schema` so it can handle both cases.

Internally, it does something similar to:

```js
function Schema(definition) {
    if (!(this instanceof Schema)) {
        return new Schema(definition);
    }

    // actual schema creation logic
}
```

What this means:

When you do

```js
mongoose.Schema({...})
```

JavaScript calls `Schema`.

Inside the function, Mongoose checks:

```js
this instanceof Schema
```

If you forgot `new`, it automatically does:

```js
return new Schema(...)
```

for you.

So:

```js
mongoose.Schema({...})
```

effectively becomes:

```js
new mongoose.Schema({...})
```

behind the scenes.

---

### Then why do people still write `new`?

Because:

1. It clearly tells readers that `Schema` is a constructor.
2. It follows JavaScript conventions.
3. It works even if Mongoose changes its implementation someday.
4. It's what the official documentation shows.

So you'll usually see:

```js
const userSchema = new mongoose.Schema({...});
```

---

### Quick rule

If you see something that creates an object or instance, like:

```js
new Date()
new Array()
new Map()
new User()
new mongoose.Schema()
```

use `new` unless the documentation explicitly says otherwise.

For Mongoose Schema, both work today, but **using `new mongoose.Schema(...)` is the recommended style**.


This is a very important question because it gets to the heart of what a **Model** is in Mongoose.

Let's look at the line:

```js id="kz3uhg"
const User = mongoose.model("User", userSchema);
```

### Are these two `User`s the same?

```js id="5v6f4k"
const User = mongoose.model("User", userSchema);
```

There are actually **two different things** here:

#### First `"User"`

```js id="vfw2pq"
mongoose.model("User", userSchema)
```

This is just a **string**.

It's the name you're giving to the model.

Think:

```js id="w78u7g"
"User"
```

is just text.

---

#### Second `User`

```js id="d0xggl"
const User = ...
```

This is a JavaScript variable.

It stores whatever `mongoose.model()` returns.

So these are not the same thing.

One is:

```js id="r85l84"
"User"   // string
```

The other is:

```js id="6rj8mo"
User     // variable
```

---

## What does `mongoose.model()` return?

It returns a **Model class**.

Imagine Mongoose internally does something like:

```js id="x8y3d2"
class UserModel {
   // methods
}
```

and gives it back to you.

So:

```js id="oqqnls"
const User = mongoose.model("User", userSchema);
```

becomes roughly:

```js id="r0ov3h"
const User = UserModel;
```

---

## Is `User` an object?

Not exactly.

`User` is a **class/constructor function**.

Remember:

```js id="z93vdg"
class Person {}
```

Then:

```js id="g3jk8h"
const p = new Person();
```

Here:

* `Person` is the class
* `p` is the object

Similarly:

```js id="vl4s5r"
const User = mongoose.model("User", userSchema);
```

* `User` is the model (class)
* actual user documents are objects created from it

Example:

```js id="0xg1ye"
const user1 = new User({
    firstName: "Abiha",
    age: 23
});
```

Now:

```js id="drd4s2"
user1
```

is an object.

---

## Visualizing it

### Step 1: Create Schema

```js id="17ylly"
const userSchema = new mongoose.Schema({
    firstName: String,
    age: Number
});
```

Blueprint:

```
User
 ├── firstName
 └── age
```

---

### Step 2: Create Model

```js id="tvg80x"
const User = mongoose.model("User", userSchema);
```

Factory:

```
Schema ---> Model
```

---

### Step 3: Create Object

```js id="4nwsf0"
const user1 = new User({
    firstName: "Abiha",
    age: 23
});
```

Now:

```
User (Model)
      |
      v
   user1
```

where

```js id="pl0m8o"
user1.firstName
```

is available.

---

## What does Mongoose do internally?

Very roughly:

```js id="wzt8ee"
const User = mongoose.model("User", userSchema);
```

is similar to:

```js id="1lp9c8"
class User {
   constructor(data) {
      this.firstName = data.firstName;
      this.age = data.age;
   }
}
```

Not exactly, but conceptually.

Then:

```js id="vjm7jv"
const user1 = new User({
   firstName: "Abiha",
   age: 23
});
```

creates an object.

---

## Why do we need the string `"User"`?

```js id="34tlft"
mongoose.model("User", userSchema)
```

Mongoose uses it as the model name.

It also derives the MongoDB collection name from it.

For example:

```js id="pxs7ui"
mongoose.model("User", userSchema)
```

creates/uses a collection called:

```js id="w0zh5i"
users
```

(pluralized automatically)

---

## The most important takeaway

```js id="v9njlwm"
const User = mongoose.model("User", userSchema);
```

* `"User"` → model name (string)
* `userSchema` → blueprint
* `mongoose.model(...)` → creates a Model class
* `User` → stores that Model class
* `new User({...})` → creates an actual user object/document

Think of it like:

```js id="ghnpsr"
class Car {}
```

```js id="g76h0q"
const myCar = new Car();
```

Mongoose is doing something very similar:

```js id="mgq7ha"
const User = mongoose.model(...);
```

```js id="3ee4xk"
const user1 = new User(...);
```

Once you understand **Schema → Model → Document(Object)**, most Mongoose code suddenly makes sense.


YESSS! 🎯 You just connected two very important concepts.

Let's trace where each thing came from.

### Where did `devTinder` come from?

Your connection string contains:

```text
mongodb+srv://username:password@cluster0.ihiwtdn.mongodb.net/devTinder?appName=Cluster0
```

Notice:

```text
...mongodb.net/devTinder
              ↑
```

That part is the **database name**.

So when Mongoose connects:

```js
mongoose.connect(DB_CONNECTION_STRING);
```

it connects to the database:

```text
devTinder
```

If you had written:

```text
mongodb.net/myDatabase
```

then Compass would show:

```text
myDatabase
```

instead.

---

### Where did `users` come from?

You wrote:

```js
mongoose.model("User", userSchema);
```

The string:

```js
"User"
```

is the **model name**.

Mongoose automatically converts it to a collection name:

```text
User
 ↓
users
```

(lowercase + plural)

So:

```js
mongoose.model("User", userSchema);
```

creates/uses:

```text
users
```

collection.

---

### Complete flow

You wrote:

```js
mongoose.connect(
    "...mongodb.net/devTinder"
);
```

↓

Database becomes:

```text
devTinder
```

Then:

```js
mongoose.model("User", userSchema);
```

↓

Collection becomes:

```text
users
```

Then:

```js
const user = new userModel({...});
await user.save();
```

↓

Document gets inserted into:

```text
devTinder
   └── users
          └── {
                 firstName: "Abiha",
                 ...
              }
```

---

### Fun experiment

If you change:

```js
mongoose.model("Employee", userSchema);
```

and save again,

Mongoose will create:

```text
devTinder
   ├── users
   └── employees
```

because:

```text
Employee
 ↓
employees
```

---

### One subtle point

The database `devTinder` usually isn't created immediately when you connect.

MongoDB creates it automatically when you first insert data into it.

So the sequence is roughly:

```text
Connect to devTinder
        ↓
Save first document
        ↓
MongoDB creates devTinder database
        ↓
MongoDB creates users collection
        ↓
Document inserted
```

This automatic creation is one of the things that makes MongoDB feel very flexible compared to SQL databases.

So your understanding is correct:

✅ `devTinder` came from the connection string.

✅ `users` came from `mongoose.model("User", ...)`.

✅ The document came from `new userModel(...)` + `save()`.

