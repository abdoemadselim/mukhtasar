import { Shield } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "سياسة الخصوصية | مُختصِر",
    description: "سياسة الخصوصية الخاصة بمنصة مُختصِر - أول منتج عربي متكامل لإختصار الروابط. تعرف على حقوقك وواجباتك.",
};

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-50">
            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="flex items-center gap-3 mb-4">
                    <Shield className="h-6 w-6 text-primary" />
                    <h1 className="text-2xl font-bold text-primary">سياسة الخصوصية</h1>
                </div>
                <div className="bg-white rounded-lg shadow-md p-8 space-y-8">
                    {/* Introduction */}
                    <section>
                        <div className="mb-6">
                            <p className="text-gray-600 text-lg leading-relaxed">
                                في <span className="font-semibold text-primary">مُختصِر</span>، نحن ملتزمون بحماية خصوصيتك وأمان بياناتك الشخصية.
                                هذه السياسة توضح كيفية جمع واستخدام وحماية معلوماتك عند استخدام خدماتنا.
                            </p>
                            <p className="text-sm text-gray-500 mt-4">
                                آخر تحديث: سبتمبر 2025
                            </p>
                        </div>
                    </section>

                    {/* Data Collection */}
                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">1. المعلومات التي نجمعها</h2>
                        <div className="text-gray-600 space-y-4">
                            <div>
                                <h3 className="font-semibold text-gray-700 mb-2">المعلومات الشخصية:</h3>
                                <ul className="list-disc pr-6 space-y-1">
                                    <li>الاسم الكامل</li>
                                    <li>عنوان البريد الإلكتروني</li>
                                    <li>معلومات الحساب والمصادقة</li>
                                    <li>معلومات الدفع (عند الاشتراك في الخطط المدفوعة)</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-700 mb-2">معلومات الاستخدام:</h3>
                                <ul className="list-disc pr-6 space-y-1">
                                    <li>الروابط التي تم اختصارها</li>
                                    <li>إحصائيات النقر والوصول</li>
                                    <li>عنوان IP والموقع الجغرافي</li>
                                    <li>نوع المتصفح ونظام التشغيل</li>
                                    <li>تاريخ ووقت الوصول</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-700 mb-2">البيانات التقنية:</h3>
                                <ul className="list-disc pr-6 space-y-1">
                                    <li>ملفات تعريف الارتباط (Cookies)</li>
                                    <li>البيانات التحليلية</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* How We Use Information */}
                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">2. كيف نستخدم المعلومات</h2>
                        <div className="text-gray-600 space-y-3">
                            <p>نستخدم المعلومات المجمعة للأغراض التالية:</p>
                            <ul className="list-disc pr-6 space-y-2">
                                <li>تقديم وتحسين خدمة اختصار الروابط</li>
                                <li>إنشاء وإدارة حسابات المستخدمين</li>
                                <li>توفير التحليلات والإحصائيات المفصلة</li>
                                <li>معالجة المدفوعات والفواتير</li>
                                <li>إرسال الإشعارات المهمة والتحديثات</li>
                                <li>منع الاحتيال وضمان أمان الخدمة</li>
                                <li>تحسين تجربة المستخدم</li>
                                <li>الامتثال للقوانين واللوائح</li>
                            </ul>
                        </div>
                    </section>

                    {/* Information Sharing */}
                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">3. مشاركة المعلومات</h2>
                        <div className="text-gray-600 space-y-3">
                            <p>نحن <strong>لا نبيع</strong> معلوماتك الشخصية لأطراف ثالثة. قد نشارك معلوماتك في الحالات التالية:</p>
                            <ul className="list-disc pr-6 space-y-2">
                                <li><strong>مقدمو الخدمات:</strong> مثل خدمات الدفع والاستضافة (بموجب اتفاقيات سرية)</li>
                                <li><strong>الامتثال القانوني:</strong> عند طلب السلطات المختصة بموجب أمر قضائي</li>
                                <li><strong>حماية الحقوق:</strong> لحماية حقوقنا أو حقوق المستخدمين الآخرين</li>
                                <li><strong>نقل الأعمال:</strong> في حالة دمج أو استحواذ الشركة</li>
                                <li><strong>الموافقة المسبقة:</strong> عند حصولنا على موافقتك الصريحة</li>
                            </ul>
                        </div>
                    </section>

                    {/* Cookies */}
                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">4. ملفات تعريف الارتباط (Cookies)</h2>
                        <div className="text-gray-600 space-y-3">
                            <p>نستخدم ملفات تعريف الارتباط للأغراض التالية:</p>
                            <ul className="list-disc pr-6 space-y-2">
                                <li>الحفاظ على جلسة تسجيل الدخول</li>
                                <li>تخزين التفضيلات والإعدادات</li>
                                <li>تحسين الأداء والتجربة</li>
                                <li>منع الأنشطة المشبوهة</li>
                            </ul>
                            <p>
                                يمكنك إدارة أو حذف ملفات تعريف الارتباط من خلال إعدادات متصفحك.
                                لكن هذا قد يؤثر على وظائف الموقع.
                            </p>
                        </div>
                    </section>

                    {/* User Rights */}
                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">5. حقوقك</h2>
                        <div className="text-gray-600 space-y-3">
                            <p>لك الحق في:</p>
                            <ul className="list-disc pr-6 space-y-2">
                                <li><strong>الوصول:</strong> طلب نسخة من بياناتك الشخصية</li>
                                <li><strong>التصحيح:</strong> طلب تصحيح البيانات غير الدقيقة</li>
                                <li><strong>الحذف:</strong> طلب حذف بياناتك الشخصية</li>
                            </ul>
                            <p>
                                لممارسة هذه الحقوق، يرجى التواصل معنا على: support@mukhtasar.pro
                            </p>
                        </div>
                    </section>

                    {/* Third Party Services */}
                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">6. الخدمات الخارجية</h2>
                        <div className="text-gray-600 space-y-3">
                            <p>نستخدم خدمات خارجية موثوقة مثل:</p>
                            <ul className="list-disc pr-6 space-y-2">
                                <li><strong>Umami Cloud:</strong> لتحليل استخدام الموقع</li>
                                <li><strong>خدمات الدفع:</strong> لمعالجة المدفوعات الآمنة</li>
                                <li><strong>خدمات البريد:</strong> لإرسال الإشعارات</li>
                                <li><strong>خدمات الاستضافة:</strong> لتخزين البيانات بأمان</li>
                            </ul>
                            <p>
                                هذه الخدمات لها سياسات خصوصية منفصلة
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    )
}