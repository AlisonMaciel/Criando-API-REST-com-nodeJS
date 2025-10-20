import { expect, test, beforeAll, afterAll, describe } from 'vitest'
import supertest from 'supertest'
import { app } from '../app.ts'

describe('Transactions Routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('O usuário consegue criar uma nova transação', async () => {
    await supertest(app.server)
      .post('/transactions')
      .send({
        title: 'Loja de pizza',
        amount: 1000,
        type: 'credit',
      })
      .expect(201)
  })

  test('O usuário conseguirá listar as transações', async () => {
    const createTransactionsResponse = await supertest(app.server)
      .post('/transactions')
      .send({
        title: 'Loja de pizza',
        amount: 1000,
        type: 'credit',
      })

    const responseCookie = createTransactionsResponse.get('Set-Cookie')

    const cookie = responseCookie ?? ['']
    const checkExistCookie = await supertest(app.server)
      .get('/transactions')
      .set('Cookie', cookie)
    expect(checkExistCookie.body.transactions).toEqual([
      expect.objectContaining({
        title: 'Loja de pizza',
        amount: 1000,
      }),
    ])
  })
})
