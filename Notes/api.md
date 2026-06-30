Exactly! 🎯

```js
app.use(express.json());
```

is middleware that tells Express:

> "If a request body contains JSON, parse it and convert it into a JavaScript object."

---

### Without `express.json()`

Suppose Postman sends:

```json
{
    "firstName": "Abiha",
    "age": 23
}
```

When it reaches your route:

```js
app.post("/signup", (req, res) => {
    console.log(req.body);
});
```

Without:

```js
app.use(express.json());
```

Express doesn't know how to parse the JSON.

So:

```js
req.body
```

will be:

```js
undefined
```

or empty.

---

### With `express.json()`

Express reads:

```json
{
    "firstName": "Abiha",
    "age": 23
}
```

converts it into a JavaScript object:

```js
{
    firstName: "Abiha",
    age: 23
}
```

and stores it in:

```js
req.body
```

Now:

```js
app.post("/signup", (req, res) => {
    console.log(req.body);
});
```

prints:

```js
{
    firstName: 'Abiha',
    age: 23
}
```

---

### Real flow

Postman sends:

```json
{
    "firstName": "Abiha",
    "lastName": "Rizvi"
}
```

↓

HTTP Request

↓

```js
app.use(express.json());
```

↓

Converts JSON text to JS object

↓

```js
req.body
```

becomes

```js
{
    firstName: "Abiha",
    lastName: "Rizvi"
}
```

↓

You can do:

```js
const user = new userModel(req.body);
```

---

### Why is it called middleware?

Because it sits **between**:

```text
Request
   ↓
Middleware
   ↓
Route Handler
   ↓
Response
```

For example:

```js
app.use(express.json());

app.post("/signup", (req, res) => {
    console.log(req.body);
    res.send("Done");
});
```

Execution order:

1. Request arrives
2. `express.json()` runs
3. It fills `req.body`
4. Your route handler runs
5. Response is sent

---

### One subtle thing

JSON is technically just text.

Postman sends something like:

```text
{
    "firstName": "Abiha"
}
```

over the network.

`express.json()` parses that text and converts it into an actual JavaScript object:

```js
{
    firstName: "Abiha"
}
```

That's why after using `express.json()` you can access:

```js
req.body.firstName
```

and get:

```js
"Abiha"
```

So your understanding is correct:

✅ JSON comes from the client (Postman/browser).

✅ `express.json()` parses that JSON.

✅ The parsed JavaScript object is placed in `req.body`.

✅ Then you can use `req.body.firstName`, `req.body.emailId`, etc. in your route.

Let's go through it exactly as the computer executes it.

```js
app.get("/user", async (req, res) => {
```

### Line 1

```js
app.get("/user", async (req, res) => {
```

* `app` → Express application object.
* `.get()` → Register a GET route.
* `"/user"` → URL path.
* `async` → This function can use `await`.
* `req` → Request object (contains data sent by client).
* `res` → Response object (used to send data back).

Meaning:

> "Whenever someone sends a GET request to `/user`, run this function."

---

### Line 2

```js
const userEmail = req.body.emailId;
```

Suppose client sends:

```json
{
    "emailId":"abiha@gmail.com"
}
```

Then:

```js
req.body
```

becomes:

```js
{
    emailId:"abiha@gmail.com"
}
```

So:

```js
const userEmail = req.body.emailId;
```

stores:

```js
userEmail = "abiha@gmail.com"
```

⚠️ In real applications GET requests usually use:

```js
req.query.emailId
```

instead of `req.body.emailId`.

---

### Line 3

```js
try {
```

Start a try block.

Meaning:

> "Try executing this code. If an error occurs, jump to catch."

Example errors:

* Database connection lost
* Invalid query
* Mongoose error

---

### Line 4

```js
const users = await User.find({
    emailId: userEmail
});
```

This is the most important line.

Suppose:

```js
userEmail = "abiha@gmail.com"
```

Then query becomes:

```js
User.find({
    emailId: "abiha@gmail.com"
});
```

Meaning:

> "Search the users collection and return all documents whose emailId is [abiha@gmail.com](mailto:abiha@gmail.com)."

Database:

