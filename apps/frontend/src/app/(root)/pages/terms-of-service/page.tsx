import Link from "next/link";
import { Metadata } from "next";
import { FileText } from "lucide-react";

export const metadata: Metadata = {
    title: "حقوق الاستخدام | مُختصِر",
    description: "شروط وأحكام استخدام منصة مُختصِر - أول منتج عربي متكامل لإختصار الروابط. تعرف على حقوقك وواجباتك.",
};

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-50">
            {/* Content */}
            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="flex items-center gap-3 mb-4">
                    <FileText className="h-6 w-6 text-primary" />
                    <h1 className="text-2xl font-bold text-primary">حقوق الاستخدام</h1>
                </div>
                <div className="bg-white rounded-lg shadow-md p-8 space-y-8">
                    {/* Introduction */}
                    <section>
                        <div className="mb-6">
                            <p className="text-gray-600 text-lg leading-relaxed">
                                مرحباً بك في <span className="font-semibold text-primary">مُختصِر</span> - أول منتج عربي متكامل لاختصار الروابط.
                                باستخدامك لخدماتنا، فإنك توافق على الالتزام بشروط الاستخدام التالية.
                            </p>
                            <p className="text-sm text-gray-500 mt-4">
                                آخر تحديث: سبتمبر 2025
                            </p>
                        </div>
                    </section>

                    {/* Terms Sections */}
                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">1. تعريف الخدمة</h2>
                        <div className="text-gray-600 space-y-3">
                            <p>
                                مُختصِر هي منصة إلكترونية تقدم خدمة اختصار الروابط الطويلة وتحويلها إلى روابط قصيرة سهلة المشاركة،
                                مع توفير أدوات تحليلية متقدمة لمتابعة أداء الروابط.
                            </p>
                            <p>
                                تشمل خدماتنا:
                            </p>
                            <ul className="list-disc pr-6 space-y-1">
                                <li>اختصار الروابط الطويلة</li>
                                <li>تخصيص الروابط المختصرة</li>
                                <li>إنشاء رموز QR للروابط</li>
                                <li>تحليلات مفصلة لزيارات الروابط</li>
                                <li>إدارة النطاقات المخصصة</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">2. شروط الاستخدام المقبول</h2>
                        <div className="text-gray-600 space-y-3">
                            <p>يحظر استخدام خدماتنا في الأنشطة التالية:</p>
                            <ul className="list-disc pr-6 space-y-2">
                                <li>نشر أو ربط محتوى غير قانوني أو ضار أو مسيء</li>
                                <li>انتهاك حقوق الطبع والنشر أو الملكية الفكرية</li>
                                <li>نشر برمجيات خبيثة أو فيروسات</li>
                                <li>التحايل على أنظمة الأمان أو القرصنة</li>
                                <li>الأنشطة الاحتيالية أو التضليلية</li>
                                <li>البريد العشوائي أو التسويق غير المرغوب فيه</li>
                                <li>المحتوى الإباحي أو غير اللائق</li>
                                <li>التهديد أو التحرش أو خطاب الكراهية</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">3. حسابات المستخدمين</h2>
                        <div className="text-gray-600 space-y-3">
                            <p>عند إنشاء حساب لديك، فإنك توافق على:</p>
                            <ul className="list-disc pr-6 space-y-2">
                                <li>تقديم معلومات دقيقة وحديثة عن نفسك</li>
                                <li>الحفاظ على أمان كلمة المرور الخاصة بك</li>
                                <li>تحمل المسؤولية الكاملة عن جميع الأنشطة في حسابك</li>
                                <li>إخطارنا فوراً بأي استخدام غير مصرح به لحسابك</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">4. الخطط والدفع</h2>
                        <div className="text-gray-600 space-y-3">
                            <p>
                                نقدم خطط مختلفة لتناسب احتياجاتك. الأسعار المعروضة على موقعنا تشمل جميع الرسوم المطبقة.
                            </p>
                            <ul className="list-disc pr-6 space-y-2">
                                <li>نحتفظ بالحق في تعديل الأسعار مع الإشعار المسبق</li>
                                <li>يمكنك ترقية خطتك في أي وقت</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">5. الملكية الفكرية</h2>
                        <div className="text-gray-600 space-y-3">
                            <p>
                                جميع حقوق الملكية الفكرية للموقع والخدمة محفوظة لـ مُختصِر. هذا يشمل:
                            </p>
                            <ul className="list-disc pr-6 space-y-2">
                                <li>تصميم الموقع والواجهات</li>
                                <li>الشعارات والعلامات التجارية</li>
                                <li>الكود المصدري والبرمجيات</li>
                                <li>المحتوى والنصوص</li>
                            </ul>
                            <p>
                                تحتفظ بملكية المحتوى الذي تنشره، ولكنك تمنحنا ترخيصاً لاستخدامه لتقديم الخدمة.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">6. إنهاء الخدمة</h2>
                        <div className="text-gray-600 space-y-3">
                            <p>نحتفظ بالحق في:</p>
                            <ul className="list-disc pr-6 space-y-2">
                                <li>إيقاف أو حذف حسابك في حالة انتهاك شروط الاستخدام</li>
                                <li>حذف أو تعطيل الروابط التي تنتهك سياساتنا</li>
                                <li>تعديل أو إيقاف الخدمة مؤقتاً للصيانة</li>
                            </ul>
                            <p>
                                يمكنك إلغاء حسابك في أي وقت من خلال الاتصال بنا.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">7. إخلاء المسؤولية</h2>
                        <div className="text-gray-600 space-y-3">
                            <p>
                                خدماتنا متاحة كما هي دون أي ضمانات صريحة أو ضمنية. نحن غير مسؤولين عن:
                            </p>
                            <ul className="list-disc pr-6 space-y-2">
                                <li>أي أضرار مباشرة أو غير مباشرة ناتجة عن استخدام الخدمة</li>
                                <li>انقطاع الخدمة أو الأخطاء التقنية</li>
                                <li>محتوى المواقع التي يتم الربط إليها</li>
                                <li>فقدان البيانات أو المحتوى</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">8. تعديل الشروط</h2>
                        <div className="text-gray-600 space-y-3">
                            <p>
                                نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سيتم إشعارك بالتغييرات المهمة
                                عبر البريد الإلكتروني أو إشعار على الموقع.
                            </p>
                            <p>
                                استمرارك في استخدام الخدمة بعد التعديل يعني موافقتك على الشروط الجديدة.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">9. التواصل معنا</h2>
                        <div className="text-gray-600 space-y-3">
                            <p>
                                إذا كان لديك أي استفسارات حول شروط الاستخدام، يمكنك التواصل معنا:
                            </p>
                            <ul className="list-none space-y-2">
                                <li>• البريد الإلكتروني: support@mukhtasar.pro</li>
                                <li>• الموقع الإلكتروني: mukhtasar.pro</li>
                            </ul>
                        </div>
                    </section>

                    {/* Footer */}
                    <div className="pt-8 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-500">
                                © 2025 مُختصِر - جميع الحقوق محفوظة
                            </p>
                            <Link
                                href="/pages/privacy"
                                className="text-primary hover:underline text-sm font-medium"
                            >
                                سياسة الخصوصية
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}