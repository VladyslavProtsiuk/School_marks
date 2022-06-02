require("dotenv").config();
const fs = require("fs"),
     express = require("express"),
     express_fileupload = require("express-fileupload"),
     cookieParser = require("cookie-parser"),
     bodyParser = require("body-parser"),
     app = express(),
     handlebars = require("express-handlebars"),
     mongodb = require("mongodb"),
     url = process.env.url,
     ObjectId = mongodb.ObjectId,
     mongoClient = new mongodb.MongoClient(url),
     http = require('http').Server(app),
     {
          Server
     } = require("socket.io"),
     io = new Server(http);


let secret_code = process.env.secret_code;

io.on('connection', (socket) => {
     console.log('a user connected');
     socket.on('chat message', (msg) => {
          console.log('message: ' + msg.message);
          io.emit('chat message', msg);
     });
});

app.use(express_fileupload());
app.set("view engine", "hbs");
app.use(express.static(__dirname + "/views"));
app.use(bodyParser.json());
app.engine(
     "hbs",
     handlebars.engine({
          layoutsDir: "views/layouts",
          extname: "hbs",
     })
);
app.use(
     bodyParser.urlencoded({
          extended: false,
     })
);
app.use(cookieParser(secret_code));


async function check_cookie(request, response) {
     await mongoClient.connect();
     const db = await mongoClient.db("users"),
          collection = await db.collection("users_info");
     if (request.cookies.user_id != undefined) {
          let reque = await new ObjectId(request.cookies.user_id),
               result = await collection.find({
                    _id: reque
               }).toArray()
          if (Object.keys(result[0]).length != 0) {
               if (result[0].last_login == +request.cookies.time) {
                    return result[0].permission
               } else {
                    await response.render("layouts/access_denied", {
                         layout: "access_denied"
                    })
                    return false
               }
          } else {
               await response.render("layouts/access_denied", {
                    layout: "access_denied"
               })
               return false
          }
     } else {
          await response.render("layouts/access_denied", {
               layout: "access_denied"
          })
          return false
     }
}

app.get("/api/:number/:num", async function (req, res) {
     let param = +req.params.number,
          permission = await check_cookie(req, res);
     await mongoClient.connect();
     const db = await mongoClient.db("users"),
          collection1 = await db.collection("users_info"),
          collection2 = await db.collection("groups");
     if (permission) {
          let previous_step = await collection2.find({
               name: req.params.num
          }).toArray();
          switch (param) {
               case 1:
                    let students = await [],
                         request
                    if (previous_step[0].students != undefined) {
                         for (let i = 0; i < previous_step[0].students.length; i++) {
                              request = await new ObjectId(previous_step[0].students[i])
                              await students.push(await collection1.find({
                                   _id: request
                              }).toArray())
                         }
                         for (let i = 0; i < students.length; i++) {
                              students[i] = await students[i][0]
                         }

                         for (let t = 0; t < students.length; t++) {
                              delete students[t]._id;
                              delete students[t].username;
                              delete students[t].password;
                              delete students[t].last_login;
                         }

                         students = await JSON.stringify(students)
                         await res.send(students)
                    } else {
                         await res.send("No students")
                    }

                    break;

               case 2:
                    delete previous_step[0]._id;
                    delete previous_step[0].students;
                    await res.send(previous_step[0])
                    break;
               case 3:
                    if (permission == "teacher") {
                         let results = await collection2.find().toArray();
                         await res.send(results)
                    } else {
                         await res.sendStatus(403)
                    }
                    break
          }
     }
})

app.post("/teacher/add_group", async function (req, res) {
     let permission = await check_cookie(req, res)
     switch (permission) {
          case "student":
               await res.sendStatus(403);
               break;
          case "teacher":
               await mongoClient.connect()
               const db = await mongoClient.db("users"),
                    collection = await db.collection("groups");
               await collection.insertOne(req.body);;

               break;
     }
});

app.post("/add_user_to_group", async function (req, res) {
     let permission = await check_cookie(req, res)
     switch (permission) {
          case "student":
               await res.sendStatus(403)
               break;
          case "teacher":
               await mongoClient.connect()
               const db = await mongoClient.db("users"),
                    collection = await db.collection("users_info"),
                    another_collection = await db.collection("groups");
               let image = await req.files.user_file,
                    filename = await image.name,
                    marks = await [
                         [],
                         [],
                         [],
                         [],
                         [],
                         [],
                         [],
                         [],
                         [],
                         [],
                         [],
                         []
                    ],
                    user = await {
                         username: req.body.user_login,
                         password: req.body.user_passwd,
                         permission: "student",
                         first_name: req.body.user_name,
                         second_name: req.body.user_surname,
                         date: req.body.user_date,
                         telegram: req.body.user_telegram,
                         email: req.body.user_email,
                         number: req.body.user_number,
                         avatar: "./uploads/" + filename,
                         marks: marks
                    },
                    [first_results] = await collection.find({
                         username: req.body.user_login,
                    }).toArray(),
                    id = first_results._id.toString(),
                    [results] = await another_collection
                    .find({
                         name: req.body.user_group,
                    })
                    .toArray();
               await image.mv("./uploads/" + filename)
               await collection.insertOne(user);
               await results.students.push(id)
               await another_collection.updateOne({
                    name: req.body.user_group,
               }, {
                    $set: {
                         students: results.students
                    }
               });
               await res.redirect("http://localhost:3000/dairy/" + results.name)
               break;
     }
})

