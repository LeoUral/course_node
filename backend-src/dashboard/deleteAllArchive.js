module.exports = async(req, res) => {

    const userId = req.user._id;
    const db = req.db;

    console.log(`delete ALL archive::: `, userId);

    const result = await db.collection('notes')
        .deleteMany({ user: userId, isArchived: true });

    console.log(`DELETE notes with isArchived = true`); // test
    console.log(`RESULT DELETE:::: `, result); // test

    res.json({ 'Delete all archived notes': "OK" })
}
