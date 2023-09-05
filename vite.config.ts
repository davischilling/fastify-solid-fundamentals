/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    include: ['**/*.{test,spec,e2e-spec}.?(c|m)[jt]s?(x)'],
    environment: 'prisma', // Required
    environmentOptions: {
      adapter: 'psql',
      envFile: '.env.test',
      prismaEnvVarName: 'DATABASE_URL', // Optional
    },
    // environmentMatchGlobs: [['./**', 'prisma']],
  },
})
