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
     fsPromises = fs.promises,
     ObjectId = mongodb.ObjectId,
     mongoClient = new mongodb.MongoClient(url),
     http = require('http').Server(app),
     {
          Server
     } = require("socket.io"),
     io = new Server(http, {
          maxHttpBufferSize: 10485760
     })

let secret_code = process.env.secret_code;

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

app.locals.stop_link_lessons = true;
app.locals.stop_link_chat = true;
app.locals.stop_link_feedbacks = true;

async function check_file_sytem() {
     let not_to_return = await [],
          to_return

     not_to_return = await fsPromises.readdir("./views/uploads/")
     for (let i = 0; i < not_to_return.length; i++) {
          not_to_return[i] = await +not_to_return[i].slice(0, not_to_return[i].indexOf("."))
     }
     await not_to_return.sort(function (a, b) {
          return a - b;
     })
     to_return = await not_to_return[not_to_return.length - 1] + 1
     return to_return
}

async function get_group(user_id) {
     await mongoClient.connect();
     const db = await mongoClient.db("users"),
          collection = await db.collection("groups");
     let [result] = await collection.find({
          students: user_id
     }).toArray()

     return await result.name
}

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

io.on('connection', (socket) => {
     socket.on('chat message', async (msg) => {
          await io.emit('chat message', msg);
          await mongoClient.connect();
          const db = await mongoClient.db("users"),
               collection = await db.collection("chats");
          let request = new ObjectId(msg.chat_id)
          let result = await collection.find({
               _id: request
          }).toArray()

          let message_array = result[0].messages

          message_array.push({
               message: msg.message,
               time_for_msg: msg.time_for_msg,
               time: msg.time
          })

          if (msg.files != [] && msg.files != undefined) {
               let files_array = []
               for (let y = 0; y < msg.files.length; y++) {
                    let last_file = await check_file_sytem(),
                         full_name;
                    switch (await last_file.toString().length) {
                         case 1:
                              full_name = await "00000" + last_file + "." + msg.files[y].filetype
                              break;
                         case 2:
                              full_name = await "0000" + last_file + "." + msg.files[y].filetype
                              break;
                         case 3:
                              full_name = await "000" + last_file + "." + msg.files[y].filetype
                              break;
                         case 4:
                              full_name = await "00" + last_file + "." + msg.files[y].filetype
                              break;
                         case 5:
                              full_name = await "0" + last_file + "." + msg.files[y].filetype
                              break;
                    }
                    await fsPromises.writeFile("./views/uploads/" + full_name, msg.files[y].file)
                    files_array.push({
                         path: "./views/uploads/" + full_name,
                         purpose: msg.files[y].filepurpose,
                         type: msg.files[y].filetype
                    })
               }
               message_array[message_array.length - 1].files = files_array
          }



          await collection.updateOne({
               _id: request
          }, {
               $set: {
                    messages: message_array
               }
          });

     });
});

app.post("/create_chat/", async function (req, res) {
     let insert_this = {},
          permission = await check_cookie(req, res);
     if (permission) {
          await mongoClient.connect();
          const db = await mongoClient.db("users"),
               collection = await db.collection("chats");
          insert_this["messages"] = []
          insert_this["chat_name"] = req.body.chat_name;
          insert_this["members"] = req.body.members;
          await collection.insertOne(req.body);
     }

})

app.get("/api/:number/", async function (req, res) {
     let param = +req.params.number,
          permission = await check_cookie(req, res);
     if (permission == "student") {
          await mongoClient.connect();
          const db = await mongoClient.db("users"),
               collection1 = await db.collection("users_info"),
               collection2 = await db.collection("groups"),
               collection3 = await db.collection("chats")


          let previous_step = await collection2.find({
               students: req.cookies.user_id
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
                    let results3 = await collection2.find().toArray();
                    await res.send(results3)
                    break
               case 4:
                    let results4 = await collection2.find().toArray();
                    await res.send(results4)
                    break
          }
     }
})

app.get("/api/:number/:num", async function (req, res) {
     let param = +req.params.number,
          permission = await check_cookie(req, res);
     if (permission == "teacher") {
          await mongoClient.connect();
          const db = await mongoClient.db("users"),
               collection1 = await db.collection("users_info"),
               collection2 = await db.collection("groups");

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
                    let results = await collection2.find().toArray();
                    await res.send(results)
                    break
               case 4:
                    let results4 = await collection2.find().toArray();
                    await res.send(results4)
                    break
          }
     }
})

