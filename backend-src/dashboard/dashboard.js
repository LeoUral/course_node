const express = require('express');
const router = express.Router();

const getNotes = require('./getNotes');
const createNote = require('./createNote');
const getNote = require('./getNote');
const archive = require('./archive');
const unarchive = require('./unarchive');
const editNote = require('./editNote');
const deleteNote = require('./deleteNote');
const deleteAllArchive = require('./deleteAllArchive');

router.get('/get_notes', getNotes); //* получение всех записей согласно фильтра

router.post('/create_note', createNote); //* создание новой записи

router.get('/get_note', getNote); //* получаем запись по ID

router.get('/archive', archive); //* перемещаем в архив

router.get('/unarchive', unarchive); //* переносим из архива

router.post('/edit_note', editNote); //* редактирование заметки

router.get('/delete_note', deleteNote); //* удаление заметки

router.get('/delete_all_archive', deleteAllArchive); //* удаление всего архива

router.get('/note_pdf_url', async(req, res) => {
    console.log(`API >>> ${req.path} >>> `);
    res.json()
});

module.exports = router;
