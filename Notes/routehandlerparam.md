This is one of the most important concepts in Express. Once you understand the `req` object, almost every API becomes much easier.

---

# What is `req`?

Whenever a client (browser, Postman, frontend, mobile app) sends an HTTP request to your Express server, Express creates a **request object** called `req`.

```cpp
Client  --------HTTP Request-------->  Express Server

                    req
```

The request object contains **everything about the incoming request**.

Think of it as a big object.

```js
req = {
   body: {},
   params: {},
   query: {},
   headers: {},
   cookies: {},
   method: "PATCH",
   url: "/updateuser/123",
   ...
}
```

Express automatically creates this object.

---

# Route Handler Syntax

```js
app.patch("/updateuser/:userId", (req, res) => {

});
```

There are two important objects.

```js
(req, res)
```

### req

Contains information sent **from the client to the server.**

### res

Used to send a response **from the server back to the client.**

---

# What can req contain?

The most commonly used properties are

```
req.body
req.params
req.query
req.headers
req.cookies
req.method
req.url
req.path
```

Let's understand each one.

---

# 1. req.body

Most beginners use this first.

It contains the **data sent inside the request body.**

Example

Client sends

```http
PATCH /updateuser/123
```

Body

```json
{
   "age":22,
   "skills":["C++","NodeJS"]
}
```

Express stores it inside

```js
req.body
```

So

```js
console.log(req.body);
```

prints

```js
{
   age:22,
   skills:["C++","NodeJS"]
}
```

Then you can do

```js
const data = req.body;
```

or

```js
const {age, skills} = req.body;
```

---

## When do we use req.body?

Whenever client sends **actual data.**

Examples

Creating user

```http
POST /signup
```

Body

```json
{
   "name":"Abiha",
   "email":"abc@gmail.com"
}
```

Updating profile

```http
PATCH /updateuser"
```

Body

```json
{
   "about":"Love coding"
}
```

Login

```http
POST /login
```

Body

```json
{
   "email":"abc@gmail.com",
   "password":"12345"
}
```

---

## When NOT to use req.body?

Never use body to identify resources.

Bad

```
PATCH /updateuser

Body

{
   "userId":"123",
   "age":24
}
```

Better

```
PATCH /updateuser/123

Body

{
   "age":24
}
```

The URL identifies **which resource**, while the body describes **what data** to create or change.

---

# Why do we need express.json()?

Without

```js
app.use(express.json());
```

Express cannot read JSON.

Then

```js
req.body
```

becomes

```js
undefined
```

---

# 2. req.params

These are **route parameters.**

Look carefully.

```js
app.patch("/updateuser/:userId",...)
```

Notice

```
:userId
```

The colon means

> "There will be a variable here."

Example request

```
PATCH /updateuser/685ab123
```

Express automatically creates

```js
req.params
```

which becomes

```js
{
   userId:"685ab123"
}
```

So

```js
const id = req.params.userId;
```

or

```js
const id = req.params?.userId;
```

Both work.

---

Another example

```js
app.get("/users/:id/books/:bookId")
```

Request

```
GET /users/45/books/91
```

Then

```js
req.params
```

is

```js
{
   id:"45",
   bookId:"91"
}
```

---

## When do we use params?

Whenever we want to identify a **specific resource.**

Like

```
/user/5
```

```
/product/10
```

```
/movie/18
```

```
/order/987
```

---

# Why colon (:)?

Because Express knows

```
:userId
```

means

"Capture this value."

Without colon

```
updateuser/userId
```

Express thinks

```
userId
```

is literally the word "userId."

---

# 3. req.query

Query parameters come **after the `?`** in the URL.

Example

```
GET /users?age=20
```

Express creates

```js
req.query
```

which becomes

```js
{
   age:"20"
}
```

Notice

Everything is a string.

---

Another example

```
GET /users?gender=female&age=20
```

Then

```js
req.query
```

becomes

```js
{
   gender:"female",
   age:"20"
}
```

---

## When do we use query?

Mostly for

Filtering

