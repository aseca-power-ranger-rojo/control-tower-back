import { PrismaClient } from '@prisma/client'
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended'
import { beforeEach, jest } from '@jest/globals'
import { db } from '../src/utils'

jest.mock('../src/utils/database', () => {
    const originalModule = jest.requireActual('../src/utils/database')
    return Object.assign({}, originalModule, {
        db: mockDeep<PrismaClient>()
    })
})

beforeEach(() => {
    mockReset(prismaMock)
})

export const prismaMock = db as unknown as DeepMockProxy<PrismaClient>