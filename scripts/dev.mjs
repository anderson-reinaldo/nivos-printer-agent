import { spawn } from 'child_process'
import { createServer } from 'vite'
import electron from 'electron'
import path from 'path'

const server = await createServer({ configFile: 'vite.config.ts' })

spawn(electron, [path.resolve('dist/electron/main.js')], { stdio: 'inherit' }).once('exit', process.exit)

await server.listen()
