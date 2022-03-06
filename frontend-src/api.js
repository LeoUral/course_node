// const PREFIX = "http://localhost:3000/dashboard";
const PREFIX = "https://mykudryashov.ru/dashboard";

const req = async(url, options = {}) => {
    const { body } = options;

    return await fetch((PREFIX + url).replace(/\/\/$/, ""), {
        ...options,
        body: body ? JSON.stringify(body) : null,
        headers: {
            ...options.headers,
            ...(body ? {
                    "Content-Type": "application/json",
                } :
                null),
        },
    }).then((res) =>
        res.ok ?
        res.json() :
        res.text().then((message) => {
            throw new Error(message);
        })
    ).then((data) => {
        console.log(`RESULT:::: `, data); // test
        return data
    });
};

//TODO наладить экспорт функций с req(url, options)
export const getNotes = async({ age, search, page } = {}) => { return await req(`/get_notes/?age=${age}&search=${search}&page=${page}`) }; //*

export const createNote = async(title, text) => { return await req(`/create_note/`, { method: 'post', body: { title, text } }) }; //*

export const getNote = async(id) => { return await req(`/get_note/?id=${id}`) }; //*

export const archiveNote = async(id) => { return await req(`/archive/?id=${id}`) }; //*

export const unarchiveNote = async(id) => { return await req(`/unarchive/?id=${id}`) }; //*

export const editNote = async(id, title, text) => { return await req(`/edit_note/`, { method: 'post', body: { id, title, text } }) }; //*

export const deleteNote = async(id) => { return await req(`/delete_note/?id=${id}`) }; //*

export const deleteAllArchived = async() => { return await req(`/delete_all_archive`) }; //*

export const notePdfUrl = (id) => { req(`/note_pdf_url/?id=${id}`) };