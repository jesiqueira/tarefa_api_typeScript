// src/__tests__/helpers/httpHelpers.ts
import type { Request, Response } from 'express'
import type { IAuthRequest } from '../../middlewares/interfaces/IAuthRequest'

export const criarMockRequest = (overrides?: Partial<Request>): Request =>
  ({
    body: {},
    params: {},
    query: {},
    headers: {},
    ...overrides,
  }) as Request

export const criarMockResponse = (): Response => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
    sendStatus: jest.fn().mockReturnThis(),
  }
  return res as unknown as Response
}

export const criarMockAuthRequest = (usuarioId: number, email: string, overrides?: Partial<Request>): IAuthRequest =>
  ({
    body: {},
    params: {},
    query: {},
    headers: {},
    usuario: { id: usuarioId, email },
    ...overrides,
  }) as IAuthRequest