```json
[
  {
    "firstName":"Abiha",
    "emailId":"abiha@gmail.com"
  }
]
```

Result:

```js
users = [
    {
        firstName:"Abiha",
        emailId:"abiha@gmail.com"
    }
]
```

---

### Why await?

Without:

```js
const users = User.find(...);
```

you get a Promise.

With:

```js
const users = await User.find(...);
```

JavaScript waits for MongoDB to respond.

---

### Line 5

```js
if (users.length === 0) {
```

Remember:

```js
find()
```

always returns an array.

Possible results:

```js
[]
```

or

```js
[
  {...}
]
```

or

```js
[
  {...},
  {...}
]
```

So:

```js
users.length === 0
```

means:

> "No matching users found."

---

### Line 6

```js
return res.status(404).send("User not found");
```

If no user exists:

Send:

```http
Status Code: 404
Body: User not found
```

to client.

The `return` is important.

Without it:

```js
res.send(...)
```

would execute later and Express would complain:

```text
Cannot set headers after they are sent
```

---

### Line 7

```js
res.send(users);
```

If users are found:

Send them back.

Example response:

```json
[
  {
    "_id":"123",
    "firstName":"Abiha",
    "emailId":"abiha@gmail.com"
  }
]
```

---

### Line 8

```js
} catch (err) {
```

If anything inside try fails:

```js
User.find(...)
```

throws an error.

Control jumps here.

---

### Line 9

```js
res.status(400).send("Something went wrong");
```

Send error response.

Example:

```http
Status Code: 400
Body: Something went wrong
```

---

## Complete Execution Flow

Suppose request arrives:

```http
GET /user
```

with

```json
{
    "emailId":"abiha@gmail.com"
}
```

### Step 1

Route matches:

```js
app.get("/user", ...)
```

---

### Step 2

Extract email:

```js
const userEmail = req.body.emailId;
```

Result:

```js
"abiha@gmail.com"
```

---

### Step 3

Search database:

```js
User.find({
    emailId:"abiha@gmail.com"
});
```

---

### Step 4

MongoDB checks collection:

```text
users collection
```

and finds matching documents.

---

### Step 5

If none found:

```js
[]
```

↓

```js
res.status(404).send("User not found");
```

---

### Step 6

If found:

```js
[
   {
      firstName:"Abiha",
      emailId:"abiha@gmail.com"
   }
]
```

↓

```js
res.send(users);
```

---

### One improvement

Since emails should be unique, I'd write:

```js
const user = await User.findOne({
    emailId: userEmail
});
```

instead of:

```js
const users = await User.find(...)
```

because you're looking for **one user**, not a list of users. That's why many real-world APIs use `findOne()` when searching by email.
YES! 🔥 You're now asking the question that makes Mongoose finally click.

The answer is:

> Yes, classes can have methods that are called directly with the dot operator.

Let's forget Mongoose for a moment.

## Normal JavaScript Class

```js
class Student {

    static find() {
        console.log("Finding student...");
    }

    greet() {
        console.log("Hello");
    }
}
```

Now look carefully.

### Static Method

```js
Student.find();
```

works.

Why?

Because `find` is marked as:

```js
static find()
```

Static methods belong to the **class itself**.

---

### Instance Method

```js
const s = new Student();

s.greet();
```

works.

Why?

Because `greet` belongs to the **object** created from the class.

---

## Two Types of Methods

### Class Methods (Static)

```js
Student.find();
Student.create();
Student.delete();
```

Called on the class.

---

### Object Methods

```js
const s = new Student();

s.greet();
s.walk();
```

Called on an object.

---

## Now Mongoose

When you write:

```js
const User = mongoose.model("User", userSchema);
```

Mongoose creates something conceptually similar to:

```js
class User {

    static find() {}

    static findOne() {}

    static deleteOne() {}

    static updateOne() {}

    save() {}
}
```

Notice:

### Static methods

```js
User.find()
User.findOne()
User.deleteOne()
```

These belong to the Model.

---

### Instance methods

```js
const user = new User({
    firstName: "Abiha"
});

user.save();
```

This belongs to the actual document.

---

## Why isn't it:

