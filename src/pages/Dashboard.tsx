import { DashboardLayout } from "@/components/DashboardLayout";
import { StatCard } from "@/components/StatCard";
import { Globe, FileText, Search, AlertTriangle, RefreshCw, CheckCircle, TrendingUp, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getStats, getSites, getSearchQueries } from "@/lib/store";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

const statusLabels: Record<string, string> = {
  indexed: 'Проиндексирован',
  indexing: 'Индексация',
  pending: 'Ожидание',
  error: 'Ошибка',
};

const statusColors: Record<string, string> = {
  indexed: 'bg-success/10 text-success border-success/20',
  indexing: 'bg-info/10 text-info border-info/20',
  pending: 'bg-muted text-muted-foreground',
  error: 'bg-destructive/10 text-destructive border-destructive/20',
};

const CHART_COLORS = ['hsl(221, 83%, 53%)', 'hsl(142, 71%, 45%)', 'hsl(38, 92%, 50%)', 'hsl(0, 84%, 60%)'];

export default function Dashboard() {
  const [stats, setStats] = useState(getStats());
  const [sites, setSites] = useState(getSites());
  const [queries, setQueries] = useState(getSearchQueries());

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(getStats());
      setSites(getSites());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const queryChartData = queries.slice(0, 7).reverse().map((q, i) => ({
    name: `${i + 1}ч назад`,
    запросы: q.results,
  }));

  const pieData = [
    { name: 'Проиндексировано', value: stats.indexedSites },
    { name: 'Индексация', value: stats.indexingSites },
    { name: 'Ожидание', value: stats.totalSites - stats.indexedSites - stats.indexingSites - stats.errorSites },
    { name: 'Ошибки', value: stats.errorSites },
  ].filter(d => d.value > 0);

  const pagesChartData = sites.map(s => ({
    name: s.title.substring(0, 12),
    страницы: s.pagesIndexed,
  }));

  return (
    <DashboardLayout title="Панель управления">
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Всего сайтов" value={stats.totalSites} icon={Globe} variant="primary" trend={{ value: 12, positive: true }} />
          <StatCard title="Проиндексировано" value={stats.indexedSites} icon={CheckCircle} variant="success" description={`${stats.totalPages} страниц`} />
          <StatCard title="Запросы" value={stats.totalQueries} icon={Search} variant="default" trend={{ value: 8, positive: true }} />
          <StatCard title="Ошибки" value={stats.errorSites} icon={AlertTriangle} variant="destructive" />
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Активность поиска</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={queryChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(215, 16%, 47%)" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(215, 16%, 47%)" />
                  <Tooltip />
                  <Line type="monotone" dataKey="запросы" stroke="hsl(221, 83%, 53%)" strokeWidth={2} dot={{ fill: 'hsl(221, 83%, 53%)' }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Статус сайтов</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-2 mt-2 justify-center">
                {pieData.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-1 text-xs">
                    <div className="h-2 w-2 rounded-full" style={{ background: CHART_COLORS[i] }} />
                    <span className="text-muted-foreground">{d.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pages Chart + Recent */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Страницы по сайтам</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={pagesChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(215, 16%, 47%)" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(215, 16%, 47%)" />
                  <Tooltip />
                  <Bar dataKey="страницы" fill="hsl(221, 83%, 53%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Последние сайты</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sites.slice(0, 5).map(site => (
                  <div key={site.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{site.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{site.url}</p>
                    </div>
                    <Badge variant="outline" className={statusColors[site.status]}>
                      {statusLabels[site.status]}
                    </Badge>
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