app.get("/api_feedbacks", async function (req, res) {
     await mongoClient.connect();
     const db = await mongoClient.db("users"),
          collection = await db.collection("feedbacks");
     let result = await collection.find().toArray()
     await res.send(result)
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
               await collection.insertOne(req.body);

               break;
     }
     res.redirect("/teacher")
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
                         avatar: "./views/uploads/" + filename,
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
               await image.mv("./views/uploads/" + filename)
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

app.post("/add_feedback/", async function (req, res) {
     await mongoClient.connect();
     const db = await mongoClient.db("users"),
          collection = await db.collection("feedbacks");
     await collection.insertOne(req.body)
})

app.post("/logination/", async function (req, res) {
     await mongoClient.connect();
     const db = await mongoClient.db("users"),
          collection = await db.collection("users_info"),
          another_collection = await db.collection("groups"),
          today = new Date();
     let results = await collection
          .find({
               username: req.body.login,
          })
          .toArray()

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
                    let that_day = new Date(today)
                    that_day.setDate(that_day.getDate() + 4)
                    await res.cookie("user_id", results[0]._id.toString(), {
                         expires: that_day
                    })
                    await res.cookie("time", date, {
                         expires: that_day
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
                         do: `window.location.href = "http://localhost:3000/dairy/"`,
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

app.post("/delete_cookie/", function (req, res) {
     res.clearCookie("time");
     res.clearCookie("user_id");
     res.redirect("/")
})

app.get("/dairy/", async function (req, res) {
     await mongoClient.connect()
     const db = await mongoClient.db("users"),
          collection = await db.collection("groups")
     let user_group = await get_group(req.cookies.user_id)
     let [result] = await collection.find({
          name: user_group
     }).toArray()
     if (result != undefined) {
          let permission = await check_cookie(req, res)
          if (permission == "student") {
               await res.render("layouts/dairy", {
                    layout: "dairy",
                    show_teacher_panel: false,
                    group: user_group,
                    stop_link_lessons: false,
                    permission: permission
               });
          }
     } else {
          await res.render("layouts/404", {
               layout: "404",

          });
     }
})

app.get("/dairy/:num", async function (req, res) {
     let permission = await check_cookie(req, res)
     if (permission == "teacher") {
          await mongoClient.connect()
          const db = await mongoClient.db("users"),
               collection = await db.collection("groups")
          let [result] = await collection.find({
               name: req.params.num
          }).toArray()
          if (result != undefined) {
               await res.render("layouts/dairy", {
                    layout: "dairy",
                    show_teacher_panel: true,
                    stop_link_lessons: false,
                    permission: permission
               });
          } else {
               await res.render("layouts/404", {
                    layout: "404",
               });
          }
     }

})

app.get("/teacher/", async function (req, res) {
     let permission = await check_cookie(req, res)
     switch (permission) {
          case "student":
               await res.render("layouts/access_denied", {
                    layout: "access_denied",
                    permission: permission
               });
               break;
          case "teacher":
               await res.render("layouts/teacher_client", {
                    layout: "teacher_client",
                    permission: permission
               });

               break;
     }
});

app.get("/feedbacks", async function (req, res) {
     let permission = await check_cookie(req, res)
     if (permission) {
          await res.render("layouts/feedbacks", {
               layout: "feedbacks",
               stop_link_feedbacks: false,
               permission: permission
          })
     } else {
          await res.render("layouts/feedbacks", {
               layout: "feedbacks",
               stop_link_feedbacks: false,
               permission: "anonym"
          })
     }
})

app.get("/chat", async function (req, res) {
     let permission = await check_cookie(req, res)
     if (permission) {
          await res.render("layouts/chat", {
               layout: "chat",
               stop_link_chat: false,
               permission: permission == 'teacher'
          })
     }
})

app.get("/personal_cabinet/", async function (req, res) {
     let permission = await check_cookie(req, res)
     res.render("layouts/personal_cabinet", {
          layout: "personal_cabinet",
          permission: permission
     });
});

app.get("/", function (req, res) {
     res.render("layouts/index", {
          layout: "index",
     });
});

app.get("/vue_test", function (req, res) {
     res.render("layouts/vue_test", {
          layout: "vue_test",
     });
});

app.use(async function (req, res) {
     await res.render("layouts/404", {
          layout: "404",
     });
})

http.listen(3000, function () {
     console.clear()
     console.log("Server started on http://localhost:3000/");
});