```js
new User.find()
```

?

Because `find()` is already a static method.

Think:

```js
Student.find();
```

not

```js
new Student.find();
```

That doesn't make sense.

---

## This is the biggest mental model

### Model = Collection Operations

```js
User.find()
User.findOne()
User.deleteOne()
User.updateOne()
```

These operate on the entire collection.

Imagine:

```text
users collection
 ├── user1
 ├── user2
 └── user3
```

You ask:

```js
User.find()
```

Meaning:

> Search the users collection.

---

### Document = Single User Operations

```js
const user = new User({...});
```

Now you have one document.

```js
user.save();
```

Meaning:

> Save THIS specific user.

---

## Visualize

```text
Database
    │
    ▼
users collection
    │
    ▼
User Model
```

Model methods:

```js
User.find()
User.findOne()
User.deleteOne()
```

operate on the collection.

---

```text
User Model
    │
    ▼
new User({...})
    │
    ▼
user document
```

Document methods:

```js
user.save()
```

operate on one document.

---

That's why in Mongoose you often see:

```js
const users = await User.find();
```

because `find()` is a **static method on the Model class**.

and

```js
const user = new User({...});

await user.save();
```

because `save()` is an **instance method on a document object**.

This distinction—**Model methods vs Document methods**—is one of the most important concepts in Mongoose. Once you understand that, methods like `find`, `findOne`, `updateOne`, and `save` stop feeling magical and start feeling like normal JavaScript classes.

This is a very common interview and backend development question.

## PUT vs PATCH

Both are used to **update existing data**, but the way they update is different.

---

# PUT = Replace Entire Resource

Suppose your database has:

```json id="i1ltn0"
{
    "firstName": "Abiha",
    "lastName": "Rizvi",
    "age": 23
}
```

You send:

```http id="wdqfuh"
PUT /user
```

Body:

```json id="3cg2u8"
{
    "firstName": "Abiha",
    "age": 24
}
```

With PUT, you're saying:

> "Replace the entire user with this new data."

Result:

```json id="l8lj7v"
{
    "firstName": "Abiha",
    "age": 24
}
```

Notice:

```text id="2i0thx"
lastName
```

is gone because you didn't send it.

---

# PATCH = Update Specific Fields

Suppose database has:

```json id="s53g94"
{
    "firstName": "Abiha",
    "lastName": "Rizvi",
    "age": 23
}
```

You send:

```http id="s6y8h4"
PATCH /user
```

Body:

```json id="hf5m4m"
{
    "age": 24
}
```

Meaning:

> "Only change the age."

Result:

```json id="xkgz94"
{
    "firstName": "Abiha",
    "lastName": "Rizvi",
    "age": 24
}
```

Everything else stays the same.

---

# Real World Analogy

Imagine a user profile:

```text id="twb70v"
Name: Abiha
Email: abiha@gmail.com
Age: 23
```

### PUT

You submit:

```text id="v0tqws"
Name: Abiha
Age: 24
```

System replaces entire profile.

Email may disappear if not included.

---

### PATCH

You submit:

```text id="gkj6zt"
Age: 24
```

System updates only age.

Name and email remain untouched.

---

# Express Example

### PUT

```js id="2z9w3m"
app.put("/user/:id", async (req, res) => {
    await User.replaceOne(
        { _id: req.params.id },
        req.body
    );

    res.send("User replaced");
});
```

---

### PATCH

```js id="s42y16"
app.patch("/user/:id", async (req, res) => {
    await User.updateOne(
        { _id: req.params.id },
        { $set: req.body }
    );

    res.send("User updated");
});
```

---

# Interview Answer

| PUT                           | PATCH                         |
| ----------------------------- | ----------------------------- |
| Replaces entire resource      | Updates only specified fields |
| Send complete object          | Send only fields to change    |
| Missing fields may be removed | Missing fields stay unchanged |
| Used for full updates         | Used for partial updates      |

---

### In most MERN applications

If a user wants to change:

```text id="iwwz5f"
only age
only password
only profile photo
only bio
```

we usually use:

```http id="qlfgzg"
PATCH
```

because updating only a few fields is much more common than replacing the entire document.