```
GET /users?gender=female
```

Searching

```
GET /users?name=Abiha
```

Sorting

```
GET /users?sort=age
```

Pagination

```
GET /users?page=3
```

---

Never use query for passwords.

Bad

```
/login?password=12345
```

Because it appears in the URL.

Use body instead.

---

# Difference between params and query

Suppose you have 100 users.

You want user number 25.

```
GET /users/25
```

25 identifies exactly one user.

So use

```
params
```

---

Suppose you want

```
All female users
```

```
GET /users?gender=female
```

Here you're filtering.

So use

```
query
```

---

# Visual Difference

### Params

```
/users/45
```

```
      ↑
   req.params.id
```

---

### Query

```
/users?page=2&sort=age

         ↑
     req.query.page
```

---

### Body

```
PATCH /users/45

{
   "age":24
}
```

```
req.body.age
```

---

# 4. req.headers

Headers contain metadata about the request.

Example

```http
Authorization: Bearer abc123
Content-Type: application/json
```

You can access them like

```js
req.headers
```

or

```js
req.headers.authorization
```

Very common in authentication.

---

# 5. req.method

Returns

```
GET
POST
PATCH
DELETE
PUT
```

Example

```js
console.log(req.method);
```

Output

```
PATCH
```

---

# 6. req.url

Suppose request is

```
/users?page=2
```

Then

```js
req.url
```

prints

```
/users?page=2
```

---

# 7. req.path

Same request

```
/users?page=2
```

Now

```js
req.path
```

prints

```
/users
```

No query parameters.

---

# 8. req.cookies

If you use cookie middleware, cookies sent by the client are available in

```js
req.cookies
```

Example

```js
{
   token:"abcdef"
}
```

Very common in authentication systems.

---

# Complete Example

Request

```http
PATCH /updateuser/685ab123?notify=true
```

Headers

```http
Authorization: Bearer xyz
```

Body

```json
{
   "age":22,
   "skills":["Node","MongoDB"]
}
```

Then inside Express

```js
console.log(req.params);
```

Output

```js
{
   userId:"685ab123"
}
```

```js
console.log(req.query);
```

Output

```js
{
   notify:"true"
}
```

```js
console.log(req.body);
```

Output

```js
{
   age:22,
   skills:["Node","MongoDB"]
}
```

```js
console.log(req.headers.authorization);
```

Output

```
Bearer xyz
```

---

# Easy way to remember

| Part             | Purpose                               | Example URL                   | Access                      |
| ---------------- | ------------------------------------- | ----------------------------- | --------------------------- |
| **Route Params** | Identify a specific resource          | `/users/123`                  | `req.params.userId`         |
| **Query Params** | Filter, search, sort, paginate        | `/users?page=2&gender=female` | `req.query.page`            |
| **Body**         | Data to create or update              | `{ "age": 22 }`               | `req.body.age`              |
| **Headers**      | Metadata (tokens, content type, etc.) | `Authorization: Bearer ...`   | `req.headers.authorization` |

## Applying this to your code

```js
app.patch("/updateuser/:userId", async (req, res) => {
    const userId = req.params.userId; // Which user should be updated?
    const data = req.body;            // What fields should be updated?

    // Example request:
    // PATCH /updateuser/685ab123
    // Body:
    // {
    //   "age": 22,
    //   "skills": ["NodeJS", "MongoDB"]
    // }
});
```

Here, `userId` comes from the URL because it identifies **which user** to update, while `data` comes from the body because it contains **what information** to update.

---
Excellent observation. The `?` you're asking about here is this line:

```js
const userId = req.params?.userId;
```

This `?.` is called the **optional chaining operator** in JavaScript. It is **not related to Express**—it's a JavaScript feature.

Let's understand it from the beginning.

---

# Without `?.`

Normally, you access an object's property like this:

```js
const obj = {
    name: "Abiha"
};

console.log(obj.name);
```

Output:

```
Abiha
```

Here,

* `obj` is an object.
* `name` is its property.

---

## Another example

