export default class Content {
  constructor(store) {
    this.store = store
  }

  async load() {
    return this.store.connection.query(`
      SELECT [group], [key], [value]
      FROM frontful.[content]
    `, {
      type: this.store.connection.QueryTypes.SELECT,
    })
  }

  async update(entries) {
    if (entries && entries.length) {
      const replacements = []
      const value = (value) => {
        replacements.push(value)
        return '?'
      }
      return this.store.connection.query(`
        DECLARE @updated TABLE (
          [group] varchar(50) NOT NULL,
          [key] varchar(150) NOT NULL,
          [value] nvarchar(max) NULL
        )

        INSERT INTO @updated ([group], [key], [value])
        VALUES
        ${
          entries.map((entrie) => {
            return `(${value(entrie.group)}, ${value(entrie.key)}, ${value(entrie.value)})`
          }).join(',')
        }

        UPDATE frontful.[content]
        SET [value] = updated.[value]
        FROM @updated AS updated
        WHERE frontful.[content].[group] = updated.[group] AND frontful.[content].[key] = updated.[key]

        INSERT INTO frontful.[content]
        SELECT updated.*
        FROM @updated AS updated
        LEFT OUTER JOIN 
        frontful.[content] ON updated.[group] = frontful.[content].[group] AND updated.[key] = frontful.[content].[key]
        WHERE frontful.[content].[key] IS NULL
      `, {
        replacements,
        type: this.store.connection.QueryTypes.SELECT,
      }).then(() => null)
    }
  }
}
