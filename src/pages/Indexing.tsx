import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getSites, startIndexing, updateSite, Site } from "@/lib/store";
import { RefreshCw, Play, Pause, CheckCircle, AlertTriangle, Clock, Zap } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

export default function Indexing() {
  const [sites, setSites] = useState<Site[]>([]);

  const reload = () => setSites(getSites());

  useEffect(() => {
    reload();
    const interval = setInterval(reload, 1000);
    return () => clearInterval(interval);
  }, []);

  const indexing = sites.filter(s => s.status === 'indexing');
  const pending = sites.filter(s => s.status === 'pending');
  const indexed = sites.filter(s => s.status === 'indexed');
  const errors = sites.filter(s => s.status === 'error');

  const handleIndexAll = () => {
    pending.forEach(s => startIndexing(s.id));
    reload();
    toast.success(`Запущена индексация ${pending.length} сайтов`);
  };

  const handleReindexAll = () => {
    indexed.forEach(s => startIndexing(s.id));
    reload();
    toast.success(`Запущена переиндексация ${indexed.length} сайтов`);
  };

  const handleRetryErrors = () => {
    errors.forEach(s => startIndexing(s.id));
    reload();
    toast.success(`Повторная индексация ${errors.length} сайтов`);
  };

  return (
    <DashboardLayout title="Индексация">
      <div className="space-y-6">
        {/* Action buttons */}
        <div className="flex flex-wrap gap-3">
          <Button onClick={handleIndexAll} disabled={pending.length === 0}>
            <Play className="h-4 w-4 mr-2" /> Индексировать ожидающие ({pending.length})
          </Button>
          <Button variant="outline" onClick={handleReindexAll} disabled={indexed.length === 0}>
            <RefreshCw className="h-4 w-4 mr-2" /> Переиндексировать все ({indexed.length})
          </Button>
          <Button variant="outline" onClick={handleRetryErrors} disabled={errors.length === 0}>
            <AlertTriangle className="h-4 w-4 mr-2" /> Повторить ошибки ({errors.length})
          </Button>
        </div>

        {/* Active indexing */}
        {indexing.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" /> Активная индексация
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {indexing.map(site => {
                const progress = site.totalPages > 0 ? (site.pagesIndexed / site.totalPages) * 100 : 0;
                return (
                  <div key={site.id} className="space-y-2 p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{site.title}</p>
                        <p className="text-sm text-muted-foreground">{site.url}</p>
                      </div>
                      <span className="text-sm font-medium">{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      {site.pagesIndexed} из {site.totalPages} страниц проиндексировано
                    </p>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        {/* Queue */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4 text-warning" /> Ожидание ({pending.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {pending.map(s => (
                <div key={s.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span className="text-sm truncate">{s.title}</span>
                  <Button size="sm" variant="ghost" onClick={() => { startIndexing(s.id); reload(); }}>
                    <Play className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              {pending.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Нет сайтов в очереди</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" /> Проиндексировано ({indexed.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {indexed.map(s => (
                <div key={s.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="min-w-0">
                    <span className="text-sm truncate block">{s.title}</span>
                    <span className="text-xs text-muted-foreground">{s.pagesIndexed} стр.</span>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => { startIndexing(s.id); reload(); }}>
                    <RefreshCw className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              {indexed.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Нет проиндексированных сайтов</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive" /> Ошибки ({errors.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {errors.map(s => (
                <div key={s.id} className="flex items-center justify-between p-3 rounded-lg bg-destructive/5">
                  <div className="min-w-0">
                    <span className="text-sm truncate block">{s.title}</span>
                    <span className="text-xs text-destructive">Ошибка подключения</span>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => { startIndexing(s.id); reload(); }}>
                    <RefreshCw className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              {errors.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Нет ошибок</p>}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