```js
const person = {
    age: 22
};

console.log(person.age);
```

Output

```
22
```

---

# What happens if the object doesn't exist?

Suppose

```js
const person = undefined;

console.log(person.age);
```

Now JavaScript tries to do

```
undefined.age
```

But `undefined` has no properties.

So JavaScript throws an error:

```
TypeError:
Cannot read properties of undefined
```

Your entire program may stop (unless the error is caught).

---

# Optional Chaining (`?.`)

Instead of writing

```js
person.age
```

you write

```js
person?.age
```

Now JavaScript first checks:

> "Does `person` exist?"

If **yes**, it accesses `.age`.

If **no**, it simply returns `undefined` instead of throwing an error.

Example

```js
const person = undefined;

console.log(person?.age);
```

Output

```
undefined
```

Notice

No crash.

---

# Why is it called "optional"?

Because accessing the next property becomes **optional**.

Normally

```js
person.age
```

means

```
Go to person
↓

Read age
```

With optional chaining

```js
person?.age
```

means

```
Go to person

↓

If it exists

↓

Read age

Else

↓

Return undefined
```

---

# Another Example

Without optional chaining

```js
const student = null;

console.log(student.name);
```

Error

```
Cannot read properties of null
```

With optional chaining

```js
console.log(student?.name);
```

Output

```
undefined
```

---

# Why use it with `req.params`?

In your code

```js
const userId = req.params?.userId;
```

Let's imagine Express creates

```js
req = {
    params: {
        userId: "12345"
    }
};
```

Then

```js
req.params?.userId
```

returns

```
12345
```

---

Now imagine `req.params` is somehow `undefined`.

Without optional chaining

```js
req.params.userId
```

becomes

```
undefined.userId
```

Error

```
Cannot read properties of undefined
```

With optional chaining

```js
req.params?.userId
```

Output

```
undefined
```

No crash.

---

# Is it necessary here?

In your route:

```js
app.patch("/updateuser/:userId", ...)
```

Express **always creates `req.params`**, even if there are no route parameters.

For example:

```js
app.get("/hello", (req, res) => {
    console.log(req.params);
});
```

Output:

```js
{}
```

An empty object, **not `undefined`**.

So in your route,

```js
req.params.userId
```

is perfectly safe.

Most developers simply write:

```js
const userId = req.params.userId;
```

The `?.` doesn't hurt, but it's unnecessary in this specific case.

---

# When is `?.` actually useful?

It shines with nested objects where some parts may not exist.

Example:

```js
const user = {
    profile: {
        address: {
            city: "Delhi"
        }
    }
};
```

Access city

```js
console.log(user.profile.address.city);
```

Output

```
Delhi
```

Now suppose the API returns

```js
const user = {};
```

This line

```js
user.profile.address.city
```

throws an error because `profile` doesn't exist.

Instead, write

```js
user.profile?.address?.city
```

Output

```
undefined
```

No crash.

---

# Difference between `.` and `?.`

```js
obj.property
```

Means:

> "I am sure `obj` exists."

If it doesn't, JavaScript throws an error.

---

```js
obj?.property
```

Means:

> "I'm not sure `obj` exists. If it does, give me the property. Otherwise, return `undefined`."

---

# One more thing: don't confuse these two `?` symbols

There are **two completely different uses of `?`** in JavaScript and URLs:

1. **`?.`** → Optional chaining (JavaScript)

```js
req.params?.userId
```

2. **`?` in a URL** → Starts the query string

```
/users?page=2&gender=female
      ^
```

This has nothing to do with optional chaining. It's part of the URL syntax and is why Express puts those values into `req.query`.

So even though both use the `?` character, they serve entirely different purposes.
Perfect. You've understood `req`, so now let's learn the other half of Express: **`res` (Response Object)**.

If `req` is **what the client sends to the server**, then `res` is **what the server sends back to the client**.

```
Client  ------------Request------------> Server
              (req)

Client  <-----------Response------------ Server
                (res)
```

Every route handler receives these two objects:

