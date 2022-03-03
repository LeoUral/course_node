/**
 * Формирование фильтра
 * @param {object} req: request {object}
 * @param {string} age: filter age {string}
 * @param {string} search: search {string}
 * @returns {object}: result {object}
 */
module.exports = (req, age) => {
    const userId = req.user._id;
    const month = 1000 * 60 * 60 * 24 * 30;
    const threeMonth = 1000 * 60 * 60 * 24 * 90


    if (age === 'archive') {
        return { user: userId, isArchived: true }
    }

    if (age === 'alltime') {
        return { user: userId, isArchived: false }
    }

    if (age === '1month') {
        return { user: userId, isArchived: false, date: { $gt: (Date.now() - month) } }
    }

    if (age === '3months') {
        return { user: userId, isArchived: false, date: { $gt: (Date.now() - threeMonth) } }
    }
}
