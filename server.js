/*
  You should not need to modify this file at all,
  although I'm sure there are ways to improve this!

  No need to know what's going on here. There are some
  sparse comments here and there if you're curious.
*/

// Express is a backend Node framework
const express = require("express");
const { knex } = require("./knexfile");

/*
  path is one of Node's global objects (we call them modules in Node)
  No need to stress, but if you want to read more about it:
    https://nodejs.org/api/path.html
  */
// const path = require("path");

// We are initializing express here
const app = express();
app.use(express.json());

// Create a port
const port = process.env.PORT || 3000; // in order to connect=> nodemon server.js

// Have it serve up the index.html file
app.use(express.static("src"));

// The PORT that our server sits on
app.listen(port, function () {
  console.log("Sorting app listening on " + port + "!");
});

app.delete("/api/delete/:memberName", async function (req, res) {
  const name = req.params.memberName;
  let nameExists = true;
  await knex("members")
    .select()
    .where("first_name", "=", name)
    .then((arr) => {
      if (arr.length === 0) {
        nameExists = false;
        return res.send("Already does not exist");
      }
    });
  if (nameExists) {
    await knex("favorites")
      .where(
        "favorites.member_id",
        "=",
        await knex("members")
          .select("members.id")
          .where("members.first_name", "=", name)
          .then((obj) => {
            return obj[0].id;
          })
      )
      .del();
    await knex("members").where("members.first_name", "=", name).del();
    return res.send("Deleted!");
  }
});
app.patch("/api/patch/:memberName", async function (req, res) {
  const name = req.params.memberName;
  const unlike = req.body[0]; // 'TOYOTA'
  let nameExists = true;
  await knex("members")
    .select()
    .where("first_name", "=", name)
    .then((arr) => {
      if (arr.length === 0) {
        nameExists = false;
        return res.send("Name does not exist");
      }
    });
  if (nameExists) {
    await knex("favorites")
      .where(
        "favorites.member_id",
        "=",
        await knex("members")
          .select("members.id")
          .where("members.first_name", "=", name)
          .then((obj) => {
            return obj[0].id;
          })
      )
      .andWhere("favorites.favorite", "=", unlike)
      .del();

    return res.send(`unlike ${unlike}!`);
  }
});

app.get("/api/get/:memberName", function (req, res) {
  const name = req.params.memberName;
  knex("favorites")
    .join("members", "favorites.member_id", "=", "members.id")
    .select("favorites.favorite")
    .where("members.first_name", "=", name)
    .then((arr) => {
      if (arr.length === 0) {
        return res.send("Not found");
      }
      const favoritesArray = arr.map((obj) => obj.favorite);
      return res.send(favoritesArray);
    });
});

app.post("/api/post/:name", async function (req, res) {
  const name = req.params.name; // => Nara
  const favorites = req.body; // => [TOYOTA,NISSAN,SUBARU]
  let nameExists = false;
  let memberId;
  const error = []; // just stored here ant not returned to the app
  await knex("members")
    .select("members.id", "members.first_name")
    .where("members.first_name", "=", name)
    .then(async function (arr) {
      if (arr.length > 0) {
        nameExists = true;
        memberId = arr[0].id;
      } else {
        await knex("members").insert({ first_name: name }); // here works!
        nameExists = true;
        await knex("members")
          .select("id")
          .where("first_name", "=", name)
          .then((arr) => {
            memberId = arr[0].id;
          });
      }
    });
  if (nameExists) {
    for (const favoriteThing of favorites) {
      await knex("favorites")
        .insert({ member_id: memberId, favorite: favoriteThing })
        .catch((err) => {
          error.push(err.message); // just stored here ant not returned to the app
        });
    }
  }
  await knex("favorites")
    .join("members", "favorites.member_id", "=", "members.id")
    .select("favorites.favorite")
    .where("members.first_name", name)
    .then((arr) => {
      const favoritesArray = arr.map((obj) => obj.favorite);
      return res.send(favoritesArray);
    });
});
