import * as SQLite from "expo-sqlite";

let dbInstance: SQLite.SQLiteDatabase | null = null;

export async function getDB() {
  if (!dbInstance) {
    dbInstance = await SQLite.openDatabaseAsync("bd_sabores_del_valle.db");
    await dbInstance.execAsync("PRAGMA foreign_keys = ON;");
  }
  return dbInstance;
}