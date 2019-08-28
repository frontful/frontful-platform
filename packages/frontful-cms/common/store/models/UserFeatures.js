export default class UserFeatures {
  constructor(store) {
    this.store = store
  }

  get(userId) {
    return this.store.connection.query(`
      SELECT jsonState
      FROM userFeatures
      WHERE userId = :userId
    `, {
      replacements: {userId},
      type: this.store.connection.QueryTypes.SELECT,
    }).then(([features]) => {
      if (features && features.jsonState) {
        return JSON.parse(features.jsonState)
      }
      return null
    })
  }

  save(userId, features) {
    return this.store.connection.query(`
      UPDATE userFeatures
      SET jsonState = :jsonState
      WHERE userId = :userId
      IF @@ROWCOUNT = 0
        INSERT INTO userFeatures
          (userId, jsonState)
        VALUES
          (:userId, :jsonState)
    `, {
      replacements: {
        userId,
        jsonState: JSON.stringify(features, null, 2),
      },
      type: this.store.connection.QueryTypes.INSERT,
    }).then(() => this.get(userId))
  }
}