```js
app.get("/", (req, res) => {

});
```

* `req` → Read information from the client.
* `res` → Send information back to the client.

Without `res`, the client would keep waiting forever because the server never replied.

---

# Think of a Restaurant

Imagine you're at a restaurant.

You (client) order food.

```
"I want a pizza."
```

This is the **request**.

The waiter takes your order to the kitchen.

The chef prepares the pizza.

Then the waiter brings it back.

That returned pizza is the **response**.

```
Client
   │
   │ Request
   ▼
Server
   │
   │ Response
   ▼
Client
```

In Express,

```
req  = Customer's order

res  = Waiter bringing food back
```

---

# The Response Object

`res` is an object created by Express.

It contains many methods.

The most common are

```js
res.send()
res.json()
res.status()
res.redirect()
res.sendStatus()
res.cookie()
res.clearCookie()
res.set()
res.download()
res.sendFile()
res.end()
```

Let's understand every important one.

---

# 1. res.send()

This is the simplest and most common method.

Syntax

```js
res.send(data);
```

It sends **anything** back to the client.

Example

```js
app.get("/", (req, res) => {
    res.send("Hello World");
});
```

Browser

```
Hello World
```

---

Another example

```js
res.send("User created successfully");
```

Output

```
User created successfully
```

---

## Sending an object

```js
res.send({
    name: "Abiha",
    age: 22
});
```

Express automatically converts it into JSON.

Output

```json
{
   "name":"Abiha",
   "age":22
}
```

---

## Sending an array

```js
res.send([1,2,3,4]);
```

Output

```json
[1,2,3,4]
```

---

## Sending a number

```js
res.send(100);
```

Although technically possible, it's not recommended because Express may interpret numbers differently depending on the version. If you want to return a status code, use `res.sendStatus(100)` or `res.status(100).send(...)` instead.

---

# 2. res.json()

This method sends **only JSON**.

Syntax

```js
res.json(object);
```

Example

```js
app.get("/user", (req,res)=>{

    res.json({
        name:"Abiha",
        age:22
    });

});
```

Output

```json
{
   "name":"Abiha",
   "age":22
}
```

---

## Difference

```js
res.send(object)
```

works.

```js
res.json(object)
```

also works.

Most developers prefer

```js
res.json()
```

when building REST APIs because it clearly indicates that the response is JSON.

---

# 3. res.status()

One of the most important methods.

Syntax

```js
res.status(statusCode)
```

It sets the HTTP status code.

Example

```js
res.status(200);
```

This **doesn't send the response yet**.

You must continue with

```js
res.send()
```

or

```js
res.json()
```

Example

```js
res.status(200).send("Success");
```

---

Another

```js
res.status(404).send("User not found");
```

---

Another

```js
res.status(500).send("Internal Server Error");
```

---

# Why can we chain them?

You wrote

```js
res.status(200).send("Done");
```

How?

Because

```js
res.status()
```

returns the same `res` object.

Think like this:

```
res.status(200)

↓

returns res again

↓

res.send(...)
```

So

```js
res.status(200).json({...});
```

works perfectly.

---

# Common Status Codes

## 200

Everything successful.

```js
res.status(200).send("OK");
```

---

## 201

Resource created.

```js
res.status(201).json(user);
```

Usually after POST.

---

## 400

Bad request.

```js
res.status(400).send("Invalid Input");
```

---

## 401

Unauthorized.

```js
res.status(401).send("Login Required");
```

---

## 403

Forbidden.

```js
res.status(403).send("Access Denied");
```

---

## 404

Not found.

```js
res.status(404).send("User not found");
```

---

## 500

Server error.

```js
res.status(500).send("Something went wrong");
```

---

# 4. res.sendStatus()

Shortcut.

Instead of

```js
res.status(404).send("Not Found");
```

you can write

```js
res.sendStatus(404);
```

Output

```
Not Found
```

Similarly

```js
res.sendStatus(200);
```

Output

```
OK
```

---

# 5. res.redirect()

Redirects to another URL.

