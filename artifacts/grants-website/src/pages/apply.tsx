import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { HeartHandshake, CheckCircle2, AlertCircle } from 'lucide-react';
import { useSubmitApplication, ApplicationInputAidType } from '@workspace/api-client-react';

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
  aidType: z.nativeEnum(ApplicationInputAidType, {
    required_error: 'Please select an aid type',
  }),
  requestedAmount: z.coerce.number().min(100, 'Minimum amount is $100').max(50000, 'Maximum amount is $50,000'),
  purpose: z.string().min(5, 'Please briefly describe the purpose'),
  description: z.string().min(20, 'Please provide more details about your situation (min 20 characters)'),
  householdSize: z.coerce.number().min(1).optional(),
  annualIncome: z.coerce.number().min(0).optional(),
});

type FormValues = z.infer<typeof formSchema>;

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
      requestedAmount: undefined,
      purpose: '',
      description: '',
      householdSize: 1,
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
          <h1 className="text-4xl font-serif font-bold text-foreground mb-4">Application Submitted</h1>
          <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
            Thank you for reaching out to the HopeGrant Foundation. Your application has been securely received by our review committee. We will be in touch via email within 5-7 business days.
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
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
          </svg>
        </div>
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <HeartHandshake className="h-12 w-12 text-secondary mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-white">
            Grant Application
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Please fill out the form below comprehensively. The information you provide is strictly confidential and will only be used by our committee to evaluate your request for financial aid.
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
                    <p className="text-sm opacity-90">There was an error submitting your application. Please try again.</p>
                  </div>
                </div>
              )}

              {/* Personal Information */}
              <div>
                <h2 className="text-2xl font-serif font-bold text-foreground mb-6 pb-2 border-b border-border">
                  Personal Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="(555) 123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="md:col-span-2">
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Residential Address</FormLabel>
                          <FormControl>
                            <Input placeholder="123 Main St, Apt 4B, City, State, ZIP" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Financial & Household */}
              <div>
                <h2 className="text-2xl font-serif font-bold text-foreground mb-6 pb-2 border-b border-border">
                  Household & Financial Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="householdSize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Household Size</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" {...field} />
                        </FormControl>
                        <FormDescription>Number of people living in your home.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="annualIncome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estimated Annual Household Income ($)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="50000" {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Grant Request Details */}
              <div>
                <h2 className="text-2xl font-serif font-bold text-foreground mb-6 pb-2 border-b border-border">
                  Grant Request
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <FormField
                    control={form.control}
                    name="aidType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type of Aid Needed</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select aid type..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="emergency_aid">Emergency Aid</SelectItem>
                            <SelectItem value="education_grant">Education Grant</SelectItem>
                            <SelectItem value="business_grant">Business Grant</SelectItem>
                            <SelectItem value="housing_assistance">Housing Assistance</SelectItem>
                            <SelectItem value="medical_aid">Medical Aid</SelectItem>
                            <SelectItem value="other">Other / General</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="requestedAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Requested Amount ($)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="5000" {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="purpose"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Purpose</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Emergency medical bills for surgery" {...field} />
                        </FormControl>
                        <FormDescription>A brief sentence describing what the funds will be used for.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Detailed Description of Need</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Please explain your situation, how the funds will be utilized, and any other context our committee should know..."
                            className="min-h-[150px] resize-y"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground">
                  By submitting, you agree to our Terms of Service and certify that all provided information is accurate.
                </p>
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full sm:w-auto min-w-[200px] h-14 text-lg font-bold"
                  disabled={submitApp.isPending}
                >
                  {submitApp.isPending ? 'Submitting securely...' : 'Submit Application'}
                </Button>
              </div>

            </form>
          </Form>
        </motion.div>
      </div>
    </div>
  );
}
