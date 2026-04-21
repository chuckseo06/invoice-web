import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FEATURES } from "@/lib/constants"

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 md:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            강력한 기능들
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            프로덕션 환경에서 필요한 모든 기능을 갖추고 있습니다.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => {
            const Icon = feature.icon
            return (
              <Card key={feature.title} className="transition-all hover:shadow-lg">
                <CardHeader>
                  <Icon className="size-8 text-primary mb-2" />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
