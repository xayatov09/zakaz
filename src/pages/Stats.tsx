import { DashboardLayout } from "@/components/DashboardLayout";
import { StatCard } from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getStats, getSites, getSearchQueries } from "@/lib/store";
import { Globe, FileText, Search, TrendingUp, Clock, CheckCircle, Database, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";

export default function Stats() {
  const stats = getStats();
  const sites = getSites();
  const queries = getSearchQueries();

  const hourlyData = Array.from({ length: 24 }, (_, i) => ({
    час: `${i}:00`,
    запросы: Math.floor(Math.random() * 30) + 5,
    результаты: Math.floor(Math.random() * 200) + 20,
  }));

  const dailyData = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(day => ({
    день: day,
    сайты: Math.floor(Math.random() * 5) + 1,
    страницы: Math.floor(Math.random() * 100) + 20,
  }));

  const radarData = [
    { metric: 'Скорость', value: 85 },
    { metric: 'Покрытие', value: 72 },
    { metric: 'Точность', value: 91 },
    { metric: 'Доступность', value: 95 },
    { metric: 'Актуальность', value: 68 },
    { metric: 'Релевантность', value: 88 },
  ];

  return (
    <DashboardLayout title="Статистика">
      <div className="space-y-6">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Всего сайтов" value={stats.totalSites} icon={Globe} variant="primary" />
          <StatCard title="Всего страниц" value={stats.totalPages} icon={FileText} variant="success" />
          <StatCard title="Поисковых запросов" value={stats.totalQueries} icon={Search} variant="default" trend={{ value: 15, positive: true }} />
          <StatCard title="Ср. результатов" value={stats.avgResults} icon={TrendingUp} variant="warning" />
        </div>

        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Запросы по часам</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                  <XAxis dataKey="час" tick={{ fontSize: 10 }} stroke="hsl(215, 16%, 47%)" interval={3} />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(215, 16%, 47%)" />
                  <Tooltip />
                  <Area type="monotone" dataKey="запросы" stroke="hsl(221, 83%, 53%)" fill="hsl(221, 83%, 53%)" fillOpacity={0.15} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Активность по дням</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                  <XAxis dataKey="день" tick={{ fontSize: 12 }} stroke="hsl(215, 16%, 47%)" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(215, 16%, 47%)" />
                  <Tooltip />
                  <Bar dataKey="страницы" fill="hsl(221, 83%, 53%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="сайты" fill="hsl(142, 71%, 45%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Качество индексации</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="hsl(214, 32%, 91%)" />
                  <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} stroke="hsl(215, 16%, 47%)" />
                  <PolarRadiusAxis tick={{ fontSize: 10 }} stroke="hsl(215, 16%, 47%)" />
                  <Radar name="Показатель" dataKey="value" stroke="hsl(221, 83%, 53%)" fill="hsl(221, 83%, 53%)" fillOpacity={0.2} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Топ поисковых запросов</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {queries.slice(0, 8).map((q, i) => (
                  <div key={q.id} className="flex items-center gap-3">
                    <span className="text-sm font-medium text-muted-foreground w-6">{i + 1}.</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">{q.query}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{q.results} рез.</span>
                      <div className="h-2 w-16 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${q.results}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}