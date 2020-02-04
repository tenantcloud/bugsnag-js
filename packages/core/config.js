const { filter, reduce, keys, isArray, includes } = require('./lib/es-utils')
const { intRange, stringWithLength, listOfFunctions } = require('./lib/validators')

const BREADCRUMB_TYPES = ['navigation', 'request', 'process', 'log', 'user', 'state', 'error', 'manual']
const defaultErrorTypes = { unhandledExceptions: true, unhandledRejections: true }

module.exports.schema = {
  apiKey: {
    defaultValue: () => null,
    message: 'is required',
    validate: stringWithLength
  },
  appVersion: {
    defaultValue: () => undefined,
    message: 'should be a string',
    validate: value => value === undefined || stringWithLength(value)
  },
  appType: {
    defaultValue: () => undefined,
    message: 'should be a string',
    validate: value => value === undefined || stringWithLength(value)
  },
  autoDetectErrors: {
    defaultValue: () => true,
    message: 'should be true|false',
    validate: value => value === true || value === false
  },
  enabledErrorTypes: {
    defaultValue: (val) => ({ ...defaultErrorTypes, ...val }),
    message: 'should be an object containing the flags { unhandledExceptions:true|false, unhandledRejections:true|false }',
    validate: value => {
      // ensure we have an object
      if (typeof value !== 'object' || !value) return false
      // ensure it only has a subset of the allowed keys
      if (keys(value).sort().join(',') !== keys(defaultErrorTypes).sort().join(',')) return false
      // ensure all of the values are boolean
      if (filter(keys(value), k => typeof value[k] === 'boolean').length === keys.length) return false
      return true
    }
  },
  onError: {
    defaultValue: () => [],
    message: 'should be a function or array of functions',
    validate: listOfFunctions
  },
  onSession: {
    defaultValue: () => [],
    message: 'should be a function or array of functions',
    validate: listOfFunctions
  },
  onBreadcrumb: {
    defaultValue: () => [],
    message: 'should be a function or array of functions',
    validate: listOfFunctions
  },
  endpoints: {
    defaultValue: () => ({
      notify: 'https://notify.bugsnag.com',
      sessions: 'https://sessions.bugsnag.com'
    }),
    message: 'should be an object containing endpoint URLs { notify, sessions }',
    validate: val =>
      // first, ensure it's an object
      (val && typeof val === 'object') &&
      (
        // notify and sessions must always be set
        stringWithLength(val.notify) && stringWithLength(val.sessions)
      ) &&
      // ensure no keys other than notify/session are set on endpoints object
      filter(keys(val), k => !includes(['notify', 'sessions'], k)).length === 0
  },
  autoTrackSessions: {
    defaultValue: val => true,
    message: 'should be true|false',
    validate: val => val === true || val === false
  },
  enabledReleaseStages: {
    defaultValue: () => null,
    message: 'should be an array of strings',
    validate: value => value === null || (isArray(value) && filter(value, f => typeof f === 'string').length === value.length)
  },
  releaseStage: {
    defaultValue: () => 'production',
    message: 'should be a string',
    validate: value => typeof value === 'string' && value.length
  },
  maxBreadcrumbs: {
    defaultValue: () => 25,
    message: 'should be a number ≤100',
    validate: value => intRange(0, 100)(value)
  },
  enabledBreadcrumbTypes: {
    defaultValue: () => BREADCRUMB_TYPES,
    message: `should be null or a list of available breadcrumb types (${BREADCRUMB_TYPES.join(',')})`,
    validate: value => value === null || (isArray(value) && reduce(value, (accum, maybeType) => {
      if (accum === false) return accum
      return includes(BREADCRUMB_TYPES, maybeType)
    }, true))
  },
  context: {
    defaultValue: () => undefined,
    message: 'should be a string',
    validate: value => value === undefined || typeof value === 'string'
  },
  user: {
    defaultValue: () => ({}),
    message: 'should be an object',
    validate: (value) => typeof value === 'object' && value !== null
  },
  metadata: {
    defaultValue: () => ({}),
    message: 'should be an object',
    validate: (value) => typeof value === 'object' && value !== null
  },
  logger: {
    defaultValue: () => undefined,
    message: 'should be null or an object with methods { debug, info, warn, error }',
    validate: value =>
      (!value) ||
      (value && reduce(
        ['debug', 'info', 'warn', 'error'],
        (accum, method) => accum && typeof value[method] === 'function',
        true
      ))
  },
  redactedKeys: {
    defaultValue: () => ['password'],
    message: 'should be an array of strings|regexes',
    validate: value =>
      isArray(value) && value.length === filter(value, s =>
        (typeof s === 'string' || (s && typeof s.test === 'function'))
      ).length
  }
}

module.exports.mergeDefaults = (opts, schema) => {
  if (!opts || !schema) throw new Error('opts and schema objects are required')
  return reduce(keys(schema), (accum, key) => {
    accum[key] = opts[key] !== undefined ? opts[key] : schema[key].defaultValue(opts[key], opts)
    return accum
  }, {})
}

module.exports.validate = (opts, schema) => {
  if (!opts || !schema) throw new Error('opts and schema objects are required')
  const errors = reduce(keys(schema), (accum, key) => {
    if (schema[key].validate(opts[key], opts)) return accum
    return accum.concat({ key, message: schema[key].message, value: opts[key] })
  }, [])
  return { valid: !errors.length, errors }
}
