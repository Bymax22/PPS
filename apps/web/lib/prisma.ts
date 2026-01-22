/* eslint-disable turbo/no-undeclared-env-vars */
import path from 'path'
import fs from 'fs'

type PrismaClientType = new (...args: any[]) => any

let PrismaClientImpl: PrismaClientType | undefined

// Try to load local generated client first
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-assignment
  PrismaClientImpl = require('@prisma/client').PrismaClient
} catch {}

// If local client not available, attempt to load the API package's generated client at runtime
if (!PrismaClientImpl) {
  try {
    const apiClientPath = path.join(process.cwd(), '..', 'api', 'node_modules', '@prisma', 'client')
    if (fs.existsSync(apiClientPath)) {
      // use dynamic require to avoid bundlers statically resolving the path
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      // use eval to further avoid static analysis by webpack
      // eslint-disable-next-line no-eval
      const req: any = eval('require')
      PrismaClientImpl = req(apiClientPath).PrismaClient
    }
  } catch {}
}

const globalForPrisma = globalThis as unknown as { prisma?: InstanceType<PrismaClientType> }

let prismaInstance: InstanceType<PrismaClientType> | null = null

if (PrismaClientImpl) {
  prismaInstance = globalForPrisma.prisma ?? new PrismaClientImpl()
  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prismaInstance
} else {
  // runtime proxy that throws helpful error when used
  const proxy = new Proxy({}, {
    get() {
      throw new Error('@prisma/client not found. Generate the client in the workspace (e.g. run `npx prisma generate` in apps/api) or install a generated client in this package.')
    }
  }) as unknown as InstanceType<PrismaClientType>
  prismaInstance = proxy
}

export const prisma = prismaInstance