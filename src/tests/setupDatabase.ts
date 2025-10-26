// tests/setupDatabase.ts
import sequelize from '../database/connection'

beforeAll(async () => {
  await sequelize.sync({ force: true }) // recria o banco
})

afterAll(async () => {
  await sequelize.close()
})
