'use strict';

const knex = require('../knex');

// let searchTerm = 'Store';
// knex
//   .select('notes.id', 'title', 'content')
//   .from('notes')
//   .modify(queryBuilder => {
//     if (searchTerm) {
//       queryBuilder.where('title', 'like', `%${searchTerm}%`);
//     }
//   })
//   .orderBy('notes.id')
//   .then(results => {
//     console.log(JSON.stringify(results, null, 2));
//   })
//   .catch(err => {
//     console.error(err);
//   });

// get by id
let id = '1002';

knex('notes')
  .select('notes.id', 'title', 'content')
  .modify(queryBuilder => {
    if (id) {
      queryBuilder.where('id', id)
    }
  })
  .orderBy('notes.id')
  .then(results => {
    console.log(JSON.stringify(results[0], null, 2));
  })
  .catch(err => {
    console.error(err);
  });

//update note by id
let id = '1002';
let updateData = {title: 'New title', content: 'Wow i have so much to do today and so little time'};

knex('notes')
  .where('id', id)
  .update(updateData, ['id', 'title', 'content'])
  .then(results => console.log(JSON.stringify(results[0])))
  .catch(err => console.error(err));
  
//create a note
let note = {title: 'buy marshmallows', content: 'marshmallows are mysterious candy. they are made from sugar but they are soft so who knows.'};

knex('notes')
  .insert(note, ['notes.id', 'title', 'content'])
  .then(result => console.log(JSON.stringify(note)))
  .catch(err => console.error(err));

//delete note by id
let id = 1010;
knex('notes')
  .where('id', id)
  .del()
  .then(console.log(`deleted note with id ${id}`));