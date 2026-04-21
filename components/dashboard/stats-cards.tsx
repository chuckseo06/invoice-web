import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MOCK_STATS } from "@/lib/constants"
import { TrendingUp, TrendingDown } from "lucide-react"

export function StatsCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {MOCK_STATS.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title}>
            <CardHeader className="flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              {Icon && <Icon className="size-4 text-muted-foreground" />}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="mt-2 flex items-center gap-2">
                {stat.trend === "up" ? (
                  <>
                    <TrendingUp className="size-4 text-green-600 dark:text-green-400" />
                    <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      {stat.change}
                    </Badge>
                  </>
                ) : stat.trend === "down" ? (
                  <>
                    <TrendingDown className="size-4 text-red-600 dark:text-red-400" />
                    <Badge variant="secondary" className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                      {stat.change}
                    </Badge>
                  </>
                ) : (
                  <Badge variant="secondary">{stat.change}</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
