module.exports = async(req, res) => {

    const { id } = req.query;
    const db = req.db;
    const userId = req.user._id;

    const result = await db.collection('notes')
        .findOneAndUpdate({ _id: id, user: userId }, { $set: { isArchived: false } }, { returnDocument: "after" })

    res.json(result)
}
