// src/app/services/database.service.ts

import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';

// Interfaz para el usuario (puedes expandirla con más campos)
export interface User {
  id: string;
  email: string;
  name: string;
  // Puedes añadir más campos como 'lastLogin', 'preferences', etc.
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  private sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
  private db!: SQLiteDBConnection; // ¡Usamos '!' porque se inicializará en init()
  private dbReady: boolean = false; // Estado para saber si la BD está lista

  constructor() { }

  /**
   * Inicializa la base de datos: abre la conexión y crea las tablas si no existen.
   */
  async init(): Promise<void> {
    try {
      if (!this.dbReady) {
        // Abrir la base de datos. Si no existe, la crea.
        // Puedes cambiar 'bencineras_db' por el nombre que quieras para tu BD.
        this.db = await this.sqlite.createConnection('bencineras_db', false, 'no-encryption', 1, false);

        await this.db.open(); // Abrir la conexión a la base de datos
        console.log('Base de datos "bencineras_db" abierta o creada exitosamente.');

        // Ejecutar sentencia para crear la tabla de bencineras si no existe
        // Asegúrate de que esta estructura coincida con lo que esperas de la API de CNE.
        const createBencinerasTableSQL = `
          CREATE TABLE IF NOT EXISTS bencineras (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            address TEXT,
            price REAL NOT NULL,
            latitude REAL NOT NULL,
            longitude REAL NOT NULL,
            fuelType TEXT
          );
        `;
        await this.db.execute(createBencinerasTableSQL);
        console.log('Tabla "bencineras" verificada/creada exitosamente.');

        // NUEVO: Crear la tabla de usuarios si no existe
        const createUsersTableSQL = `
          CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            name TEXT
          );
        `;
        await this.db.execute(createUsersTableSQL);
        console.log('Tabla "users" verificada/creada exitosamente.');


        this.dbReady = true; // Marcar la BD como lista
      }
    } catch (e) {
      console.error('Error al inicializar la base de datos:', e);
      // Aquí podrías mostrar un toast o alert al usuario
    }
  }

  /**
   * Ejecuta una sentencia SQL (INSERT, UPDATE, DELETE, CREATE TABLE, etc.).
   * @param sql La sentencia SQL a ejecutar.
   * @param values (Opcional) Los valores para la sentencia preparada.
   * @returns Un Promise que se resuelve cuando la sentencia ha sido ejecutada.
   */
  async runSQL(sql: string, values?: any[]): Promise<void> {
    if (!this.dbReady) {
      console.warn('La base de datos no está lista. Intentando inicializar...');
      await this.init(); // Intenta inicializar si no está lista
      if (!this.dbReady) {
        throw new Error('La base de datos no pudo inicializarse.');
      }
    }
    try {
      await this.db.run(sql, values);
      console.log('Sentencia SQL ejecutada:', sql, values || '');
    } catch (e) {
      console.error('Error al ejecutar SQL:', sql, values || '', e);
      throw e; // Relanza el error para que el componente lo maneje
    }
  }

  /**
   * Ejecuta una consulta SQL SELECT.
   * @param sql La consulta SQL SELECT a ejecutar.
   * @param values (Opcional) Los valores para la sentencia preparada.
   * @returns Un Promise que resuelve con los resultados de la consulta.
   */
  async querySQL(sql: string, values?: any[]): Promise<DBSQLiteValues> {
    if (!this.dbReady) {
      console.warn('La base de datos no está lista. Intentando inicializar...');
      await this.init(); // Intenta inicializar si no está lista
      if (!this.dbReady) {
        throw new Error('La base de datos no pudo inicializarse.');
      }
    }
    try {
      const res = await this.db.query(sql, values);
      console.log('Consulta SQL ejecutada:', sql, values || '', 'Resultados:', res.values);
      return res;
    } catch (e) {
      console.error('Error al consultar SQL:', sql, values || '', e);
      throw e; // Relanza el error
    }
  }

  /**
   * Cierra la conexión a la base de datos.
   */
  async close(): Promise<void> {
    try {
      if (this.dbReady) {
        await this.db.close();
        this.dbReady = false;
        console.log('Base de datos cerrada.');
      }
    } catch (e) {
      console.error('Error al cerrar la base de datos:', e);
    }
  }

  // --- NUEVAS FUNCIONES PARA EL MANEJO DE USUARIOS ---

  /**
   * Guarda o actualiza un usuario en la tabla 'users'.
   * Si el usuario ya existe (por ID), lo actualiza. De lo contrario, lo inserta.
   * @param user Los datos del usuario a guardar.
   */
  async saveUser(user: User): Promise<void> {
    const sql = `
      INSERT OR REPLACE INTO users (id, email, name)
      VALUES (?, ?, ?);
    `;
    const values = [user.id, user.email, user.name];
    await this.runSQL(sql, values);
    console.log(`Usuario ${user.email} guardado/actualizado.`);
  }

  /**
   * Obtiene un usuario por su ID.
   * @param userId El ID del usuario.
   * @returns Un Promise que resuelve con los datos del usuario o null si no se encuentra.
   */
  async getUser(userId: string): Promise<User | null> {
    const sql = `SELECT * FROM users WHERE id = ?;`;
    const res = await this.querySQL(sql, [userId]);
    if (res && res.values && res.values.length > 0) {
      console.log(`Usuario encontrado:`, res.values[0]);
      return res.values[0] as User;
    }
    console.log(`Usuario con ID ${userId} no encontrado.`);
    return null;
  }

  /**
   * Obtiene un usuario por su email.
   * @param email El email del usuario.
   * @returns Un Promise que resuelve con los datos del usuario o null si no se encuentra.
   */
  async getUserByEmail(email: string): Promise<User | null> {
    const sql = `SELECT * FROM users WHERE email = ?;`;
    const res = await this.querySQL(sql, [email]);
    if (res && res.values && res.values.length > 0) {
      console.log(`Usuario encontrado por email:`, res.values[0]);
      return res.values[0] as User;
    }
    console.log(`Usuario con email ${email} no encontrado.`);
    return null;
  }

  /**
   * Elimina un usuario por su ID.
   * @param userId El ID del usuario a eliminar.
   */
  async deleteUser(userId: string): Promise<void> {
    const sql = `DELETE FROM users WHERE id = ?;`;
    await this.runSQL(sql, [userId]);
    console.log(`Usuario con ID ${userId} eliminado.`);
  }
}
