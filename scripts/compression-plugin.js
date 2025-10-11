import { promisify } from 'node:util'
import { brotliCompress, gzip } from 'node:zlib'

const gzipAsync = promisify(gzip)
const brotliAsync = promisify(brotliCompress)

const defaultInclude = [
  /\.(js|mjs|cjs|css|html|json|svg|txt|xml)$/i,
]

const matchPattern = (pattern, value) => {
  if (!pattern) return false
  if (typeof pattern === 'string') return value.includes(pattern)
  if (pattern instanceof RegExp) return pattern.test(value)
  if (typeof pattern === 'function') return Boolean(pattern(value))
  return false
}

const isMatched = (patterns, value) => {
  if (!patterns) return false
  if (!Array.isArray(patterns)) return matchPattern(patterns, value)
  return patterns.some((pattern) => matchPattern(pattern, value))
}

export function compression(options = {}) {
  const {
    algorithm = 'gzip',
    include = defaultInclude,
    exclude = [],
    ext,
    threshold = 1024,
    ...compressionOptions
  } = options

  const compress = algorithm === 'brotliCompress' ? brotliAsync : gzipAsync
  const extension = ext ?? (algorithm === 'brotliCompress' ? '.br' : '.gz')

  return {
    name: `local-compression-${algorithm}`,
    apply: 'build',
    async generateBundle(_outputOptions, bundle) {
      const files = Object.entries(bundle)
      await Promise.all(
        files.map(async ([fileName, output]) => {
          if (isMatched(exclude, fileName)) return
          if (include && !isMatched(include, fileName)) return

          const source = output.type === 'chunk' ? output.code : output.source
          if (!source) return

          const buffer = Buffer.isBuffer(source)
            ? source
            : Buffer.from(source)

          if (buffer.length < threshold) return

          try {
            const compressed = await compress(buffer, compressionOptions)
            this.emitFile({
              type: 'asset',
              fileName: `${fileName}${extension}`,
              source: compressed,
            })
          } catch (error) {
            this.warn(
              `Compression failed for ${fileName} using ${algorithm}: ${error.message}`,
            )
          }
        }),
      )
    },
  }
}
