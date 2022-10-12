---
name: Nuxt 3 Full-Stack Guide 🏈
thumbnail: /assets/rosterbox.png
date: 2022-03-28
description: How to develop Full-Stack Nuxt 3 apps with Prisma
tags: ["vue", "nuxt", "prisma"]
---

# Nuxt 3 Full-Stack Guide

🚨 This tutorial is a work in progress and only the server-side authentication portion using Prisma is completed 🚨

*This guide aims to chronical a number of useful methods for developing Nuxt 3 applications and to be helpful to new and experienced Nuxt devs alike.*

Nuxt 3 is still quite new and at the time of this writing is still in open beta, much like anything new, there can be some learning curves and resources can be lacking; and when quality resources are found they usually only discuss trivial topics many developers may find vapid. I love Nuxt.js and the community is one of the best things about it and this is not a knock on the framework whatsoever. And, of course, there's a need for simple tutorials, but most developer/framework communities are saturated with them and it promotes tutorial hell and it's easy to get stuck there when new developers are introduced to a new framework or are just starting out. And it is my belief that there should be more "advanced" resources out there for mid-to-senior level developers. This guide looks to remedy that.

Ultimately, this series of tutorials will lead to a full-stack ice hockey stats and "social networking" application. You aren't expected to be a fan of ice hockey -- or a sports fan in general) -- for the concepts covered can be applied to any project using a third-party API. The idea for putting this guide together was not so much to follow along, line by line -- though you obviously can -- but the aim is to deviate from the typical tutorial and to be more of a reference for developers of all levels.


The main subjects this guide covers:

- Nuxt 3 + Prisma + TypeScript 
- DigitalOcean Postgres Database
- Authentication 
- Third-party API data integration
- Multiple API Calls with Promises 
- Composables 
- Likes
- Comments 
- Charts 


Since we're covering a number of more advanced topics, naturally, it will be on the longer side, so it will not dive too deep into the installation of dependencies or how to start a project. There's countless starter repos on github and gitlab you can clone or reference for that. Moreover, how to add UI libraries, such as tailwindcss, has been pretty well documented.


## Database setup with DigitalOcean

Before creating the project have a database up and running. Feel free to skip this section if you just want to run a local database or are using MySQL, SQLite or non-relational database like MongoDB.

I'm using a Postgres DB through a DigitalOcean Droplet, so keep in mind when writing the Prisma schema there may be a few values that will be slightly different than what is required in Postgres.

If you are following along with DigitalOcean, create an account and '+ New Project' in the left sidebar. 

![Digital Ocean - Step One](/assets/digital-ocean-1.png)

You should be prompted to a new project page where you can select 'Get started with a Droplet'. Once the new database is created you will be able to grab the connection string from the project page and paste it into your *.env* file.

```
// .env

DATABASE_URL="postgresql://doadmin:XXXX_xxxxxxxx@xxxx-xx-xxx-12345-0.b.db.ondigitalocean.com:25060/defaultdb?sslmode=require"

```

The *DATABASE_URL* variable will be referenced once the Prisma schema is created. 



## Create Nuxt 3 app and install dependencies:

Instead of installing everything altogher and just throwing everything at you at one time, I will do my best to try and break it up by relevancy and group installs by category, keeping UI dependencies together, auth dependencies together, Prisma, etc.


```
npx nuxi init nuxt3-app 

$ npm i @nuxtjs/tailwindcss -D

$ npm i @types/bcrypt @types/uuid -D

$ npm i @vueuse/core preline bcrypt uuid 

```

Inside nuxt.config.ts add the required modules and also tailwindcss to the content object:

```
modules: ['@nuxtjs/tailwindcss'],
content:{
    tailwindcss: {
    cssPath: '~/assets/css/main.css',
  },
}

```

Then, in the root directory, create a __main.css__ file within __/assets/css/__. Of course, include any font you prefer.

```
// assets/css/main.css

@import url('https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@1,800,500,100,700,400,300,200,900&f[]=satoshi@1,900,700,500,301,701,300,501,401,901,400,2&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

```

###  TypeScript 

Let's quickly jump to defining the types relating to users and authentication first. From the root directory, create a __types__ folder and add the following TypeScript files:

##### IUser.ts 

```
// types/IUser.ts

export interface IUser {
    id?: number
    username: string
    name?: string
    loginType?: string
    password?: string
    email?: string
    avatarUrl?: string
}

```

