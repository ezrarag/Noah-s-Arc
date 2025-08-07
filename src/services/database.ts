import * as SQLite from "expo-sqlite"

const db = SQLite.openDatabase("learning_app.db")

export const initializeDatabase = () => {
  return new Promise<void>((resolve, reject) => {
    db.transaction(
      (tx) => {
        // Users table
        tx.executeSql(`
          CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            level INTEGER DEFAULT 1,
            points INTEGER DEFAULT 0,
            streak INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          );
        `)

        // Tasks table
        tx.executeSql(`
          CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            target_object TEXT NOT NULL,
            difficulty INTEGER DEFAULT 1,
            points_reward INTEGER DEFAULT 10,
            is_active BOOLEAN DEFAULT 1,
            created_by INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          );
        `)

        // Task completions table
        tx.executeSql(`
          CREATE TABLE IF NOT EXISTS task_completions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            task_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            image_uri TEXT,
            voice_uri TEXT,
            writing_text TEXT,
            completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            points_earned INTEGER DEFAULT 0,
            FOREIGN KEY (task_id) REFERENCES tasks (id),
            FOREIGN KEY (user_id) REFERENCES users (id)
          );
        `)

        // Offline sync queue
        tx.executeSql(`
          CREATE TABLE IF NOT EXISTS sync_queue (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            table_name TEXT NOT NULL,
            record_id INTEGER NOT NULL,
            action TEXT NOT NULL,
            data TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            synced BOOLEAN DEFAULT 0
          );
        `)

        // Insert default tasks
        tx.executeSql(`
          INSERT OR IGNORE INTO tasks (id, title, description, target_object, difficulty, points_reward) VALUES
          (1, 'Find Water', 'Look for something you can drink!', 'water', 1, 10),
          (2, 'Spot a Tree', 'Find a tall plant with leaves!', 'tree', 1, 10),
          (3, 'Discover Food', 'Find something yummy to eat!', 'food', 1, 15),
          (4, 'Find a Book', 'Look for something you can read!', 'book', 2, 20),
          (5, 'Spot an Animal', 'Find a furry or feathered friend!', 'animal', 2, 25);
        `)

        // Insert default user
        tx.executeSql(`
          INSERT OR IGNORE INTO users (id, name, level, points, streak) VALUES
          (1, 'Child', 1, 0, 0);
        `)
      },
      (error) => {
        console.error("Database initialization failed:", error)
        reject(error)
      },
      () => {
        console.log("Database initialized successfully")
        resolve()
      },
    )
  })
}

export const executeQuery = (query: string, params: any[] = []): Promise<any> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        query,
        params,
        (_, result) => resolve(result),
        (_, error) => {
          console.error("Query failed:", error)
          reject(error)
          return false
        },
      )
    })
  })
}

export const getTasks = async (): Promise<any[]> => {
  const result = await executeQuery("SELECT * FROM tasks WHERE is_active = 1 ORDER BY difficulty, created_at")
  return result.rows._array
}

export const getUserProgress = async (userId = 1): Promise<any> => {
  const result = await executeQuery("SELECT * FROM users WHERE id = ?", [userId])
  return result.rows._array[0] || { level: 1, points: 0, streak: 0 }
}

export const saveTaskCompletion = async (completion: {
  taskId: number
  userId: number
  imageUri?: string
  voiceUri?: string
  writingText?: string
  pointsEarned: number
}): Promise<void> => {
  await executeQuery(
    `
    INSERT INTO task_completions (task_id, user_id, image_uri, voice_uri, writing_text, points_earned)
    VALUES (?, ?, ?, ?, ?, ?)
  `,
    [
      completion.taskId,
      completion.userId,
      completion.imageUri || null,
      completion.voiceUri || null,
      completion.writingText || null,
      completion.pointsEarned,
    ],
  )

  // Update user points
  await executeQuery(
    `
    UPDATE users SET 
      points = points + ?,
      level = CASE 
        WHEN (points + ?) >= (level * 100) THEN level + 1
        ELSE level
      END
    WHERE id = ?
  `,
    [completion.pointsEarned, completion.pointsEarned, completion.userId],
  )
}

export default db