app.post("/update_marks/", async function (req, res) {
     let permission = await check_cookie(req, res)
     switch (permission) {
          case "student":
               await res.sendStatus(403)
               break;
          case "teacher":
               await mongoClient.connect()
               const db = await mongoClient.db("users"),
                    collection = await db.collection("users_info");
               let that_i_need, result
               for (let i = 0; i < req.body.length; i++) {
                    result = await collection.find({
                         first_name: req.body[i].first_name,
                         second_name: req.body[i].second_name
                    }).toArray()
                    that_i_need = await result[0].marks
                    if (that_i_need[req.body[i].month][req.body[i].number] == undefined) {
                         while (that_i_need[req.body[i].month][req.body[i].number] == undefined) {
                              await that_i_need[req.body[i].month].push(["", ""])
                         }
                    }

                    that_i_need[req.body[i].month][req.body[i].number][req.body[i].lesson] = await req.body[i].mark

                    await collection.updateOne({
                         first_name: req.body[i].first_name,
                         second_name: req.body[i].second_name
                    }, {
                         $set: {
                              marks: that_i_need
                         }
                    })
               }
               break;
     }

})

app.post("/logination/", async function (req, res) {
     console.log(req.body)
     await mongoClient.connect();
     const db = await mongoClient.db("users"),
          collection = await db.collection("users_info"),
          another_collection = await db.collection("groups");
     let results = await collection
          .find({
               username: req.body.login,
          })
          .toArray(),
          another_res = await another_collection.find({
               students: results[0]._id.toString()
          }).toArray();

     if (results.length != 0) {
          if (results[0].password == req.body.password) {
               let date = Date.now(),
                    last_login = await collection.find({
                         _id: results[0]._id
                    }).toArray()

               await collection.updateOne({
                    _id: results[0]._id
               }, {
                    $set: {
                         last_login: date
                    }
               })
               if (req.body.notforget == true) {
                    await res.cookie("user_id", results[0]._id.toString(), {
                         maxAge: 345600
                    })
                    await res.cookie("time", date, {
                         maxAge: 345600
                    })
               } else {
                    await res.cookie("user_id", results[0]._id.toString())
                    await res.cookie("time", date)
               }


               if (results[0].permission == "teacher") {
                    res.send({
                         error: "",
                         do: `window.location.href = "http://localhost:3000/teacher"`,
                    });
               }
               if (results[0].permission == "student") {
                    res.send({
                         error: "",
                         do: `window.location.href = "http://localhost:3000/dairy/` + another_res[0].name + `"`,
                    });
               }
          } else {
               res.send({
                    error: "Password is irregular",
                    do: "",
               });
          }
     } else {
          res.send({
               error: "You need to be SHKM student",
               do: "",
          });
     }
});

app.get("/dairy/:num", async function (req, res) {
     let permission = await check_cookie(req, res)
     switch (permission) {
          case "student":
               await res.render("layouts/dairy", {
                    layout: "dairy",
                    show_teacher_panel: false
               });
               break;
          case "teacher":
               await res.render("layouts/dairy", {
                    layout: "dairy",
                    show_teacher_panel: true
               });
               break;
     }

})

app.get("/teacher/", async function (req, res) {
     let permission = await check_cookie(req, res)
     switch (permission) {
          case "student":
               await res.render("layouts/access_denied", {
                    layout: "access_denied",
               });
               break;
          case "teacher":
               await res.render("layouts/teacher_client", {
                    layout: "teacher_client",
               });

               break;
     }
});

app.get("/chat", async function (req, res) {
     if (await check_cookie(req, res)) {
          await res.render("layouts/chat", {
               layout: "chat"
          })
     }
})

app.get("/", function (req, res) {
     res.render("layouts/index", {
          layout: "index",
     });
});

app.use(function (req, res) {
     res.render("layouts/404", {
          layout: "404",
     });
})

http.listen(3000, function () {
     console.clear()
     console.log("Server started on http://localhost:3000/");
});