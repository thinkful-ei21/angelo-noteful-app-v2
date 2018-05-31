'use strict';

const express = require('express');

// Create an router instance (aka "mini-app")
const router = express.Router();

const knex = require('../knex');

router.get('/', (req, res, err) => {
    knex.select('id', 'name')
        .from('folders')
        .then(results => {
            res.json(results);
        })
        .catch(err => next(err));
});

router.get('/:id', (req, res, err) => {
    const id = req.params.id;

    knex.select('id', 'name')
        .from('folders')
        .modify(queryBuilder => {
            if (id) {
                queryBuilder.where('id', id)
            }
        })
        .then(results => {
            res.json(results);
        })
        .catch(err => {
            next(err);
        })
});

router.put('/:id', (req, res, err) => {
    const id = req.params.id;
    const updateObj = {};
    const fields = ['name'];

    fields.forEach(field => {
        if (field in req.body) {
            updateObj[field] = req.body[field];
        }
    });

    if (!updateObj.name) {
        const err = new Error('Missing `title` in request body');
        err.status = 400;
        return next(err);
    }

    knex('folders').update(updateObj)
        .returning(['id', 'name'])
        .where('id', id)
        .then(results => {
            res.json(results[0]);
        })
        .catch(err => {
            next(err);
        })

})

router.post('/', (req, res, next) => {
    const { name } = req.body;

    const newItem = { name };

    if (!('name' in newItem)) {
        const err = new Error('Missing `name` in request body');
        err.status = 400;
        return next(err);
    }

    knex('folders')
        .insert(newItem, ['folders.id', 'name'])
        .then(result => {
            res.location(`http://${req.headers.host}/folders/${result[0].id}`).status(201).json(result[0]);
        })
        .catch(err => {
            next(err);
        })
});

router.delete('/:id', (req, res, next) => {
    const id = req.params.id;

    knex('folders')
        .where('id', id)
        .del()
        .then(() => {
            res.status(204).end()
        })
        .catch(err => {
            console.error(err);
        })
});

module.exports = router;