##### IRegistration.ts

```
// types/IRegistration.ts

export type IRegistrationErrors = {
    hasErrors?: string
}

export type RegistrationResponse = {
    hasErrors: boolean,
    errors?: IRegistrationErrors
}

export type RegistrationRequest = {
    name: string
    username?: string
    email?: string
    password?: string
}

```

##### ISession.ts 

```
import { IUser } from "./IUser"

export interface ISession {
    authToken?: string 
    user?: IUser
    userId?: number 
}

```

##### InputValidation.ts

```
type InputValidation = {
    key: string
    isBlank: boolean
    lenghtMin8: boolean
    hasError: boolean
    value: string
    emailTaken?: boolean
    usernameTaken?: boolean
    errorMessage?: string
}

```

##### FormValidation.ts

```
type FormValidation = {
    hasErrors: boolean
    errors?: Map<string, { check: InputValidation; }>
}

type FormErrors = {
    field: string
    check: InputValidation
}

```

We will circle back to types after user authentication is in order.


## Server and Prisma

#### Install Prisma dependencies

```
$ npm i prisma -D // install prisma

$ npx prisma // displays available prisma commands

$ npm i @prisma/client 

$ npx prisma init 

// Other notable commands while using Prisma 

$ npx prisma db push 

$ npx prisma migrate dev --name init 

$ npx prisma migrate deploy 

$ npx prisma migrate dev

```

## Part I: Authentication

For authentication, Full Stack Jack on Youtube has an ideal approach on how to setup a solid auth system with Prisma and Nuxt 3 while utilizing composables. You can find that here: https://www.youtube.com/watch?v=A24aKCQ-rf4&t=1586s with the link to his repo: https://github.com/jurassicjs/nuxt3-fullstack-tutorial 

This guide follows a very similar approach to the way so, similar to starting a project, this guide is not going to dive too deep into the whys and hows of authentication as most of the code pertaining to auth is primarily taken from the aforementioned, Full Stack Jack, and there's no need to steal his thunder for the work he put into his project and -- perhaps more importantly -- the thoughtfulness of sharing his code with the world.

With that said, there is a lot to cover and to make it easier for the reader, I will add everything within the project here in this article and explain some of the key concepts in hopes of preventing the need of tab and code hoping back and forth in order to make the learning process seamless as possible.


### Prisma Schema

When running ```$ npx prisma init ``` a schema file will be created. The schema will be generated within the root of the project, but for this tutorial it will reside inside __server/database/__. 

```

// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id               Int            @id @default(autoincrement())
  loginType        String?        @default("email")
  password         String?
  email            String?        @unique
  name             String?
  username         String?        @unique
  session          Session[]
  comment          Comment[]
}

model Session {
  id        Int       @id @default(autoincrement())
  authToken String    @unique
  user      User      @relation(fields: [userId], references: [id])
  userId    Int
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  deletedAt DateTime?
}

model Like {
  id       Int @id @default(autoincrement())
  userId   Int
  playerId Int
}

model Comment {
  id        Int      @id @default(autoincrement())
  user      User     @relation(fields: [userId], references: [id])
  userId    Int
  playerId  Int
  comment   String
  createdAt DateTime @default(now()) @db.Timestamptz(3)
}



```


In order for Nuxt to know how to communicate with Prisma -- with the current server folder structure in place -- a slight change is required within __package.json__ as it's own value outside of "devDependencies" and "dependencies".

```
...
"prisma": {
    "schema": "server/database/schema.prisma"
  }

```


## Back-end Project Server Structure

From the root directory, create a __server__ folder. And within the __server__ folder, create an __api__, __database__ and __services__ folder.


Starting inside the __database__ directory, create a file: __client.ts__ and include the following code, a snippet that will initialize the Prisma Client.

```
// server/database/client.ts

import pkg from "@prisma/client";

const { PrismaClient } = pkg;
const prisma = new PrismaClient()
export default prisma

```


Next, create a __repositories__ folder inside the __database__ directory and add __sessionRepository.ts__ and __userRepository.ts__.


#### sessionRepository.ts 

