---
name: Populate SQL Database with CSV 🏒
thumbnail: baseball-drip-pink.png
date: 2022-01-02
description: Populate SQL database with some values from a CSV file.
tags: ["sql"]
---


This post demonstrates how to populate our database with some values from a CSV file.

Before we get started we’re going to need some things installed: PostgreSQL and Node. Then we will need to create a database. If you are a Mac user I’d recommend installing PostgreSQL through Homebrew.

I will link to the docs to the major players of this article but I’m not going to go through any of the setup. So, if you don’t have your terminal opened up already let’s do so and dig in. If you installed postgresql through homebrew you can use:



```js
brew services start postgresql

brew services stop postgresql or postgres
```


Connect to PostgreSQL:



```js
psql postgres
```



Create a database:



```js
createdb mydbname  
```


Then connect to your database with:



```js
\c mydbname
```


Next we need to populate fields we created and to do so we need data. And we need to see what sort of fields we are going to need inside our table so the values matchup:

For this, I’m using Fantasy Hockey Projections from Fantasy Pros: https://www.fantasypros.com/nhl/rankings/overall.php



```js
CREATE TABLE hockey_players_adp (
    rank INTEGER NOT NULL,
    player VARCHAR(30) NULL,
    best INTEGER NULL,
    worst INTEGER NULL,
    average DECIMAL NULL,
    std_dev DECIMAL NULL,
    adp INTEGER NULL,
    vs_adp INTEGER NULL
)

```



Once there, click the download icon near the top right corner to get the csv file. You will likely need to open and edit the end of the file, for when I first attempted this there were some extra quotations at the end that caused errors when inserting the file into postgres; maybe you’ll have better luck then me. Once that’s done return to the terminal where postgres is running and add the following line. Note: be sure the path to the file is the relative one from where you are at currently in the directory.



```js
\copy hockey_players_adp FROM '../../Downloads/hockey_players_file.csv' CSV HEADER DELIMITER ',';

```


If successful it should read something along the lines of: "COPY 387" or however many rows were added. We only used a few of the most common values in SQL but you can go through the documentation and see all the others available on your own.

Thanks for reading and happy coding!

🥅 


https://nodejs.org/en/download/

https://www.postgresql.org/