```js
res.redirect("/login");
```

Browser automatically goes to

```
/login
```

---

# 6. res.set()

Sets response headers.

Example

```js
res.set("Author","Abiha");
```

or

```js
res.set({
    Author:"Abiha",
    Version:"1.0"
});
```

---

# 7. res.cookie()

Creates a cookie.

Example

```js
res.cookie("token","abc123");
```

Browser stores

```
token=abc123
```

Authentication systems often use this.

---

# 8. res.clearCookie()

Deletes a cookie.

```js
res.clearCookie("token");
```

Useful during logout.

---

# 9. res.download()

Downloads a file.

```js
res.download("resume.pdf");
```

Browser starts downloading it.

---

# 10. res.sendFile()

Sends a file.

Example

```js
res.sendFile(__dirname+"/index.html");
```

Browser displays the HTML page.

---

# 11. res.end()

Ends the response immediately.

```js
res.end();
```

Rarely used directly because `res.send()` and `res.json()` already end the response.

---

# Can we call res.send() twice?

No.

Wrong

```js
app.get("/",(req,res)=>{

    res.send("Hello");

    res.send("World");

});
```

Error

```
Cannot set headers after they are sent
```

Because the response has already been sent.

---

Correct

```js
res.send("Hello World");
```

---

# Why do we return after sending a response?

Suppose

```js
if(!user){

    res.status(404).send("User not found");
}

res.send(user);
```

If the user doesn't exist,

the first line sends

```
404
```

Then JavaScript continues executing

```js
res.send(user);
```

Now Express tries to send another response.

Error

```
Cannot set headers after they are sent
```

Correct

```js
if(!user){

    return res.status(404).send("User not found");
}

res.send(user);
```

`return` stops the function immediately after sending the response.

---

# Your Code

```js
try{

    const user = await User.findByIdAndUpdate(
        userId,
        data,
        { runValidators:true }
    );

    res.send("User updated successfully");

}catch(err){

    res.status(400).send("UPDATE FAILED: " + err.message);

}
```

Flow

```
Client

↓

PATCH Request

↓

Server receives req

↓

Database updates user

↓

res.send()

↓

Client receives

"User updated successfully"
```

If an error occurs

```
Client

↓

PATCH Request

↓

Database throws error

↓

catch()

↓

res.status(400).send(...)

↓

Client receives

UPDATE FAILED: ...
```

---

# Summary Table

| Method              | Purpose                                         | Example                      |
| ------------------- | ----------------------------------------------- | ---------------------------- |
| `res.send()`        | Send any type of response                       | `res.send("Hello")`          |
| `res.json()`        | Send JSON                                       | `res.json({name:"Abiha"})`   |
| `res.status()`      | Set HTTP status code                            | `res.status(404)`            |
| `res.sendStatus()`  | Send only a status code and its default message | `res.sendStatus(404)`        |
| `res.redirect()`    | Redirect to another route                       | `res.redirect("/login")`     |
| `res.cookie()`      | Create a cookie                                 | `res.cookie("token","abc")`  |
| `res.clearCookie()` | Delete a cookie                                 | `res.clearCookie("token")`   |
| `res.set()`         | Set response headers                            | `res.set("Author","Abiha")`  |
| `res.download()`    | Download a file                                 | `res.download("resume.pdf")` |
| `res.sendFile()`    | Send a file                                     | `res.sendFile(...)`          |
| `res.end()`         | End the response                                | `res.end()`                  |

## One best practice for REST APIs

Instead of returning only a string like this:

```js
res.send("User updated successfully");
```

Most production APIs return structured JSON:

```js
res.status(200).json({
    success: true,
    message: "User updated successfully"
});
```

Or, if you want to return the updated document:

```js
const updatedUser = await User.findByIdAndUpdate(
    userId,
    data,
    { new: true, runValidators: true }
);

res.status(200).json({
    success: true,
    data: updatedUser
});
```

This format is easier for frontend applications to work with because they can reliably access properties like `success`, `message`, and `data`.

