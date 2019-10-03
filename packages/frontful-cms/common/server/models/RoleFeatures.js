export default class RoleFeatures {
  constructor(cms) {
    this.cms = cms
    this.sql = this.cms.sql
  }

  get(roleId) {
    return this.sql.connection.query(`
      SELECT jsonState
      FROM roleFeatures
      WHERE roleId = :roleId
    `, {
      replacements: {roleId},
      type: this.sql.connection.QueryTypes.SELECT,
    }).then(([features]) => {
      if (features && features.jsonState) {
        return JSON.parse(features.jsonState)
      }
      return null
    })
  }

  save(roleId, features) {
    return this.sql.connection.query(`
      UPDATE roleFeatures
      SET jsonState = :jsonState
      WHERE roleId = :roleId
      IF @@ROWCOUNT = 0
      INSERT INTO roleFeatures (roleId, jsonState)
      VALUES (:roleId, :jsonState)
    `, {
      replacements: {
        roleId,
        jsonState: JSON.stringify(features, null, 2),
      },
      type: this.sql.connection.QueryTypes.INSERT,
    }).then(() => this.get(roleId))
  }
}
