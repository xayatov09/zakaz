import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { getUser, updateUser } from "@/lib/store";
import { User, Shield, Save, Key, Bell, LogOut } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export default function Account() {
  const navigate = useNavigate();
  const [user, setUser] = useState(getUser());
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [notifications, setNotifications] = useState(true);
  const [emailNotif, setEmailNotif] = useState(true);
  const [passwordDialog, setPasswordDialog] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSave = () => {
    const updated = updateUser({ name, email });
    setUser(updated);
    toast.success("Профиль успешно обновлён");
  };

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword) {
      toast.error("Заполните все поля");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Пароли не совпадают");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Пароль должен быть минимум 6 символов");
      return;
    }
    setPasswordDialog(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    toast.success("Пароль успешно изменён");
  };

  const handleLogout = () => {
    localStorage.removeItem('webindex_user');
    toast.success("Вы вышли из системы");
    setTimeout(() => {
      navigate("/");
      window.location.reload();
    }, 1000);
  };

  return (
    <DashboardLayout title="Аккаунт">
      <div className="space-y-6 max-w-2xl">
        {/* Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-4 w-4" /> Профиль
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-16 w-16 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-xl font-bold">
                {name[0] || 'U'}
              </div>
              <div>
                <p className="font-semibold text-lg">{user.name}</p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    <Shield className="h-3 w-3 mr-1" /> {user.role === 'admin' ? 'Администратор' : 'Пользователь'}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Имя</Label>
                <Input value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div>
                <Label>Email</Label>
                <Input value={email} onChange={e => setEmail(e.target.value)} type="email" />
              </div>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" /> Сохранить изменения
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Bell className="h-4 w-4" /> Уведомления
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Push-уведомления</p>
                <p className="text-xs text-muted-foreground">Уведомления о завершении индексации</p>
              </div>
              <Switch checked={notifications} onCheckedChange={(c) => { setNotifications(c); toast.success(c ? "Push-уведомления включены" : "Push-уведомления отключены"); }} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Email-уведомления</p>
                <p className="text-xs text-muted-foreground">Еженедельный отчёт о состоянии</p>
              </div>
              <Switch checked={emailNotif} onCheckedChange={(c) => { setEmailNotif(c); toast.success(c ? "Email-уведомления включены" : "Email-уведомления отключены"); }} />
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Key className="h-4 w-4" /> Безопасность
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" onClick={() => setPasswordDialog(true)}>
              <Key className="h-4 w-4 mr-2" /> Сменить пароль
            </Button>
            <Separator />
            <Button variant="outline" className="text-destructive" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" /> Выйти из системы
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Password Dialog */}
      <Dialog open={passwordDialog} onOpenChange={setPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Сменить пароль</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Текущий пароль</Label>
              <Input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
            </div>
            <div>
              <Label>Новый пароль</Label>
              <Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
            </div>
            <div>
              <Label>Подтвердите пароль</Label>
              <Input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPasswordDialog(false)}>Отмена</Button>
            <Button onClick={handleChangePassword}>Сменить пароль</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}