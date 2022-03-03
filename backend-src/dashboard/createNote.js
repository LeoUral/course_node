const { nanoid } = require('nanoid');
const showdown = require('showdown');
const converter = new showdown.Converter();

module.exports = async(req, res) => {

    // console.log('BODY:::: ', req.body); // test
    const { title, text } = req.body;
    const db = req.db;
    const id = nanoid()

    const html = await converter.makeHtml(text);

    const data = {
        _id: id,
        title: title,
        text: html,
        date: Date.now(),
        isArchived: false,
        user: req.user._id
    }

    await db.collection('notes')
        .insertOne(data)

    res.json(id)
}
