import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2, LogOut, Package, MessageSquare, Users, ClipboardList } from 'lucide-react';

interface Order {
  id: string;
  session_id: string;
  package_type: string[];
  phone_number: string;
  address: string;
  payment_method: string;
  status: string;
  created_at: string;
}

interface Session {
  id: string;
  user_name: string;
  selected_problems: string[];
  created_at: string;
  updated_at: string;
}

interface Consultation {
  id: string;
  session_id: string;
  content: string;
  role: string;
  created_at: string;
}

const Admin = () => {
  const { user, isAdmin, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchData();
    }
  }, [user, isAdmin]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordersRes, sessionsRes, consultationsRes] = await Promise.all([
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
        supabase.from('funnel_sessions').select('*').order('created_at', { ascending: false }),
        supabase.from('consultation_messages').select('*').order('created_at', { ascending: false }),
      ]);

      if (ordersRes.data) setOrders(ordersRes.data);
      if (sessionsRes.data) setSessions(sessionsRes.data);
      if (consultationsRes.data) setConsultations(consultationsRes.data);
    } catch (error) {
      toast.error('خطا در دریافت اطلاعات');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (error) {
      toast.error('خطا در بروزرسانی وضعیت');
    } else {
      toast.success('وضعیت سفارش بروزرسانی شد');
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      pending: { label: 'در انتظار', variant: 'secondary' },
      processing: { label: 'در حال پردازش', variant: 'default' },
      shipped: { label: 'ارسال شده', variant: 'outline' },
      delivered: { label: 'تحویل داده شده', variant: 'default' },
      cancelled: { label: 'لغو شده', variant: 'destructive' },
    };
    const { label, variant } = statusMap[status] || { label: status, variant: 'secondary' as const };
    return <Badge variant={variant}>{label}</Badge>;
  };

  const problemLabels: Record<string, string> = {
    joint_pain: 'درد مفاصل',
    muscle_pain: 'درد عضلانی',
    back_pain: 'کمردرد',
    neck_pain: 'گردن درد',
    knee_pain: 'زانو درد',
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4" dir="rtl">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-lg text-muted-foreground mb-4">
              شما دسترسی به پنل مدیریت ندارید.
            </p>
            <Button onClick={() => navigate('/')}>
              بازگشت به صفحه اصلی
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">پنل مدیریت</h1>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 ml-2" />
            خروج
          </Button>
        </div>
      </header>

      {/* Stats */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Package className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{orders.length}</p>
                  <p className="text-sm text-muted-foreground">سفارشات</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{sessions.length}</p>
                  <p className="text-sm text-muted-foreground">کاربران</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{consultations.length}</p>
                  <p className="text-sm text-muted-foreground">پیام‌ها</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <ClipboardList className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">
                    {orders.filter(o => o.status === 'pending').length}
                  </p>
                  <p className="text-sm text-muted-foreground">در انتظار</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="orders">سفارشات</TabsTrigger>
            <TabsTrigger value="sessions">کاربران</TabsTrigger>
            <TabsTrigger value="consultations">مشاوره‌ها</TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>لیست سفارشات</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>تاریخ</TableHead>
                        <TableHead>بسته</TableHead>
                        <TableHead>تلفن</TableHead>
                        <TableHead>آدرس</TableHead>
                        <TableHead>پرداخت</TableHead>
                        <TableHead>وضعیت</TableHead>
                        <TableHead>عملیات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="whitespace-nowrap">
                            {formatDate(order.created_at)}
                          </TableCell>
                          <TableCell>{order.package_type.join(', ')}</TableCell>
                          <TableCell dir="ltr">{order.phone_number}</TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            {order.address}
                          </TableCell>
                          <TableCell>
                            {order.payment_method === 'cash_on_delivery' ? 'پرداخت درب منزل' : order.payment_method}
                          </TableCell>
                          <TableCell>{getStatusBadge(order.status)}</TableCell>
                          <TableCell>
                            <Select
                              value={order.status}
                              onValueChange={(value) => updateOrderStatus(order.id, value)}
                            >
                              <SelectTrigger className="w-[140px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">در انتظار</SelectItem>
                                <SelectItem value="processing">در حال پردازش</SelectItem>
                                <SelectItem value="shipped">ارسال شده</SelectItem>
                                <SelectItem value="delivered">تحویل داده شده</SelectItem>
                                <SelectItem value="cancelled">لغو شده</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                      {orders.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                            سفارشی یافت نشد
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sessions">
            <Card>
              <CardHeader>
                <CardTitle>لیست کاربران</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>نام</TableHead>
                        <TableHead>مشکلات انتخاب شده</TableHead>
                        <TableHead>تاریخ ثبت</TableHead>
                        <TableHead>آخرین بروزرسانی</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sessions.map((session) => (
                        <TableRow key={session.id}>
                          <TableCell className="font-medium">{session.user_name}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {session.selected_problems.map((problem) => (
                                <Badge key={problem} variant="outline">
                                  {problemLabels[problem] || problem}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {formatDate(session.created_at)}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {formatDate(session.updated_at)}
                          </TableCell>
                        </TableRow>
                      ))}
                      {sessions.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                            کاربری یافت نشد
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="consultations">
            <Card>
              <CardHeader>
                <CardTitle>پیام‌های مشاوره</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>تاریخ</TableHead>
                        <TableHead>نقش</TableHead>
                        <TableHead>پیام</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {consultations.map((msg) => (
                        <TableRow key={msg.id}>
                          <TableCell className="whitespace-nowrap">
                            {formatDate(msg.created_at)}
                          </TableCell>
                          <TableCell>
                            <Badge variant={msg.role === 'user' ? 'secondary' : 'default'}>
                              {msg.role === 'user' ? 'کاربر' : 'دکتر'}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-[400px]">
                            <p className="truncate">{msg.content}</p>
                          </TableCell>
                        </TableRow>
                      ))}
                      {consultations.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                            پیامی یافت نشد
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
