import initSqlJs from 'sql.js';

class DatabaseService {
  constructor() {
    this.db = null;
    this.isInitialized = false;
    this.SQL = null;
  }

  async initialize() {
    if (this.isInitialized) return;

    try {
      console.log('🔧 Initializing SQL.js...');
      
      // Initialize SQL.js with CDN
      this.SQL = await initSqlJs({
        locateFile: file => `https://sql.js.org/dist/${file}`
      });

      // Try to load existing database from IndexedDB
      const savedDb = await this.loadFromIndexedDB();
      
      if (savedDb) {
        console.log('📂 Loading existing database from IndexedDB...');
        this.db = new this.SQL.Database(new Uint8Array(savedDb));
      } else {
        console.log('🆕 Creating new database...');
        this.db = new this.SQL.Database();
        await this.createSchema();
      }

      this.isInitialized = true;
      console.log('✅ Database initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing database:', error);
      throw error;
    }
  }

  async createSchema() {
    try {
      const response = await fetch('/schema.sql');
      const schemaSQL = await response.text();
      this.db.exec(schemaSQL);
      await this.saveToIndexedDB();
      console.log('✅ Schema created successfully');
    } catch (error) {
      console.error('❌ Error creating schema:', error);
      throw error;
    }
  }

  query(sql, params = []) {
    if (!this.isInitialized) {
      throw new Error('Database not initialized');
    }

    try {
      const stmt = this.db.prepare(sql);
      stmt.bind(params);
      
      const results = [];
      while (stmt.step()) {
        results.push(stmt.getAsObject());
      }
      stmt.free();
      
      return results;
    } catch (error) {
      console.error('SQL Error:', sql, params, error);
      throw error;
    }
  }

  queryOne(sql, params = []) {
    const results = this.query(sql, params);
    return results.length > 0 ? results[0] : null;
  }

  run(sql, params = []) {
    if (!this.isInitialized) {
      throw new Error('Database not initialized');
    }

    try {
      this.db.run(sql, params);
      // Auto-save after modifications
      this.saveToIndexedDB();
      return { success: true, changes: this.db.getRowsModified() };
    } catch (error) {
      console.error('SQL Error:', sql, params, error);
      throw error;
    }
  }

  exec(sql) {
    if (!this.isInitialized) {
      throw new Error('Database not initialized');
    }

    try {
      this.db.exec(sql);
      this.saveToIndexedDB();
      return { success: true };
    } catch (error) {
      console.error('SQL Error:', sql, error);
      throw error;
    }
  }

  // Get last inserted ID
  getLastInsertId() {
    const result = this.queryOne('SELECT last_insert_rowid() as id');
    return result ? result.id : null;
  }

  async saveToIndexedDB() {
    try {
      const data = this.db.export();
      const buffer = data.buffer;

      return new Promise((resolve, reject) => {
        const request = indexedDB.open('ProtegeDB', 1);

        request.onerror = () => reject(request.error);
        
        request.onsuccess = () => {
          const db = request.result;
          const transaction = db.transaction(['database'], 'readwrite');
          const store = transaction.objectStore('database');
          store.put(buffer, 'protege-lecture');
          
          transaction.oncomplete = () => resolve();
          transaction.onerror = () => reject(transaction.error);
        };

        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains('database')) {
            db.createObjectStore('database');
          }
        };
      });
    } catch (error) {
      console.error('Error saving to IndexedDB:', error);
    }
  }

  async loadFromIndexedDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('ProtegeDB', 1);

      request.onerror = () => reject(request.error);
      
      request.onsuccess = () => {
        const db = request.result;
        
        if (!db.objectStoreNames.contains('database')) {
          resolve(null);
          return;
        }

        const transaction = db.transaction(['database'], 'readonly');
        const store = transaction.objectStore('database');
        const getRequest = store.get('protege-lecture');

        getRequest.onsuccess = () => resolve(getRequest.result || null);
        getRequest.onerror = () => reject(getRequest.error);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('database')) {
          db.createObjectStore('database');
        }
      };
    });
  }

  async backup() {
    const data = this.db.export();
    const blob = new Blob([data], { type: 'application/x-sqlite3' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `protege-backup-${new Date().toISOString().split('T')[0]}.db`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  async restore(file) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      this.db = new this.SQL.Database(new Uint8Array(arrayBuffer));
      await this.saveToIndexedDB();
      return { success: true };
    } catch (error) {
      console.error('Error restoring database:', error);
      throw error;
    }
  }

  async clearDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.deleteDatabase('ProtegeDB');
      request.onsuccess = () => {
        this.db = new this.SQL.Database();
        this.createSchema().then(resolve).catch(reject);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Transaction support
  beginTransaction() {
    this.exec('BEGIN TRANSACTION');
  }

  commit() {
    this.exec('COMMIT');
  }

  rollback() {
    this.exec('ROLLBACK');
  }
}

export default new DatabaseService();

