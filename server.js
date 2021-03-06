const express = require('express');
const bodyParser = require('body-parser');
const sql = require('./database.js');
const cors = require('cors');

var checker = false;
var usernameGlobal = '';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

app.get('/', (req, res) => {
    res.send('<h1>Server is running</h1>');
});

app.get('/fm_xxx/:data', (req, res) => {
    let data = req.params.data;
    
    sql.query(`SELECT * FROM fmxxx where date= '${data}'`, (error, results) => {
        if (error) {
            res.json({
                message: 'O formulário não exixte'
            });
        }
        return res.send({data: results[0]});
    });
});

app.post('/auth', (req, res) => {
    var username = req.body.username;
    var password = req.body.password;

    sql.query(`select * from users where login= '${username}'`, (error, results) => {
        if (error) {
            res.json({
                status:false,
                message: 'Erro inesperado na query da API: ', error
            })
        } else {
            if (results.length > 0) {
                if (password === results[0].password) {
                    checker = true;
                    usernameGlobal = results[0].first_name;
                    res.json({
                        status: true,
                        message: 'Login bem sucedido!'
                    })
                } else {
                    checker = false;
                    res.json({
                        status: false,
                        message: 'Username e senha não deram match'
                    });
                }
            }
            else {
                checker = false;
                res.json({
                    status: false,
                    message: 'Username não listado na nossa Base de Dados'
                });
            }
        }
        
    });
});

app.get('/getUser', (req, res) => {
    res.json({
        username: usernameGlobal
    });
});

app.get('/check', (req, res) => {
    if (checker === true) {
        res.json({
            status: true
        });
    } else if (checker === false) {
        res.json({
            status: false
        });
    };
});

app.get('/logout', (req, res) => {
    checker = false;
    usernameGlobal = '';
    res.json({
        status: out
    })
});

app.post('/new', (req, res) => {
    
        var dataColeta = req.body.data;
        var res1 = req.body.res1;
        var res2 = req.body.res2;
        var res3 = req.body.res3;
        var res4 = req.body.res4;
        var res5 = req.body.res5;
        var res6 = req.body.res6;
        var res7 = req.body.res7;
        var res8 = req.body.res8;

    sql.query(`insert into fmxxx (date, autoconer, urdideira, fsg_eng, fcg_eng, fcg_tecelagem, res_picanol, res_itema, varreduras) values ('${dataColeta}', '${res1}', '${res2}', '${res3}', '${res4}', '${res5}', '${res6}', '${res7}', '${res8}')`, (error, results) => {
        if (error) {
            res.json({
                status: false,
                message: 'Erro inesperado na Query'
            })
        } else {
            res.json({
                status: true,
                data: results,
                message: 'Coleta registrada com sucesso!'
            })
        }
    });

});

var port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('Server is running on port ', port);
});
