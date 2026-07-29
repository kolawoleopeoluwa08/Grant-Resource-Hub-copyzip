import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useGetStats, getGetStatsQueryKey, useListTestimonials, getListTestimonialsQueryKey } from '@workspace/api-client-react';
import {
  BookOpen,
  Home as HomeIcon,
  Laptop,
  FlaskConical,
  Globe,
  GraduationCap,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import heroImage from '@assets/generated_images/hero-education-campus.jpg';
import communityImage from '@assets/generated_images/community-support.jpg';

const FADE_UP = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
};

const STAGGER = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

function StatCard({ label, value, loading }: { label: string; value: string; loading: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center text-center px-4 first:pl-0 last:pr-0">
      {loading ? (
        <div className="h-10 w-24 bg-muted animate-pulse rounded mb-2" />
      ) : (
        <div className="text-4xl md:text-5xl font-serif font-bold text-primary mb-2">{value}</div>
      )}
      <div className="text-sm md:text-base font-medium text-muted-foreground uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
}

export default function Home() {
  const { data: stats, isLoading: statsLoading } = useGetStats({
    query: { queryKey: getGetStatsQueryKey() },
  });
  const { data: testimonialsData, isLoading: testimonialsLoading } = useListTestimonials({
    query: { queryKey: getListTestimonialsQueryKey() },
  });

  const testimonials = testimonialsData?.slice(0, 3) || [];

  const grantTypes = [
    {
      icon: GraduationCap,
      title: 'Tuition & Enrollment Fees',
      desc: 'Direct funding for tuition, enrollment deposits, and mandatory academic fees so financial hardship never stands between a student and their degree.',
    },
    {
      icon: BookOpen,
      title: 'Textbooks & Academic Supplies',
      desc: 'Grants covering required course textbooks, lab manuals, art supplies, and any academic materials essential to your program of study.',
    },
    {
      icon: HomeIcon,
      title: 'Campus Housing & Meal Plans',
      desc: 'Support for on-campus or near-campus housing costs and meal plan expenses, ensuring students have a stable and nourishing place to live and study.',
    },
    {
      icon: Laptop,
      title: 'Technology & Equipment',
      desc: 'Funding for laptops, tablets, licensed software, and specialized equipment required for coursework, research, or creative projects.',
    },
    {
      icon: FlaskConical,
      title: 'Research & Laboratory Fees',
      desc: 'Covering research program fees, laboratory supply costs, and project-related expenses for students engaged in academic research.',
    },
    {
      icon: Globe,
      title: 'Study Abroad Programs',
      desc: 'Supporting students accepted to international academic programs with travel, visa, program fees, and living cost assistance.',
    },
  ];

  const steps = [
    { title: 'Submit Your Application', desc: 'Complete our secure online form with your academic details, institution, year of study, and a clear description of your financial need.' },
    { title: 'Committee Review', desc: 'Our academic review board evaluates each application carefully, considering academic standing, financial need, and program goals.' },
    { title: 'Approval & Disbursement', desc: 'Approved applicants are notified within 5–7 business days. Funds are disbursed directly to you or your institution as appropriate.' },
    { title: 'Ongoing Support', desc: 'We stay connected with recipients throughout their academic journey and offer guidance on additional resources.' },
  ];

  const formatCount = (n: number) => n.toLocaleString('en-US') + '+';

  return (
    <div className="flex flex-col w-full">
      {/* Hero */}
      <section className="relative min-h-[90dvh] flex items-center pt-20 pb-32 overflow-hidden bg-primary text-primary-foreground">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-primary/75 mix-blend-multiply z-10" />
          <img
            src={heroImage}
            alt="College students on campus"
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className="container relative z-20 mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" animate="visible" variants={FADE_UP} className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/20 text-secondary mb-6 border border-secondary/30">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <span className="text-sm font-semibold tracking-wide uppercase">Student Aid Resource Program</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold font-serif leading-[1.1] mb-4 text-white drop-shadow-sm">
              Hope Foundation
            </h1>
            <p className="text-xl md:text-2xl text-secondary font-semibold mb-4 tracking-wide">
              Student Aid Resource Program
            </p>
            <p className="text-xl text-primary-foreground/90 mb-10 leading-relaxed max-w-2xl font-light">
              Removing financial barriers so every deserving student can access, afford, and complete their education. We fund the next generation of leaders, scholars, and innovators.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/apply">
                <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg font-bold bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-xl">
                  Apply for a Grant
                </Button>
              </Link>
              <Link href="/testimonials">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg font-bold border-white/30 text-white hover:bg-white/10 hover:text-white bg-transparent backdrop-blur-sm">
                  Read Student Stories
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative -mt-16 z-30 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={FADE_UP}
            className="bg-card rounded-2xl shadow-2xl p-8 md:p-12 border border-border"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-border/50">
              <StatCard
                label="Total Applications"
                value={stats ? formatCount(stats.totalApplications) : '2,480+'}
                loading={statsLoading}
              />
              <StatCard
                label="Approved Grants"
                value={stats ? formatCount(stats.approvedApplications) : '1,860+'}
                loading={statsLoading}
              />
              <StatCard
                label="Lives Impacted"
                value={stats ? formatCount(stats.livesImpacted) : '1,860+'}
                loading={statsLoading}
              />
              <StatCard
                label="Funds Disbursed"
                value={stats ? `$${(stats.totalDisbursed / 1_000_000).toFixed(1)}M+` : '$7.8M+'}
                loading={statsLoading}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Grant Categories */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold font-serif text-foreground mb-6">
              What We Fund
            </h2>
            <p className="text-lg text-muted-foreground">
              The Hope Foundation Student Aid Resource Program provides targeted educational grants across six categories, designed to cover every dimension of the cost of higher education.
            </p>
          </div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={STAGGER}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {grantTypes.map((type, i) => (
              <motion.div
                key={i}
                variants={FADE_UP}
                className="group p-8 rounded-2xl bg-card border border-border hover:border-secondary/50 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-150" />
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <type.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-bold font-serif text-foreground mb-3">{type.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{type.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/3 h-[120%] opacity-20 hidden lg:block">
          <img src={communityImage} alt="Students on campus" className="w-full h-full object-cover grayscale-[30%] mix-blend-overlay rounded-l-[100px]" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-bold font-serif text-white mb-6">
              A Simple, Transparent Process
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-12">
              We built our application process to be straightforward and respectful of your time. From submission to funding, we aim to make it as smooth as possible.
            </p>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={STAGGER}
              className="space-y-8"
            >
              {steps.map((step, i) => (
                <motion.div key={i} variants={FADE_UP} className="flex gap-6">
                  <div className="flex-shrink-0 flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold text-lg">
                      {i + 1}
                    </div>
                    {i !== steps.length - 1 && <div className="w-0.5 h-16 bg-secondary/30 mt-4" />}
                  </div>
                  <div className="pt-1">
                    <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-primary-foreground/70">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            <div className="mt-12">
              <Link href="/apply">
                <Button size="lg" className="h-14 px-8 text-lg font-bold bg-secondary text-secondary-foreground hover:bg-secondary/90">
                  Begin Your Application
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Voices of Hope */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-bold font-serif text-foreground mb-6">
                Voices of Hope
              </h2>
              <p className="text-lg text-muted-foreground">
                Real stories from students across America whose academic journeys were transformed by Hope Foundation support.
              </p>
            </div>
            <Link href="/testimonials" className="group flex items-center gap-2 text-primary font-semibold hover:text-secondary transition-colors whitespace-nowrap">
              Read all stories <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={STAGGER}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {testimonialsLoading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="bg-card p-8 rounded-2xl border border-border h-64 animate-pulse" />
              ))
            ) : testimonials.length > 0 ? (
              testimonials.map((t) => (
                <motion.div key={t.id} variants={FADE_UP} className="bg-card p-8 rounded-2xl border border-border shadow-sm flex flex-col">
                  <div className="flex text-secondary mb-4">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <svg key={j} className={`w-5 h-5 ${j < t.rating ? 'fill-current' : 'text-muted/50 fill-current'}`} viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <blockquote className="text-foreground/80 italic mb-6 flex-grow">
                    "{t.message.length > 160 ? t.message.substring(0, 160) + '...' : t.message}"
                  </blockquote>
                  <div className="flex items-center gap-4 mt-auto">
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                      {t.avatarInitials || t.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-foreground">{t.name}</div>
                      <div className="text-sm text-muted-foreground">{t.location}</div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-3 text-center py-12 text-muted-foreground">
                No stories available yet.
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-card border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <GraduationCap className="h-16 w-16 text-secondary mx-auto mb-8" />
          <h2 className="text-4xl md:text-6xl font-bold font-serif text-foreground mb-6">
            Your Education Deserves Support
          </h2>
          <p className="text-xl text-muted-foreground mb-10">
            Financial hardship should never be the reason a promising student leaves school. Apply today and let Hope Foundation help you stay on the path to your degree.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/apply">
              <Button size="lg" className="w-full sm:w-auto h-14 px-10 text-lg font-bold">
                Start Your Application
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-10 text-lg font-bold border-primary text-primary hover:bg-primary/5">
                Ask Us a Question
              </Button>
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Secure & Confidential</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> No Application Fee</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Decision in 5–7 Days</span>
          </div>
        </div>
      </section>
    </div>
  );
}
