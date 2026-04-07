import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getSites, addSite, removeSite, updateSite, startIndexing, Site } from "@/lib/store";
import { Plus, Trash2, RefreshCw, Globe, ExternalLink, Search, Edit, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const statusLabels: Record<string, string> = {
  indexed: 'Проиндексирован',
  indexing: 'Индексация...',
  pending: 'Ожидание',
  error: 'Ошибка',
};

const statusColors: Record<string, string> = {
  indexed: 'bg-success/10 text-success border-success/20',
  indexing: 'bg-info/10 text-info border-info/20',
  pending: 'bg-muted text-muted-foreground',
  error: 'bg-destructive/10 text-destructive border-destructive/20',
};

export default function Sites() {
  const [sites, setSites] = useState<Site[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [addOpen, setAddOpen] = useState(false);
  const [editSite, setEditSite] = useState<Site | null>(null);
  const [newUrl, setNewUrl] = useState("");
  const [newTitle, setNewTitle] = useState("");
  

  const reload = () => setSites(getSites());

  useEffect(() => {
    reload();
    const interval = setInterval(reload, 2000);
    return () => clearInterval(interval);
  }, []);

  const filtered = sites.filter(s => {
    const matchSearch = s.title.toLowerCase().includes(search.toLowerCase()) || s.url.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || s.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleAdd = () => {
    if (!newUrl.trim()) return;
    addSite(newUrl.trim(), newTitle.trim() || newUrl.trim());
    setNewUrl("");
    setNewTitle("");
    setAddOpen(false);
    reload();
    toast.success("Сайт успешно добавлен в базу данных");
  };

  const handleDelete = (id: string) => {
    removeSite(id);
    reload();
    toast.success("Сайт был удалён из базы данных");
  };

  const handleIndex = (id: string) => {
    startIndexing(id);
    reload();
    toast.success("Начата индексация сайта");
  };

  const handleToggleAutoReindex = (id: string, checked: boolean) => {
    updateSite(id, { autoReindex: checked });
    reload();
  };

  const handleEditSave = () => {
    if (!editSite) return;
    updateSite(editSite.id, { title: editSite.title, url: editSite.url, reindexInterval: editSite.reindexInterval });
    setEditSite(null);
    reload();
    toast.success("Данные сайта обновлены");
  };

  return (
    <DashboardLayout title="Управление сайтами">
      <div className="space-y-6">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex gap-3 flex-1 w-full sm:w-auto">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Поиск сайтов..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Все статусы" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                <SelectItem value="indexed">Проиндексирован</SelectItem>
                <SelectItem value="indexing">Индексация</SelectItem>
                <SelectItem value="pending">Ожидание</SelectItem>
                <SelectItem value="error">Ошибка</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" /> Добавить сайт</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Добавить новый сайт</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label>URL сайта</Label>
                  <Input placeholder="https://example.com" value={newUrl} onChange={e => setNewUrl(e.target.value)} />
                </div>
                <div>
                  <Label>Название</Label>
                  <Input placeholder="Мой сайт" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAddOpen(false)}>Отмена</Button>
                <Button onClick={handleAdd}>Добавить</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Sites List */}
        <div className="grid gap-4">
          {filtered.map(site => (
            <Card key={site.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Globe className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium truncate">{site.title}</p>
                      <p className="text-sm text-muted-foreground truncate">{site.url}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 flex-wrap">
                    <Badge variant="outline" className={statusColors[site.status]}>
                      {statusLabels[site.status]}
                    </Badge>

                    {site.status === 'indexing' && (
                      <div className="text-sm text-muted-foreground">
                        {site.pagesIndexed}/{site.totalPages} стр.
                      </div>
                    )}

                    {site.status === 'indexed' && (
                      <div className="text-sm text-muted-foreground">
                        {site.pagesIndexed} стр.
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <Label className="text-xs text-muted-foreground">Авто</Label>
                      <Switch checked={site.autoReindex} onCheckedChange={c => handleToggleAutoReindex(site.id, c)} />
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleIndex(site.id)}>
                          <RefreshCw className="h-4 w-4 mr-2" /> Индексировать
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setEditSite({ ...site })}>
                          <Edit className="h-4 w-4 mr-2" /> Редактировать
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => window.open(site.url, '_blank')}>
                          <ExternalLink className="h-4 w-4 mr-2" /> Открыть сайт
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(site.id)} className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" /> Удалить
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {site.status === 'indexing' && (
                  <div className="mt-3">
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-500"
                        style={{ width: `${(site.pagesIndexed / site.totalPages) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {filtered.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center text-muted-foreground">
                Сайты не найдены
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editSite} onOpenChange={o => !o && setEditSite(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редактировать сайт</DialogTitle>
          </DialogHeader>
          {editSite && (
            <div className="space-y-4 py-4">
              <div>
                <Label>URL</Label>
                <Input value={editSite.url} onChange={e => setEditSite({ ...editSite, url: e.target.value })} />
              </div>
              <div>
                <Label>Название</Label>
                <Input value={editSite.title} onChange={e => setEditSite({ ...editSite, title: e.target.value })} />
              </div>
              <div>
                <Label>Интервал переиндексации (часы)</Label>
                <Input type="number" value={editSite.reindexInterval} onChange={e => setEditSite({ ...editSite, reindexInterval: parseInt(e.target.value) || 24 })} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditSite(null)}>Отмена</Button>
            <Button onClick={handleEditSave}>Сохранить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
