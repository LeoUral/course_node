module.exports = async(req, res) => {

    const { id } = req.query
    const userId = req.user._id;
    const db = req.db;

    const result = await db.collection('notes')
        .deleteOne({ _id: id, user: userId });

    console.log(`DELETE note with ID: ${id}`); // test
    console.log(`RESULT DELETE:::: `, result); // test

    res.json({ 'Delete note with id': id })
}
