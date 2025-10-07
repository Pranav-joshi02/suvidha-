import { worker } from './browser'

export const enableMocking = async () => {
  if (process.env.NODE_ENV !== 'development') {
    return
  }

  return worker.start({
    onUnhandledRequest: 'bypass',
  })
}