Looking over at the schema, there's a userId (Int) and authToken (string) value witin the *Session* model. Below these two values are referenced inside the data object of the __createSession__ method where *async await* is used to create a user session. You'll notice two other methods in this file, __getUserByAuthToken__ and __getSessionByAuthToken__ both of which pass a *authToken* string parameter; both functions do similar things, but the logic doesn't have to be re-written twice. When reading the __where__ clause inside __getUserByAuthToken__ a built-in Prisma method __findUnique__ is used to locate each user while logged into the application via bcrypt and uuid libraries. Then __getUserByAuthToken__ can be passed to __getSessionByAuthToken__ by creating a *user* variable and then return both ```authToken``` and ```user```. This is possible since *User* is passed to the Session model of the schema via a *@relation* as well as the fact *Session[]* is included with the *User* model. The ability to create connections like these is what makes working Prisma and Nuxt 3 so cool.

```

import { IUser } from "~~/types/IUser";
import { ISession } from '~~/types/ISession';
import prisma from "../client";

export async function createSession(data: ISession): Promise<ISession> {
    return await prisma.session.create({
        data: {
            userId: data.userId,
            authToken: data.authToken
        }
    })
}

export async function getSessionByAuthToken(authToken: string): Promise<ISession> {
    const user: IUser = await getUserByAuthToken(authToken) as unknown as IUser

    return { authToken, user }
}

async function getUserByAuthToken(authToken: string): Promise<IUser> {
    return prisma.session.findUnique({
        where: {
            authToken: authToken
        }
    }).user()
}

```

#### userRepository.ts 

Something similar can be found with __userRepository__ and both the *findUnique* and *create* Prisma methods are used to keep track of when individuals are created by registering (__createUser__), logging in (__getUserByEmailWithPass__), and when they form some other action while using the application (__getUserById__).

With the __createUser__ function, the data object holds all the values associated with a user, which were made back in the *User* schema. Naturally, there is: username, name, email and password; there's also a *loginType*, which is set to *email* in the schema. You will find more _where_ and _select_ clauses here; _where_ takes the param that's passed into the original function and calls it, _select_ grabs other values the app will need.

```

import prisma from "../client";
import { IUser } from '~/types/IUser';

export async function getUserByEmailWithPass(email: string): Promise<IUser> {
  return await prisma.user.findUnique({
    where: {
      email: email,
    },
    select: {
      id: true,
      username: true,
      password: true
    }
  })
}

export async function getUserByUserName(username: string): Promise<IUser> {
  return await prisma.user.findUnique({
    where: {
      username: username,
    },
    select: {
      id: true,
      username: true,
    },
  })
}

export async function createUser(data: IUser) {
  const user = await prisma.user.create({
    data: {
      username: data.username,
      name: data.name,
      email: data.email,
      loginType: data.loginType,
      password: data.password,
    },
  })

  return user
}

export async function getUserById(id: number): Promise<IUser> {
  return await prisma.user.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      username: true,
      email: true,
    },
  })
}

```

## Services 

Moving to the __services__ directory, create __userService.ts__, __sessionService.ts__ and __validator.ts__.

#### validator.ts

Validation is a nice-to-have addition for people using the application, so when implementing authentication it's a good practice if there are restrictions while interacting in the browser; checking length of passwords, using regular expressions, and insuring no 2 individuals have the exact same password are all examples of things that could and should be accounted for.

```
import { RegistrationRequest } from '~~/types/IRegistration';
import { getUserByEmail, getUserByUserName } from '~/server/database/repositories/userRepository'


export async function validate(data: RegistrationRequest) {

 const errors = new Map<string, { check: InputValidation }>()

 for (const [key, value] of Object.entries(data)) {
  let val = await runChecks(key, value)

  if (val.hasError) {
   errors.set(key, { 'check': val })
  }
 }

 return errors
}

async function runChecks(key: string, value: string): Promise<InputValidation> {
 const check: InputValidation = {
  value,
  isBlank: false,
  lenghtMin8: true,
  key,
  hasError: false
 }

 if (value == '' || value == null) {
  check.isBlank = true
  check.hasError = true
  check.errorMessage = `${key} is required`
  return check
 }

 if (key == 'password') {
  if (value.length < 8) {
   check.hasError = true
   check.errorMessage = `password must be at least 8 characters`
  }
  check.lenghtMin8 = false
 }

 if (key == 'email') {

  const isValidEmail = validateEmail(value)

  if (!isValidEmail) {
   check.emailTaken = true
   check.hasError = true
   check.errorMessage = `${value}, is not a valid email!`
   return check
  }

  const email = await getUserByEmail(value)
  if (email) {
   check.emailTaken = true
   check.hasError = true
   check.errorMessage = `This email, ${value}, is already registered!`
  }
 }

 if (key == 'username') {
  const username = await getUserByUserName(value)
  if (username) {
   check.usernameTaken = true
   check.hasError = true
   check.errorMessage = `The username, ${value}, is already registered!`
  }
 }

 return check
}

function validateEmail(input: string): boolean {
 const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

 if (!input.match(validRegex)) {
  return false;
 }

 return true
}

```

