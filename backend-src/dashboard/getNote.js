module.exports = async(req, res) => {

    const { id } = req.query;
    const userId = req.user._id;

    const result = await req.db.collection('notes')
        .findOne({ _id: id, user: userId })

    res.json(result)
}
