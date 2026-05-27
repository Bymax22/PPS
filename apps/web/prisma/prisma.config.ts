const datasourceUrl =
  process.env.DATABASE_URL ||
  'postgresql://user:password@localhost:5432/pps'

export default datasourceUrl