#### userService.ts

Earlier, in our types folder, both __InputValidation.ts__ and __FormValidation.ts__ files were created so now we need to pass the *FormValidation* type to check if all required data is passed inside the respective form(s) correctly while using the app.

The __sanitizeUserForFrontend__ method hides any of the user state values so they aren’t exposed client-side; this will be called within __sessionService.ts__ as well as in __/server/api/auth/__ which will be discussed shortly.

```
import { IUser } from "~~/types/IUser";
import { RegistrationRequest } from "~~/types/IRegistration";
import { validate } from '~~/server/services/validator'

export async function validateUser(data: RegistrationRequest): Promise<FormValidation> {
    const errors = await validate(data)

    if (errors.size > 0) {
        return { hasErrors: true, errors }
    }

    return { hasErrors: false }
}

export function sanitizeUserForFrontend(user: IUser | undefined): IUser {
    if (!user) {
        return user
    }

    delete user.password
    delete user.loginType 

    return user 
}
```


#### sessionService.ts

The Session Service takes in the _createSession_ and _getSessionByAuthToken_ written earlier in *sessionRepository.ts* and also uses the uuid library to help manage authentication token via cookies when each user session begins and ends. The path needs to be set to root so it’s accessible throughout the application and httpOnly so the cookie cannot be manipulated client-side.

Nuxt is packaged with _h3_, a utility framework, which provides methods for better code readibility. Here's a link to the npm package: https://www.npmjs.com/package/h3. If you've never seen or heard of it before it may be useful to skim through the docs as the purposes of some of the methods referenced in the code below might not be crystal clear every instance they are present in the code.


```
import { sanitizeUserForFrontend } from '~~/server/services/userService';
import { CompatibilityEvent } from "h3"
import { createSession, getSessionByAuthToken } from "~~/server/database/repositories/sessionRepository"
import { IUser } from "~~/types/IUser"
import { v4 as uuidv4 } from 'uuid'


export async function makeSession(user: IUser, event: CompatibilityEvent): Promise<IUser> {
    const authToken = uuidv4().replaceAll('-', '')
    const session = await createSession({ authToken, userId: user.id })
    const userId = session.userId

    if (userId) {
        setCookie(event, 'auth_token', authToken, { path: '/', httpOnly: true })
        return getUserBySessionToken(authToken)
    }

    throw Error('Error Creating Session')
}

export async function getUserBySessionToken(authToken: string): Promise<IUser> {
    const session = await getSessionByAuthToken(authToken)

    return sanitizeUserForFrontend(session.user)
}

```


### Server Routes: API Authentication

For Nuxt 3, all the API calls will live inside the /server/api directory via TypeScript. The exported defineEventHandler will be used to hold the server-side logic and is called when a specific route is hit. 

A beautiful thing about Nuxt is once any server-side route is in place, it will be automatically imported and conveniently called in *.vue* files with _useFetch_ or _useAsyncData_, which are juiced-up wrappers of the $fetch methods. Another thing to note is we can capture query params with another useful Nuxt method called useQuery. Moreover, we can view the body of the request with another composable via Nuxt and h3: _useBody_.

Let's move to the _api_ directory mentioned earlier and create a folder called _auth_ and add a few files inside, including: *getByAuthToken.ts*, *login.ts*, *logout.ts* and *register.ts*. 
The folder structure should be _/server/api/auth/getByAuthToken.ts_, etc.

Starting with *getByAuthToken.ts* we will begin to take the auth functions created in the services folder and create an API so they can then later be applied to the front-end.

##### getByAuthToken.ts 

```
import { IUser } from '~/types/IUser';
import { useCookie } from 'h3'
import { getUserBySessionToken } from '~~/server/services/sessionService'

export default defineEventHandler<IUser>(async (event) => {
    const authToken = useCookie(event.req, 'auth_token')
    const user = await getUserBySessionToken(authToken)

    return user
})

```

