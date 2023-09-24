import express from 'express'

const cryptoJS = require("crypto-js")
require('dotenv').config()
const cors = require("cors")

var mysql = require("mysql2")
const app = express()

app.use(express.json())
app.use(cors())


var con = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USERDB,
    password: process.env.SENHA,
    database: process.env.DB
})

con.connect(function (err:any){
    if(err) throw err;
    console.log("conected")
})

app.get("/produtos",(req, res)=>{
    con.query("SELECT * FROM produto", function (err:any, rows:any, fields:any){
        return res.json(rows)
    })
})

app.get("/checkEmail/:email", (req, res)=>{
    con.query("SELECT nome FROM usuario WHERE email = '"+req.params.email+"'", function (err:any, rows:any, fields:any){
        return res.json(rows)
    })
})

app.post("/signin", (req, res)=>{
    var email = req.body.email
    var senha = req.body.senha

    con.query(
        "SELECT senha FROM usuario WHERE email = ?",
        [email],
        (err:any, result:any) => {
            if (err) {
            console.log(err);
            } else {
                if(result.length==0) return;
                console.log(typeof(result))
                var senhaServer=result[0]["senha"].split(".")
                let salt = senhaServer[1]
                let hashBuf = cryptoJS.MD5(senha+salt).toString()
                if(senhaServer[0]==hashBuf){
                    res.sendStatus(200)
                }else{
                    res.sendStatus(406)
                }
            }
        }
    )
})

app.post("/signup", (req, res)=>{
    var values = [req.body.nome, req.body.email, req.body.user]
    console.log(req.body)
    let senha = req.body.senha
    let salt = cryptoJS.lib.WordArray.random(4).toString()
    let hashBuf = cryptoJS.MD5(senha+salt).toString()
    let hashSaltBuf = hashBuf +"."+salt

    values.push(hashSaltBuf)
    
    con.query(`INSERT INTO usuario(nome, email, username, senha) VALUES (?, ?, ?, ?)`, values,(err:any, result:any) => {
        if (err) {
          console.log(err);
        } else {
          console.log(`Registro inserido com sucesso!`);
        }
      })

    res.sendStatus(200)
})

app.listen(process.env.PORT, ()=>console.log("server on https://localhost:5000"))