import React from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useGetStats, getGetStatsQueryKey, useListTestimonials, getListTestimonialsQueryKey } from '@workspace/api-client-react';
import { 
  HeartHandshake, 
  BookOpen, 
  Briefcase, 
  Home as HomeIcon, 
  Stethoscope, 
  ShieldCheck, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import heroImage from '@assets/generated_images/hero-helping-hands.jpg';
import communityImage from '@assets/generated_images/community-support.jpg';

const FADE_UP = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
};

const STAGGER = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function Home() {
  const { data: stats, isLoading: statsLoading } = useGetStats({ query: { queryKey: getGetStatsQueryKey() } });
  const { data: testimonialsData, isLoading: testimonialsLoading } = useListTestimonials({ query: { queryKey: getListTestimonialsQueryKey() } });

  const testimonials = testimonialsData?.slice(0, 3) || [];

  const aidTypes = [
    { icon: HeartHandshake, title: 'Emergency Aid', desc: 'Immediate financial assistance for unexpected crises and urgent needs.' },
    { icon: BookOpen, title: 'Education Grants', desc: 'Funding for tuition, books, and educational resources for aspiring students.' },
    { icon: Briefcase, title: 'Business Grants', desc: 'Capital to help small business owners and entrepreneurs build their dreams.' },
    { icon: HomeIcon, title: 'Housing Assistance', desc: 'Support for rent, mortgage, or transitional housing to ensure safe living.' },
    { icon: Stethoscope, title: 'Medical Aid', desc: 'Help with overwhelming medical bills, treatments, and necessary healthcare.' },
    { icon: ShieldCheck, title: 'Community Support', desc: 'Other specialized grants designed to strengthen local communities.' },
  ];

  const steps = [
    { title: 'Submit Application', desc: 'Fill out our secure, comprehensive form detailing your needs.' },
    { title: 'Committee Review', desc: 'Our institutional board carefully evaluates your request.' },
    { title: 'Approval & Funding', desc: 'Upon approval, funds are disbursed directly and securely.' },
    { title: 'Ongoing Support', desc: 'We provide resources to help you thrive beyond the grant.' },
  ];

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative min-h-[90dvh] flex items-center pt-20 pb-32 overflow-hidden bg-primary text-primary-foreground">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-primary/80 mix-blend-multiply z-10" />
          <img 
            src={heroImage} 
            alt="Helping Hands" 
            className="w-full h-full object-cover object-center opacity-40 grayscale-[20%]"
          />
        </div>
        <div className="container relative z-20 mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={FADE_UP}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/20 text-secondary mb-6 border border-secondary/30">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <span className="text-sm font-semibold tracking-wide uppercase">Institutional Care & Support</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold font-serif leading-[1.1] mb-6 text-white drop-shadow-sm">
              Empowering Lives Through Financial Trust
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 mb-10 leading-relaxed max-w-2xl font-light">
              The HopeGrant Foundation provides vital financial assistance to individuals and families. When unexpected hardship strikes, we stand as a beacon of stability.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/apply">
                <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg font-bold bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-xl">
                  Apply for Aid Now
                </Button>
              </Link>
              <Link href="/testimonials">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg font-bold border-white/30 text-white hover:bg-white/10 hover:text-white bg-transparent backdrop-blur-sm">
                  Read Our Stories
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative -mt-16 z-30 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={FADE_UP}
            className="bg-card rounded-2xl shadow-2xl p-8 md:p-12 border border-border"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-border/50">
              {[
                { label: 'Total Applications', value: stats?.totalApplications ?? '10k+', loading: statsLoading },
                { label: 'Approved Grants', value: stats?.approvedApplications ?? '8.5k+', loading: statsLoading },
                { label: 'Total Disbursed', value: stats ? `$${(stats.totalDisbursed / 1000000).toFixed(1)}M+` : '$12.4M+', loading: statsLoading },
                { label: 'Lives Impacted', value: stats?.totalTestimonials ? `${stats.totalTestimonials * 100}+` : '50k+', loading: statsLoading },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center justify-center text-center px-4 first:pl-0 last:pr-0">
                  {stat.loading ? (
                    <div className="h-10 w-24 bg-muted animate-pulse rounded mb-2" />
                  ) : (
                    <div className="text-4xl md:text-5xl font-serif font-bold text-primary mb-2">
                      {stat.value}
                    </div>
                  )}
                  <div className="text-sm md:text-base font-medium text-muted-foreground uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold font-serif text-foreground mb-6">
              Comprehensive Aid Programs
            </h2>
            <p className="text-lg text-muted-foreground">
              We offer targeted financial grants designed to address specific areas of need, ensuring our resources create the most meaningful impact.
            </p>
          </div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={STAGGER}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {aidTypes.map((type, i) => (
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
                  <p className="text-muted-foreground leading-relaxed">
                    {type.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/3 h-[120%] opacity-20 hidden lg:block">
          <img src={communityImage} alt="Community" className="w-full h-full object-cover grayscale-[30%] mix-blend-overlay rounded-l-[100px]" />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-bold font-serif text-white mb-6">
              A Transparent Process
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-12">
              Our application and review process is designed to be rigorous yet compassionate, ensuring funds reach those who need them most without unnecessary delays.
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
                    {i !== steps.length - 1 && (
                      <div className="w-0.5 h-16 bg-secondary/30 mt-4" />
                    )}
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
                  Begin Application
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Preview */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-bold font-serif text-foreground mb-6">
                Voices of Hope
              </h2>
              <p className="text-lg text-muted-foreground">
                Read how the HopeGrant Foundation has made a tangible difference in the lives of individuals and communities.
              </p>
            </div>
            <Link href="/testimonials" className="group flex items-center gap-2 text-primary font-semibold hover:text-secondary transition-colors">
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
              testimonials.map((t, i) => (
                <motion.div key={t.id} variants={FADE_UP} className="bg-card p-8 rounded-2xl border border-border shadow-sm flex flex-col">
                  <div className="flex text-secondary mb-4">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <svg key={j} className={`w-5 h-5 ${j < t.rating ? 'fill-current' : 'text-muted/50 fill-current'}`} viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <blockquote className="text-foreground/80 italic mb-6 flex-grow">
                    "{t.message.length > 150 ? t.message.substring(0, 150) + '...' : t.message}"
                  </blockquote>
                  <div className="flex items-center gap-4 mt-auto">
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                      {t.avatarInitials || t.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-foreground">{t.name}</div>
                      <div className="text-sm text-muted-foreground">{t.location} • {t.aidType.replace('_', ' ')}</div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-3 text-center py-12 text-muted-foreground">
                No stories available at the moment.
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-card border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <HeartHandshake className="h-16 w-16 text-secondary mx-auto mb-8" />
          <h2 className="text-4xl md:text-6xl font-bold font-serif text-foreground mb-6">
            Ready to Take the Next Step?
          </h2>
          <p className="text-xl text-muted-foreground mb-10">
            Don't let financial hardship define your future. Our team is standing by to review your application and provide the support you need.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/apply">
              <Button size="lg" className="w-full sm:w-auto h-14 px-10 text-lg font-bold">
                Start Your Application
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-10 text-lg font-bold border-primary text-primary hover:bg-primary/5">
                Contact Our Team
              </Button>
            </Link>
          </div>
          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Secure Process</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Confidential</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Fast Review</span>
          </div>
        </div>
      </section>
    </div>
  );
}
