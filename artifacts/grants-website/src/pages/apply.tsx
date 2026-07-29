import { useState } from 'react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { GraduationCap, CheckCircle2, AlertCircle } from 'lucide-react';
import { useSubmitApplication, ApplicationInputGrantType, ApplicationInputYearOfStudy } from '@workspace/api-client-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const formSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  address: z.string().min(5, 'Please enter your full address'),
  institution: z.string().min(3, 'Please enter your college or university name'),
  yearOfStudy: z.nativeEnum(ApplicationInputYearOfStudy, { required_error: 'Please select your year of study' }),
  grantType: z.nativeEnum(ApplicationInputGrantType, { required_error: 'Please select a grant category' }),
  requestedAmount: z.coerce.number().min(100, 'Minimum grant request is $100').max(25000, 'Maximum grant request is $25,000'),
  gpa: z.coerce.number().min(0).max(4.0).optional(),
  annualIncome: z.coerce.number().min(0).optional(),
  description: z.string().min(20, 'Please provide more details about your situation (min 20 characters)'),
});

type FormValues = z.infer<typeof formSchema>;

const grantTypeLabels: Record<string, string> = {
  tuition_fees: 'Tuition & Enrollment Fees',
  books_supplies: 'Textbooks & Academic Supplies',
  housing_meals: 'Campus Housing & Meal Plans',
  technology_equipment: 'Technology & Equipment',
  research_fees: 'Research & Laboratory Fees',
  study_abroad: 'Study Abroad Program',
  general_education: 'General Educational Support',
};

const yearOfStudyLabels: Record<string, string> = {
  freshman: 'Freshman (1st Year)',
  sophomore: 'Sophomore (2nd Year)',
  junior: 'Junior (3rd Year)',
  senior: 'Senior (4th Year)',
  graduate: 'Graduate Student',
  doctorate: 'Doctorate / PhD Candidate',
};

export default function Apply() {
  const [_, setLocation] = useLocation();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const submitApp = useSubmitApplication();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      institution: '',
      requestedAmount: undefined,
      description: '',
      gpa: undefined,
      annualIncome: undefined,
    },
  });

  const onSubmit = (data: FormValues) => {
    submitApp.mutate({ data }, {
      onSuccess: () => {
        setIsSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
    });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-[80dvh] flex items-center justify-center bg-muted/30 py-20 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card max-w-2xl w-full p-10 md:p-16 rounded-3xl shadow-xl border border-border text-center"
        >
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="h-12 w-12" />
          </div>
          <h1 className="text-4xl font-serif font-bold text-foreground mb-4">Application Received</h1>
          <p className="text-xl text-muted-foreground mb-4 leading-relaxed">
            Thank you for applying to the HopeGrant Foundation Student Aid Resource Program.
          </p>
          <p className="text-base text-muted-foreground mb-10 leading-relaxed">
            Your application has been securely submitted to our academic review committee. You will receive a confirmation email shortly, and a decision within <strong>5–7 business days</strong>.
          </p>
          <Button
            size="lg"
            onClick={() => setLocation('/')}
            className="h-14 px-10 text-lg font-bold"
          >
            Return to Homepage
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 pb-24">
      {/* Header */}
      <div className="bg-primary text-primary-foreground pt-20 pb-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
          </svg>
        </div>
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <GraduationCap className="h-12 w-12 text-secondary mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-2 text-white">
            Student Grant Application
          </h1>
          <p className="text-secondary font-semibold mb-4 tracking-wide uppercase text-sm">
            HopeGrant Foundation — Student Aid Resource Program
          </p>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            All information you provide is strictly confidential and used only by our academic review committee to assess your eligibility for educational grant funding.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-20 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl shadow-xl border border-border max-w-4xl mx-auto overflow-hidden"
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-8 md:p-12 space-y-10">

              {submitApp.isError && (
                <div className="bg-destructive/10 border-l-4 border-destructive text-destructive p-4 rounded-md flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold">Submission Failed</h4>
                    <p className="text-sm opacity-90">There was an error submitting your application. Please try again or contact us directly.</p>
                  </div>
                </div>
              )}

              {/* Personal Information */}
              <div>
                <h2 className="text-2xl font-serif font-bold text-foreground mb-6 pb-2 border-b border-border">
                  Personal Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="firstName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl><Input data-testid="input-firstName" placeholder="Jane" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="lastName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl><Input data-testid="input-lastName" placeholder="Smith" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl><Input data-testid="input-email" type="email" placeholder="jane.smith@university.edu" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl><Input data-testid="input-phone" type="tel" placeholder="(555) 123-4567" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <div className="md:col-span-2">
                    <FormField control={form.control} name="address" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Residential Address</FormLabel>
                        <FormControl><Input data-testid="input-address" placeholder="123 Campus Drive, Apt 2B, City, State, ZIP" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                </div>
              </div>

              {/* Academic Information */}
              <div>
                <h2 className="text-2xl font-serif font-bold text-foreground mb-6 pb-2 border-b border-border">
                  Academic Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <FormField control={form.control} name="institution" render={({ field }) => (
                      <FormItem>
                        <FormLabel>College / University</FormLabel>
                        <FormControl><Input data-testid="input-institution" placeholder="e.g. University of Michigan, Ann Arbor" {...field} /></FormControl>
                        <FormDescription>Enter the full name of your enrolled institution.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="yearOfStudy" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year of Study</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-yearOfStudy">
                            <SelectValue placeholder="Select your year..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(yearOfStudyLabels).map(([value, label]) => (
                            <SelectItem key={value} value={value}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="gpa" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current GPA <span className="text-muted-foreground font-normal">(optional)</span></FormLabel>
                      <FormControl>
                        <Input data-testid="input-gpa" type="number" step="0.01" min="0" max="4.0" placeholder="3.50" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormDescription>Your most recent cumulative GPA on a 4.0 scale.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </div>

              {/* Grant Request */}
              <div>
                <h2 className="text-2xl font-serif font-bold text-foreground mb-6 pb-2 border-b border-border">
                  Grant Request
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <FormField control={form.control} name="grantType" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Grant Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-grantType">
                            <SelectValue placeholder="Select a category..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(grantTypeLabels).map(([value, label]) => (
                            <SelectItem key={value} value={value}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="requestedAmount" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Requested Amount ($)</FormLabel>
                      <FormControl>
                        <Input data-testid="input-requestedAmount" type="number" placeholder="3000" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormDescription>Maximum grant: $25,000 per application.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="annualIncome" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Annual Household Income ($) <span className="text-muted-foreground font-normal">(optional)</span></FormLabel>
                      <FormControl>
                        <Input data-testid="input-annualIncome" type="number" placeholder="45000" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormDescription>Helps our committee assess financial need.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Statement of Need</FormLabel>
                    <FormControl>
                      <Textarea
                        data-testid="textarea-description"
                        placeholder="Please describe your financial situation, how the grant will be used, and how it will impact your education. The more specific you are, the better our committee can evaluate your request..."
                        className="min-h-[160px] resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>A clear, honest statement helps your application stand out.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground">
                  By submitting, you confirm that all information provided is accurate and you agree to our Terms of Service.
                </p>
                <Button
                  data-testid="button-submit"
                  type="submit"
                  size="lg"
                  className="w-full sm:w-auto min-w-[220px] h-14 text-lg font-bold"
                  disabled={submitApp.isPending}
                >
                  {submitApp.isPending ? 'Submitting...' : 'Submit Application'}
                </Button>
              </div>

            </form>
          </Form>
        </motion.div>
      </div>
    </div>
  );
}
