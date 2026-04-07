import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getSites, getSearchQueries } from "@/lib/store";
import { Database, Table, HardDrive, Download, Trash2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Table as UITable, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function DatabasePage() {
  const sites = getSites();
  const queries = getSearchQueries();
  const [refreshKey, setRefreshKey] = useState(0);

  const dbStats = {
    tables: 4,
    totalRecords: sites.length + queries.length + 150,
    storageUsed: '24.5 МБ',
    lastBackup: '07 апр 2026, 03:00',
  };

  const handleExport = () => {
    const data = JSON.stringify({ sites, queries }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'webindex-export.json';
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Данные экспортированы в JSON");
  };

  const handleClearQueries = () => {
    localStorage.removeItem('webindex_queries');
    setRefreshKey(k => k + 1);
    toast.success("История запросов очищена");
  };

  const handleOptimize = () => {
    toast.success("База данных оптимизирована");
  };

  return (
    <DashboardLayout title="База данных">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Database className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{dbStats.tables}</p>
              <p className="text-sm text-muted-foreground">Таблицы</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Table className="h-8 w-8 mx-auto mb-2 text-success" />
              <p className="text-2xl font-bold">{dbStats.totalRecords}</p>
              <p className="text-sm text-muted-foreground">Записи</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <HardDrive className="h-8 w-8 mx-auto mb-2 text-warning" />
              <p className="text-2xl font-bold">{dbStats.storageUsed}</p>
              <p className="text-sm text-muted-foreground">Объём</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <RefreshCw className="h-8 w-8 mx-auto mb-2 text-info" />
              <p className="text-sm font-bold">{dbStats.lastBackup}</p>
              <p className="text-sm text-muted-foreground">Последний бэкап</p>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <Button onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" /> Экспорт данных
          </Button>
          <Button variant="outline" onClick={handleOptimize}>
            <RefreshCw className="h-4 w-4 mr-2" /> Оптимизировать
          </Button>
          <Button variant="outline" onClick={handleClearQueries}>
            <Trash2 className="h-4 w-4 mr-2" /> Очистить историю
          </Button>
        </div>

        {/* Tables */}
        <Tabs defaultValue="sites">
          <TabsList>
            <TabsTrigger value="sites">Сайты ({sites.length})</TabsTrigger>
            <TabsTrigger value="queries">Запросы ({queries.length})</TabsTrigger>
            <TabsTrigger value="pages">Страницы</TabsTrigger>
            <TabsTrigger value="logs">Логи</TabsTrigger>
          </TabsList>

          <TabsContent value="sites">
            <Card>
              <CardContent className="p-0">
                <UITable>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Название</TableHead>
                      <TableHead>URL</TableHead>
                      <TableHead>Статус</TableHead>
                      <TableHead>Страницы</TableHead>
                      <TableHead>Дата добавления</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sites.map(s => (
                      <TableRow key={s.id}>
                        <TableCell className="font-mono text-xs">{s.id.substring(0, 8)}</TableCell>
                        <TableCell className="font-medium">{s.title}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{s.url}</TableCell>
                        <TableCell><Badge variant="outline">{s.status}</Badge></TableCell>
                        <TableCell>{s.pagesIndexed}</TableCell>
                        <TableCell className="text-sm">{new Date(s.addedAt).toLocaleDateString('ru-RU')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </UITable>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="queries">
            <Card>
              <CardContent className="p-0">
                <UITable>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Запрос</TableHead>
                      <TableHead>Результаты</TableHead>
                      <TableHead>Время</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {queries.slice(0, 20).map(q => (
                      <TableRow key={q.id}>
                        <TableCell className="font-mono text-xs">{q.id.substring(0, 8)}</TableCell>
                        <TableCell className="font-medium">{q.query}</TableCell>
                        <TableCell>{q.results}</TableCell>
                        <TableCell className="text-sm">{new Date(q.timestamp).toLocaleString('ru-RU')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </UITable>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pages">
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                <FileIcon className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p>Таблица страниц содержит {sites.reduce((a, s) => a + s.pagesIndexed, 0)} записей</p>
                <p className="text-xs mt-2">Детальный просмотр доступен через экспорт</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs">
            <Card>
              <CardContent className="p-4 space-y-2">
                {[
                  { time: '10:30', msg: 'Индексация завершена: example.com', type: 'success' },
                  { time: '10:15', msg: 'Начата индексация: shop.example.com', type: 'info' },
                  { time: '09:45', msg: 'Ошибка подключения: news.example.com', type: 'error' },
                  { time: '09:30', msg: 'Добавлен новый сайт: docs.example.com', type: 'info' },
                  { time: '09:00', msg: 'Автоматический бэкап завершён', type: 'success' },
                  { time: '08:30', msg: 'Система запущена', type: 'info' },
                ].map((log, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded text-sm">
                    <span className="text-xs text-muted-foreground font-mono">{log.time}</span>
                    <div className={`h-2 w-2 rounded-full ${log.type === 'success' ? 'bg-success' : log.type === 'error' ? 'bg-destructive' : 'bg-info'}`} />
                    <span>{log.msg}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

function FileIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    </svg>
  );
}
