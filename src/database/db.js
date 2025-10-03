import * as SQLite from "expo-sqlite";

let db = null;
let dbPromise = null;

export const getDb = () => {
    if (db) return Promise.resolve(db); // si ya existe, devuelvo la misma instancia
    if (dbPromise) return dbPromise; // si ya está inicializándose, devuelvo la misma promesa

    dbPromise = SQLite.openDatabaseAsync("apptrack.solutions.db.2025")
        .then((database) => {
            db = database;
            console.log("Ruta DB:", db.databasePath);
            return db;
        })
        .finally(() => {
            dbPromise = null; // opcional, para liberar la promesa
        });

    return dbPromise;
};
