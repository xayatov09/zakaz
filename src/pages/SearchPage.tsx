import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { addSearchQuery, getSearchQueries, getSites, SearchQuery } from "@/lib/store";
import { Search, Clock, TrendingUp, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ title: string; url: string; snippet: string; relevance: number }[]>([]);
  const [searchHistory, setSearchHistory] = useState(getSearchQueries());
  const [searched, setSearched] = useState(false);
  const [lastQuery, setLastQuery] = useState("");

  const doSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setQuery(searchQuery);
    setLastQuery(searchQuery.trim());
    addSearchQuery(searchQuery.trim());
    setSearchHistory(getSearchQueries());

    const sites = getSites().filter(s => s.status === 'indexed');
    const mockResults = sites.flatMap(site => {
      const count = Math.floor(Math.random() * 3) + 1;
      return Array.from({ length: count }, (_, i) => ({
        title: `${site.title} — Страница ${i + 1}: ${searchQuery}`,
        url: `${site.url}/page-${Math.floor(Math.random() * 100)}`,
        snippet: `Найдено совпадение по запросу "${searchQuery}" на сайте ${site.title}. Содержание страницы включает релевантную информацию по данной теме...`,
        relevance: Math.round(Math.random() * 40 + 60),
      }));
    }).sort((a, b) => b.relevance - a.relevance);

    setResults(mockResults);
    setSearched(true);
  };

  const handleClearHistory = () => {
    localStorage.removeItem('webindex_queries');
    setSearchHistory([]);
    toast.success("История поиска очищена");
  };

  const popularQueries = ['индексация сайтов', 'SEO оптимизация', 'веб-разработка', 'API интеграция', 'база данных'];

  return (
    <DashboardLayout title="Поиск">
      <div className="space-y-6 max-w-4xl mx-auto">
        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Введите поисковый запрос..."
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && doSearch(query)}
                  className="pl-10 h-12 text-base"
                />
              </div>
              <Button onClick={() => doSearch(query)} className="h-12 px-8">Найти</Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {popularQueries.map(q => (
                <Button key={q} variant="outline" size="sm" onClick={() => doSearch(q)} className="text-xs">
                  <TrendingUp className="h-3 w-3 mr-1" /> {q}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {searched && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Найдено {results.length} результатов по запросу «{lastQuery}»
            </p>
            {results.map((r, i) => (
              <Card key={i} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.open(r.url, '_blank')}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 space-y-1">
                      <p className="text-sm text-primary truncate">{r.url}</p>
                      <p className="font-medium">{r.title}</p>
                      <p className="text-sm text-muted-foreground line-clamp-2">{r.snippet}</p>
                    </div>
                    <Badge variant="outline" className="shrink-0">{r.relevance}%</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
            {results.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center text-muted-foreground">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p>Ничего не найдено по запросу «{lastQuery}»</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4" /> История поиска
              </CardTitle>
              {searchHistory.length > 0 && (
                <Button variant="ghost" size="sm" onClick={handleClearHistory}>
                  <Trash2 className="h-4 w-4 mr-1" /> Очистить
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {searchHistory.slice(0, 10).map(q => (
                <div
                  key={q.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => doSearch(q.query)}
                >
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{q.query}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="text-xs">{q.results} рез.</Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(q.timestamp).toLocaleString('ru-RU', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                </div>
              ))}
              {searchHistory.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">История поиска пуста</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}