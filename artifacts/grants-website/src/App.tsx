import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { Layout } from '@/components/layout/layout';

// Pages
import Home from '@/pages/home';
import Apply from '@/pages/apply';
import Testimonials from '@/pages/testimonials';
import Contact from '@/pages/contact';
import NotFound from '@/pages/not-found';

// Admin pages (no Layout wrapper)
import AdminLogin from '@/pages/admin/login';
import AdminDashboard from '@/pages/admin/dashboard';

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      {/* Admin routes — no navbar/footer */}
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin">
        {() => { window.location.replace(window.location.pathname.replace(/\/admin$/, '/admin/login')); return null; }}
      </Route>

      {/* Public routes — with Layout */}
      <Route>
        <Layout>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/apply" component={Apply} />
            <Route path="/testimonials" component={Testimonials} />
            <Route path="/contact" component={Contact} />
            <Route component={NotFound} />
          </Switch>
        </Layout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
