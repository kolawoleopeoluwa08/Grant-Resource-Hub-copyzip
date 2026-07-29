import { useListTestimonials, getListTestimonialsQueryKey } from '@workspace/api-client-react';
import { motion } from 'framer-motion';
import { Star, GraduationCap } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

const STAGGER = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const FADE_UP = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const grantTypeLabels: Record<string, string> = {
  tuition_fees: 'Tuition Grant',
  books_supplies: 'Textbooks & Supplies',
  housing_meals: 'Housing & Meals Grant',
  technology_equipment: 'Technology Grant',
  research_fees: 'Research Grant',
  study_abroad: 'Study Abroad Grant',
  general_education: 'Education Grant',
  education_grant: 'Education Grant',
};

export default function Testimonials() {
  const { data: testimonials, isLoading } = useListTestimonials({
    query: { queryKey: getListTestimonialsQueryKey() },
  });

  const formatGrantType = (type: string) => {
    return grantTypeLabels[type] || type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-24 px-4 text-center">
        <div className="container mx-auto max-w-4xl">
          <GraduationCap className="h-12 w-12 text-secondary mx-auto mb-6" />
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4 text-white tracking-tight">
            Voices of Hope
          </h1>
          <p className="text-secondary font-semibold mb-6 tracking-wider uppercase text-sm">
            Hope Foundation — Student Aid Resource Program
          </p>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto font-light leading-relaxed">
            Real stories from college students across America who received grants from the Hope Foundation — and what it meant for their academic futures.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-card p-8 rounded-2xl border border-border h-72 animate-pulse shadow-sm" />
            ))}
          </div>
        ) : testimonials && testimonials.length > 0 ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={STAGGER}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {testimonials.map((t) => (
              <motion.div
                key={t.id}
                variants={FADE_UP}
                className="bg-card p-8 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow flex flex-col group"
              >
                <div className="flex gap-1 text-secondary mb-6">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star
                      key={j}
                      className={`w-5 h-5 ${j < t.rating ? 'fill-current' : 'text-muted-foreground/30'}`}
                    />
                  ))}
                </div>

                <blockquote className="text-foreground/80 text-base leading-relaxed mb-8 flex-grow relative">
                  <span className="text-4xl text-primary/10 absolute -top-4 -left-2 font-serif">"</span>
                  <span className="relative z-10">{t.message}</span>
                </blockquote>

                <div className="flex items-center gap-4 mt-auto pt-6 border-t border-border/50">
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg border border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {t.avatarInitials || t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold font-serif text-foreground tracking-tight">{t.name}</div>
                    <div className="text-sm text-muted-foreground font-medium">{t.location}</div>
                    <div className="text-xs text-primary/70 font-medium mt-0.5">{formatGrantType(t.grantType)}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-2xl font-serif text-foreground mb-4">No stories published yet.</h3>
            <p className="text-muted-foreground mb-8">Check back soon — more student stories are on the way.</p>
          </div>
        )}

        {!isLoading && (
          <div className="mt-20 text-center bg-muted/40 p-12 rounded-3xl border border-border max-w-4xl mx-auto">
            <GraduationCap className="h-10 w-10 text-secondary mx-auto mb-4" />
            <h2 className="text-3xl font-serif font-bold mb-4">Ready to Write Your Own Story?</h2>
            <p className="text-muted-foreground mb-8 text-lg max-w-xl mx-auto">
              Financial barriers should never stop a great student. Apply today and let us help you reach the finish line.
            </p>
            <Link href="/apply">
              <Button size="lg" className="h-14 px-10 text-lg font-bold">
                Apply for a Grant
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
