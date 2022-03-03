const showdown = require('showdown');
const converter = new showdown.Converter();

module.exports = async(req, res) => {

    const { id, title, text } = req.body;
    const db = req.db;
    const userId = req.user._id;

    const html = await converter.makeHtml(text);

    const result = await db.collection('notes')
        .findOneAndUpdate({ _id: id, user: userId }, { $set: { text: html, title: title } }, { returnDocument: "after" })

    res.json(result)
}
