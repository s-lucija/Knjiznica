import express from "express"
import mysql from "mysql"
import bodyParser from "body-parser"
import cors from "cors"

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const db = mysql.createConnection({
  host: "",
  user: "",
  password: "",
  port: 3306,
  database: ""
});

db.connect();

app.get("/api/knjiga", (req, res) => {
  db.query("SELECT * FROM knjiga", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

app.get("/api/knjiga/slobodne", (req, res) => {
  db.query("SELECT * FROM knjiga WHERE status = 'slobodna'", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

app.get("/api/knjiga/naslov/:naslov", (req, res) => {
  db.query(
    "SELECT * FROM knjiga WHERE naslov = ?",
    [req.params.naslov],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    }
  );
});

app.get("/api/knjiga/autor/:autor", (req, res) => {
  db.query(
    "SELECT * FROM knjiga WHERE autor = ?",
    [req.params.autor],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    }
  );
});

app.post("/api/unos_knjige", (req, res) => {
  const data = req.body;
  const knjiga = [[data.naslov, data.autor, data.opis, data.slika, data.stanje, data.status]];
  db.query(
    "INSERT INTO knjiga (naslov, autor, opis, slika, stanje, status) VALUES ?",
    [knjiga],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    }
  );
});

app.get("/api/korisnik", (req, res) => {
  db.query("SELECT * FROM korisnik", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

app.get("/api/korisnik/email/:email", (req, res) => {
  db.query(
    "SELECT * FROM korisnik WHERE email = ?",
    [req.params.email],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    }
  );
});

app.get("/api/rezervacija", (req, res) => {
  db.query(
    `SELECT
      r.id AS rezervacija_id,
      r.datum_rezervacije,
      r.datum_vracanja,
      k.id AS knjiga_id,
      k.naslov,
      k.autor,
      u.id AS korisnik_id,
      u.ime,
      u.prezime
     FROM rezervacija r
     JOIN knjiga k ON r.knjiga = k.id
     JOIN korisnik u ON r.korisnik = u.id`,
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    }
  );
});

app.get("/api/rezervacija/aktivne", (req, res) => {
  db.query(
    `SELECT
      r.id AS rezervacija_id,
      r.datum_rezervacije,
      r.datum_vracanja,
      k.id AS knjiga_id,
      k.naslov,
      k.autor,
      u.id AS korisnik_id,
      u.ime,
      u.prezime
     FROM rezervacija r
     JOIN knjiga k ON r.knjiga = k.id
     JOIN korisnik u ON r.korisnik = u.id
     WHERE r.datum_vracanja IS NULL`,
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    }
  );
});

app.get("/api/rezervacija/korisnici-aktivne", (req, res) => {
  db.query(
    `SELECT DISTINCT
      u.id,
      u.ime,
      u.prezime,
      u.korime
     FROM rezervacija r
     JOIN korisnik u ON r.korisnik = u.id
     WHERE r.datum_vracanja IS NULL`,
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    }
  );
});

app.listen(3000, () => console.log("Server running on port 3000"));