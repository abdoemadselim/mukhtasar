// apps/frontend/src/components/contact/contact-section.tsx
'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ContactMessageSchema, ContactMessageType } from '@mukhtasar/shared';
import { Send, MessageCircle } from 'lucide-react';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Highlighter from '@/components/ui/highlighter';
import { openToaster } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from "@/components/ui/textarea"
import { Input } from '@/components/ui/input';

import { useSendContactMessage } from '@/features/contact/hooks/contact-query';

export default function ContactSection() {
    const form = useForm<ContactMessageType>({
        resolver: zodResolver(ContactMessageSchema),
        defaultValues: {
            name: '',
            email: '',
            message: ''
        }
    });

    const { mutateAsync, isError, isPending, isSuccess, error } = useSendContactMessage();

    const onSubmit = async (data: ContactMessageType) => {
        await mutateAsync(data);
        form.reset();
    };

    useEffect(() => {
        if (isError) {
            openToaster(error?.message || "حدث خطأ أثناء إرسال الرسالة", "error");
        }

        if (isSuccess) {
            openToaster("تم إرسال رسالتك بنجاح! انتظر رسالتنا", "success");
        }
    }, [isError, isSuccess, error]);

    return (
        <section className="py-20 bg-white" id="contact-us">
            <div className="max-w-4xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-gray-800">
                        <Highlighter action="underline" strokeWidth={3} color="blue">
                            <MessageCircle className="inline-block ml-2 mb-1" size={42} />
                            تواصل معنا
                        </Highlighter>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        هل لديك اقتراح؟ تواجه مشكلة؟ أم لديك فكرة رائعة لتحسين مُختصِر؟
                        <br />
                        <span className="text-blue-600 font-medium">نحن هنا للاستماع إليك!</span>
                    </p>
                </div>

                <div className="bg-blue-50 rounded-2xl shadow-xl p-8 lg:p-12">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>الاسم *</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        className="w-full px-4 py-3 border-1 border-gray-400 rounded-md focus-visible:ring-0 focus-visible:border-blue-600 focus-visible:border-2 transition-colors"
                                                        placeholder="اسمك الكريم"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div>
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>البريد الإلكتروني *</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        type="email"
                                                        className="w-full px-4 py-3 border border-gray-400 rounded-md focus-visible:ring-0 focus-visible:border-blue-600 focus-visible:border-2 transition-colors"
                                                        placeholder="your@email.com"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <div>
                                <FormField
                                    control={form.control}
                                    name="message"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>رسالتك *</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    {...field}
                                                    rows={6}
                                                    className="min-h-[150px] w-full px-4 py-3 border-1 border-gray-400 focus-visible:ring-0 focus-visible:border-blue-600 focus-visible:border-2 rounded-md transition-colors resize-vertical"
                                                    placeholder="أخبرنا بما تفكر فيه... اقتراحاتك، أفكارك، أو أي مشاكل تواجهها. كل كلمة مهمة لنا!"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="text-center">
                                <Button
                                    type="submit"
                                    disabled={isPending || form.formState.isSubmitting}
                                    className="inline-flex cursor-pointer items-center py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                                >
                                    {isPending || form.formState.isSubmitting ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-2"></div>
                                            جاري الإرسال...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="ml-2" size={20} />
                                            ارسل الرسالة
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>

                    <div className="mt-8 pt-8 border-t border-gray-200 text-center">
                        <p className="text-gray-600">
                            أو راسلنا مباشرة على:{' '}
                            <a
                                href="mailto:support@mukhtasar.pro"
                                className="text-blue-600 hover:text-blue-700 font-medium"
                            >
                                support@mukhtasar.pro
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}