Above, we are using the _getUserBySession_ function that was recently created in *sessionService.ts* -- which is just taking a authToken string from the Prisma schema and assigning it to a user -- so this new function can be used to create a user session.


##### register.ts 

Applications with users usually come with a register functionality and this one is no different. The register file contains the user data to sign up for the app. You will notice a number of variables that are being used to pass previously created methods to. This file passes in the user values accessed in the body, checks if a user exists and submits a new user to the database. The session will be linked to a user and the user is associated with an auth_token and anytime in the browser when a user is logged into a session, a cookie will be sent from the client to the server to verify the user is valid. 

Note: The _bcrypt_ package provides password encryption so passwords cannot be read from malicious hackers.

```
import { CompatibilityEvent, sendError } from 'h3'
import bcrypt from 'bcrypt'
import { IUser } from '~/types/IUser';
import { validateUser } from '~/server/services/userService';
import { createUser } from '~/server/database/repositories/userRepository';
import { makeSession } from '~~/server/services/sessionService';
import { RegistrationRequest } from '~~/types/IRegistration';

export default async (event: CompatibilityEvent) => {
    const body = await useBody(event)
    const data = body.data as RegistrationRequest

    const validation = await validateUser(data)

    if (validation.hasErrors === true) {
        const errors = JSON.stringify(Object.fromEntries(validation.errors))
        return sendError(event, createError({ statusCode: 422, data: errors }))
    }

    const encryptedPassword: string = await bcrypt.hash(data.password, 10)

    const userData: IUser = {
        username: data.username,
        name: data.name,
        email: data.email,
        loginType: 'email',
        password: encryptedPassword
    }

    const user = await createUser(userData)

    return await makeSession(user, event)
}

```










========= FRONT END ==========

### Composables

### composables/useAuth.ts

Inside __/composables/useAuth.ts__ the user state is set with useState and if both a cookie value is present and no user value exists then we make an API call to set the header.

A fetch POST request is also made with the help from the code written in the register.ts api file and then an object holding the username, name, email and password values is returned from the body. If the returned result is as expected and without errors, a useState user value is accepted and is directed to a new route via useRouter().


## Front-End Setup

Create a __middleware__ folder in the root directory with both a __auth.ts__ and __guest.ts__ file.


##### auth.ts

```
import { defineNuxtRouteMiddleware } from "#app";
import { useUser } from "~/composables/useAuth";

export default defineNuxtRouteMiddleware(async (to) => {
    const user = await useUser()

    if (user == null && user == undefined) {
        return '/'
    }
})

```

##### guest.ts

```
import { defineNuxtRouteMiddleware } from "#app";
import { useUser } from "~/composables/useAuth";

export default defineNuxtRouteMiddleware(async (to) => {
    const user = await useUser()

    if (user !== null && user !== undefined) {
        return '/'
    }
})
```




#### useNuxtApp 

In __app.vue__, the implementation of useNuxtApp forces a scroll to the top of the page on navigation to any page. Referencing: https://v3.nuxtjs.org/api/composables/use-nuxt-app/ 




### User.vue

The state of the user is passed to a *user* variable. 








## Preline and TailwindCSS





## External Methods

In the root of the project create a javascript file; the one I'm using is titled: __methods.js__ 

This particular method will utilize a switch statement to read the names of players or teams from the API and pair said player or team with whichever image we we want to display throughout the application.

With Nuxt, images can be read in the __/public__ folder. Within that directory I created a folder called __img__ where all images can live. Nuxt will automatically read __public__ so all that's required is */img/name-of-asset.png*.

```
// methods.js 

export default function matchPlayerImage(player) {
        switch (player) {
            case "Auston Matthews":
                return "/img/Auston_Matthews.svg";
                break;
            case "Mitch Marner":
                return "/img/Mitch_Marner.svg";
                break;
            case "Erik Karlsson":
                return "/img/karlsson.png";
                break;
            default:
                return "/img/Skates-Retro-Pink-2.svg";
        }
    }

```

Next, navigate to the components folder and visit.



## Chart.js + Nuxt 3

```
$ npm i vue-chartjs chart.js 

```

Also must add __build__ to the content object in nuxt.config.ts:

```
build: {
    transpile: ['chart.js']
  }

```

Reference: https://vue-chartjs.org/guide/#using-with-nuxt  

======================= 