// Lazily require @prisma/client to avoid build-time failures when the
// Prisma client hasn't been generated yet. This provides a helpful error
// message at runtime while allowing Next.js to collect page data during build.
let PrismaClient: any = null
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  PrismaClient = require('@prisma/client').PrismaClient
} catch (e) {
  PrismaClient = null
}

declare global {
  // eslint-disable-next-line no-var
  var prisma: any
}

const datasourceUrl = process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/pps'

let _prisma: any
if (PrismaClient) {
  _prisma = global.prisma ?? new PrismaClient({
    datasources: {
      db: { url: datasourceUrl },
    },
  })
  if (process.env.NODE_ENV !== 'production') global.prisma = _prisma
} else {
  // Create a proxy that throws useful error when attempting to use Prisma
  const handler: ProxyHandler<any> = {
    get() {
      throw new Error('Prisma client not generated. Run `npx prisma generate` before building/running the app.')
    },
    apply() {
      throw new Error('Prisma client not generated. Run `npx prisma generate` before building/running the app.')
    },
  }
  _prisma = new Proxy({}, handler)
}

export const prisma = _prisma

export default prisma
