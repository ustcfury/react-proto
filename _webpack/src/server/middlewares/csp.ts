import { randomUUID } from 'node:crypto'
import { IS_DEV } from '_webpack/constants'
import type { NextFunction, Request, Response } from 'express'
import helmet from 'helmet'

const nonce = (_req: Request, res: Response, next: NextFunction): void => {
  res.locals.cspNonce = Buffer.from(randomUUID()).toString('base64')
  next()
}

const csp = (req: Request, res: Response, next: NextFunction) => {
  const middleware = helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        defaultSrc: ["'self'", 'pokeapi.co', 'localhost:*'],
        imgSrc: ["'self'", 'raw.githubusercontent.com'],
        scriptSrc: [
          "'self'",
          `'nonce-${String(res.locals.cspNonce)}'`,
          IS_DEV ? "'unsafe-eval'" : '',
        ],
      },
    },
    crossOriginEmbedderPolicy: { policy: 'credentialless' },
    noSniff: false,
    originAgentCluster: false,
  })

  return middleware(req, res, next)
}

export { nonce, csp }
