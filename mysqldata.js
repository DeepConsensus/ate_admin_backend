const mysql = require('mysql')
require('dotenv-safe').config()
const path = require('path')
const initMongo = require('./config/mongo')
const User = require('./app/models/user')
const Film = require('./app/models/film')
const Cast = require('./app/models/castcrew')
const Role = require('./app/models/roles')
const uuid = require('uuid')
const utils = require('./app/middleware/utils')
const db = require('./app/middleware/db')
const usercontrolloer = require('./app/controllers/users')
const _ = require('lodash')

const MongoClient = require('mongodb').MongoClient

const mongoose = require('mongoose')
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sf2.0'
})

connection.connect()
initMongo()

const migrateuser = async function() {
    connection.query('SELECT * from fn_users', (err, rows, fields) => {
        if (err) {
            throw err
        }
        console.log('total User =', rows.length)
        const count = 0
        for (let i = 0; i < rows.length; i++) {
            rows[i].verification = uuid.v4()
            rows[i].createdAt = rows[i].date_registered
            if (rows[i].type == '') {
                rows[i].type = 'core'
            }
            if (rows[i].name !== '') {
                const user = new User(rows[i])
                user.save((err, item) => {
                    if (err) {
                        console.log('err', err)
                            // console.log('item =', rows[i]);
                    } else {
                        // console.log('Count = ', count++);
                    }
                })
            }
        }
        console.log('Inserted Count =', count)
    })
}

// migrateuser();

// connection.end()
const regions = []
const category = []
const getregion = function() {
        connection.query('SELECT * from fn_region', (err, rows, fields) => {
            for (let r = 0; r < rows.length; r++) {
                regions.push(rows[r])
            }
        })
        connection.query('SELECT * from fn_channels', (err, rows, fields) => {
            for (let c = 0; c < rows.length; c++) {
                category.push(rows[c])
            }
        })
    }
    //getregion()

const getUserdetaisl = async(userid) => {
    const userdata = { id: '' }
    await User.findOne({
            id: userid
        },
        (err, item) => {
            if (item !== null) {
                userdata.id = item._id
                console.log('userdata =', userdata)
            }
        }
    )

    return userdata
}

const getfilms = async function() {
        MongoClient.connect(
            'mongodb://localhost/news', { useNewUrlParser: true, useUnifiedTopology: true },
            (err, client) => {
                if (err) {
                    // medConsoleLog(err);
                } else {
                    console.log('Medical connected to MongoDB successfully')
                    const newdb = client.db('news')
                    newdb
                        .collection('users')
                        .find()
                        .toArray((err, res) => {
                            console.log('res =', res.length)
                            if (res.length > 0) {
                                for (let k = 0; k < res.length; k++) {
                                    newdb.collection('films').updateMany({
                                            user_id: res[k].id
                                        }, {
                                            $set: {
                                                user_id: mongoose.Types.ObjectId(res[k]._id)
                                            }
                                        }, {
                                            returnNewDocument: true,
                                            returnOriginal: false
                                        },
                                        (err, doc) => {
                                            // console.log('doc =', doc);
                                            // console.log('err =', err);
                                        }
                                    )
                                }
                            }
                        })
                }
            }
        )
    }
    // getfilms()
exports.migratevideo = async function() {
    connection.query('SELECT * from fn_videos', (err, rows, fields) => {
        if (err) {
            throw err
        }

        // console.log('rows[0] =', rows[0]);
        console.log('rows.length =', rows.length)
        for (let ff = 0; ff < rows.length; ff++) {
            // let userdetails = getUserdetaisl(rows[0].user_id);
            // console.log('userdetails =', userdetails);
            if (rows[ff].source !== '') {
                // console.log('data =', data);
                // console.log(rows[ff]);
                if (rows[ff].category === undefined) {
                    rows[ff].category = 1
                }
                if (rows[ff].reg_id === undefined) {
                    rows[ff].reg_id = 1
                }
                const catname = _.find(category, { cat_id: rows[ff].category })
                const lang = _.find(regions, { pk_id: rows[ff].reg_id })
                    // rows[ff].user_id = userdetails.id;
                rows[ff].categoryname = ''
                rows[ff].regionname = ''
                if (catname) {
                    rows[ff].categoryname = catname.cat_name
                }
                if (lang) {
                    rows[ff].regionname = lang.region_name
                }
                rows[ff].createdAt = rows[ff].date
                    // console.log('total Videos =', rows[ff]);
                const film = new Film(rows[ff])
                film.save((err, item) => {
                    if (err) {
                        console.log('err', err)
                            // console.log('item =', rows[i]);
                    } else {
                        // console.log('item = ', item);
                    }
                })
            }
        }
    })
}

// exports.migratevideo();

const castdetails = function() {
        connection.query(
            'SELECT * from fn_video_details where username!=""',
            (err, rows, fields) => {
                if (err) {
                    throw err
                }

                for (let i = 0; i < rows.length; i++) {
                    rows[i].id = rows[i].pk_id
                    rows[i].film_id = rows[i].video_id
                    rows[i].user_name = rows[i].username
                    const cast = new Cast(rows[i])
                    cast.save((err, item) => {
                        if (err) {
                            console.log('err', err)
                                // console.log('item =', rows[i]);
                        } else {
                            // console.log('item = ', item);
                        }
                    })
                }
            }
        )
    }
    //castdetails()

const roles = function() {
    connection.query(
        'SELECT * from fn_role ',
        (err, rows, fields) => {
            if (err) {
                throw err
            }

            for (let i = 0; i < rows.length; i++) {
                let obj = {
                    id: rows[i].id,
                    role_name: rows[i].role_name,
                    status: rows[i].status
                }

                const role = new Role(obj)
                role.save((err, item) => {
                    if (err) {
                        console.log('err', err)
                            // console.log('item =', rows[i]);
                    } else {
                        // console.log('item = ', item);
                    }
                })
            }
        }
    )
}

roles();
connection.end()