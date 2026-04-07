import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Settings, RefreshCw, Search, Shield, Save, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SettingsPage() {
  const [copied, setCopied] = useState(false);
  const [autoIndex, setAutoIndex] = useState(true);
  const [defaultInterval, setDefaultInterval] = useState("24");
  const [maxPages, setMaxPages] = useState("500");
  const [maxDepth, setMaxDepth] = useState("5");
  const [respectRobots, setRespectRobots] = useState(true);
  const [followRedirects, setFollowRedirects] = useState(true);
  const [userAgent, setUserAgent] = useState("WebIndex Bot/1.0");
  const [searchResultsPerPage, setSearchResultsPerPage] = useState("20");
  const [highlightResults, setHighlightResults] = useState(true);
  const [fuzzySearch, setFuzzySearch] = useState(true);
  const [language, setLanguage] = useState("ru");
  const [apiKey, setApiKey] = useState("wi_sk_****************************");
  const [rateLimitEnabled, setRateLimitEnabled] = useState(true);

  const handleSave = () => {
    toast.success("Настройки сохранены", { description: "Все изменения успешно применены" });
  };

  const handleCopyApiKey = async () => {
    try {
      await navigator.clipboard.writeText(apiKey);
      setCopied(true);
      toast.success("API ключ скопирован в буфер обмена");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Не удалось скопировать");
    }
  };

  const handleGenerateKey = () => {
    const newKey = `wi_sk_${Math.random().toString(36).substring(2, 30)}`;
    setApiKey(newKey);
    toast.success("Новый API ключ сгенерирован");
  };

  return (
    <DashboardLayout title="Настройки">
      <div className="space-y-6 max-w-3xl">
        <Tabs defaultValue="indexing">
          <TabsList className="mb-6">
            <TabsTrigger value="indexing"><RefreshCw className="h-3 w-3 mr-1" /> Индексация</TabsTrigger>
            <TabsTrigger value="search"><Search className="h-3 w-3 mr-1" /> Поиск</TabsTrigger>
            <TabsTrigger value="api"><Shield className="h-3 w-3 mr-1" /> API</TabsTrigger>
            <TabsTrigger value="general"><Settings className="h-3 w-3 mr-1" /> Общие</TabsTrigger>
          </TabsList>

          <TabsContent value="indexing">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Параметры индексации</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Автоиндексация</p>
                    <p className="text-xs text-muted-foreground">Автоматически индексировать новые сайты</p>
                  </div>
                  <Switch checked={autoIndex} onCheckedChange={setAutoIndex} />
                </div>
                <Separator />
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                  <div>
                    <Label>Интервал по умолчанию (часы)</Label>
                    <Input type="number" value={defaultInterval} onChange={e => setDefaultInterval(e.target.value)} />
                  </div>
                  <div>
                    <Label>Макс. страниц на сайт</Label>
                    <Input type="number" value={maxPages} onChange={e => setMaxPages(e.target.value)} />
                  </div>
                  <div>
                    <Label>Глубина сканирования</Label>
                    <Input type="number" value={maxDepth} onChange={e => setMaxDepth(e.target.value)} />
                  </div>
                  <div>
                    <Label>User-Agent</Label>
                    <Input value={userAgent} onChange={e => setUserAgent(e.target.value)} />
                  </div>
                </div>
                <Separator />
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Учитывать robots.txt</p>
                      <p className="text-xs text-muted-foreground">Соблюдать правила robots.txt</p>
                    </div>
                    <Switch checked={respectRobots} onCheckedChange={setRespectRobots} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Следовать редиректам</p>
                      <p className="text-xs text-muted-foreground">Автоматически следовать HTTP редиректам</p>
                    </div>
                    <Switch checked={followRedirects} onCheckedChange={setFollowRedirects} />
                  </div>
                </div>
                <Button onClick={handleSave}><Save className="h-4 w-4 mr-2" /> Сохранить</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="search">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Параметры поиска</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Результатов на странице</Label>
                  <Select value={searchResultsPerPage} onValueChange={setSearchResultsPerPage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Подсветка результатов</p>
                    <p className="text-xs text-muted-foreground">Выделять найденные слова</p>
                  </div>
                  <Switch checked={highlightResults} onCheckedChange={setHighlightResults} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Нечёткий поиск</p>
                    <p className="text-xs text-muted-foreground">Искать с учётом опечаток</p>
                  </div>
                  <Switch checked={fuzzySearch} onCheckedChange={setFuzzySearch} />
                </div>
                <Button onClick={handleSave}><Save className="h-4 w-4 mr-2" /> Сохранить</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">API настройки</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>API ключ</Label>
                  <div className="flex gap-2">
                    <Input value={apiKey} readOnly className="font-mono text-sm" />
                    <Button variant="outline" onClick={handleCopyApiKey}>
                      {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                      {copied ? "Скопировано" : "Копировать"}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Используйте этот ключ для доступа к API</p>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Ограничение запросов</p>
                    <p className="text-xs text-muted-foreground">100 запросов в минуту</p>
                  </div>
                  <Switch checked={rateLimitEnabled} onCheckedChange={setRateLimitEnabled} />
                </div>
                <Button variant="outline" onClick={handleGenerateKey}>
                  Сгенерировать новый ключ
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Общие настройки</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Язык интерфейса</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ru">Русский</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="uz">O'zbek</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Separator />
                <div className="space-y-3">
                  <Button variant="destructive" onClick={() => {
                    localStorage.clear();
                    toast.success("Все данные удалены. Перезагрузка...");
                    setTimeout(() => window.location.reload(), 1500);
                  }}>
                    Сбросить все данные
                  </Button>
                  <p className="text-xs text-muted-foreground">Это действие удалит все сохранённые данные</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}