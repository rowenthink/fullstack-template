import { useQuery } from '@tanstack/react-query'
import { api } from './lib/api'
import type { HealthStatus } from './types'

function App() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['health'],
    queryFn: () => api.get<HealthStatus>('/health')
  })

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
          <h2 className="text-lg font-semibold text-destructive">Error</h2>
          <p className="text-sm text-destructive/80">{error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Fullstack Template</h1>
        <p className="text-muted-foreground">
          ASP.NET Core 9 + React 19 + TypeScript
        </p>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">Backend Status</h2>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Status:</span>
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
              {data?.status}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Version:</span>
            <span className="text-sm font-medium">{data?.version}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Timestamp:</span>
            <span className="text-sm font-mono">
              {data?.timestamp ? new Date(data.timestamp).toLocaleString() : '-'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App