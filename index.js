require("dotenv").config();
const express = require("express");
const nunjucks = require("nunjucks");
const { nanoid } = require("nanoid");
const cookieParser = require("cookie-parser");

const crypto = require("crypto");
const { MongoClient, ObjectId } = require("mongodb");

const dashboard = require('./backend-src/dashboard/dashboard');


const clientPromise = new MongoClient(process.env.DB_URI, {
    useUnifiedTopology: true,
    maxPoolSize: 10,
});

const app = express();
const nameDB = "course_node";
const secret = "abcdefg";

nunjucks.configure("views", {
    autoescape: true,
    express: app,
});

// константа обращения к DB
app.use(async(req, res, next) => {
    try {
        const client = await clientPromise.connect();
        req.db = client.db(nameDB);
        next();
    } catch (err) {
        console.log(`Ошибка на момент создания клиента: `, err);
        next(err);
    }
});

//* создаем нового пользователя
const createNewUser = async(db, username, password) => {
    if (await findUserInDataBase(db, username)) {
        console.log("Такой пользователь уже есть!");
        return false;
    }
    const result = await db.collection("users").insertOne({
        username: username,
        password: crypto.createHash("sha256", secret).update(password).digest("hex"),
    });
    console.log(`new user:::: `, result.insertedId); // test
    console.log(`Новый пользователь создан: ${username}`); //test
    return result.insertedId;
};

//* поиск пользователя по имени в БД
const findUserInDataBase = async(db, username) => {
    return db.collection("users").findOne({ username });
};

//* создаем сессию
const createSession = async(db, userId) => {
    const sessionId = nanoid();
    await db.collection("sessions").insertOne({
        userId,
        sessionId,
    });
    console.log(`создана сессия: ${sessionId}`); //test
    return sessionId;
};

//* поиск пользователя по id сессии в БД
const findUserInSession = async(db, sessionId) => {
    const session = await db.collection("sessions").findOne({ sessionId }, { projection: { userId: 1 } });

    if (!session) {
        return;
    }
    return db.collection("users").findOne({ _id: ObjectId(session.userId) });
};

//* проверка сессии
const auth = () => async(req, res, next) => {

    if (!req.cookies["sessionId"]) {
        return res.redirect('/').next();
    }
    const user = await findUserInSession(req.db, req.cookies["sessionId"]);
    req.user = user;
    req.sessionId = req.cookies["sessionId"];
    next();
};

//* удаляем сессию
const deleteSession = async(db, sessionId) => {
    await db.collection("sessions").deleteOne({ sessionId });

    console.log(`сессия: ${sessionId}, удалена`); //test
};

app.set("view engine", "njk");
app.use(cookieParser());
app.use(express.urlencoded());
app.use(express.json());
app.use(express.static("public"));

app.get('/', (req, res) => {
    res.render("index");
})

app.get('/dashboard', auth(), (req, res) => {
    res.render("dashboard", {
        USERNAME: req.user.username,
    });
})

// POST -> login
app.post('/login', async(req, res) => {
    const { username, password } = req.body;
    console.log(`NAME: ${username} & PASSWORD: ${password}`);

    const user = await findUserInDataBase(req.db, username);

    if (!user || user.password !== crypto.createHash("sha256", secret).update(password).digest("hex")) {
        return res.render('index', { authError: "Ошибка входа! (не верный логин или пароль)" });
    }
    const sessionId = await createSession(req.db, user._id);
    res.cookie("sessionId", sessionId, { httpOnly: true, expires: 0 }).redirect("/dashboard");
});

// POST -> signup
app.post('/signup', async(req, res) => {
    const { username, password } = req.body;
    if (username.length > 0, password.length > 0) {
        const result = await createNewUser(req.db, username, password);

        console.log(`NAME: ${username} & PASSWORD: ${password}`);

        if (result) {
            const db = req.db;
            const id = nanoid()
            const html = '<h1 id="demo">DEMO</h1><p><strong> test </strong><br/>test <br/><em> test </em><br/>12345 test test TEST</p>'
            const data = {
                _id: id,
                title: 'DEMO',
                text: html,
                date: Date.now(),
                isArchived: false,
                user: result
            }
            await db.collection('notes')
                .insertOne(data)

            res.render('index', { authError: "Пользователь добавлен!" });
        } else {
            res.render('index', { authError: "Пользователь стаким именем уже есть!" });
        }
    } else {
        res.render('index', { authError: "Нулевое имя или пароль!" });
    }
});

//* выход
app.get("/logout", auth(), async(req, res) => {
    if (!req.user) {
        return res.redirect("/");
    }
    await deleteSession(req.db, req.sessionId);
    res.clearCookie("sessionId").redirect("/");
});

app.use('/dashboard', auth(), dashboard) //* ROUTER::: dashboard

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`SERVER RUN on http://localhost:${PORT}`);
})
