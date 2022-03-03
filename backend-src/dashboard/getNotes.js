const searchQuery = require('../searchQuery');

module.exports = async(req, res) => {

    const { age, search, page } = req.query;
    const db = req.db;

    const searchData = searchQuery(req, age);
    let regSearch = new RegExp(search, 'i');

    const arrData = await db.collection('notes')
        .find({ $and: [searchData, { title: { $regex: regSearch } }] })
        .skip((Number(page) - 1) * 20)
        .limit(Number(page) * 20)
        .toArray()

    res.json(arrData)
}
