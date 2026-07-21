import { BRAND } from '../../../shared/constants/brand';

const milestones = [
  { year: '2024', title: 'البداية', text: 'بدأ Resin Bon كمشروع منزلي صغير لصناعة قطع ريزن مخصصة تحمل تفاصيل شخصية وذكريات قريبة من القلب.' },
  { year: '2025', title: 'توسيع التصاميم', text: 'توسعت القطع لتشمل حفظ الورود، الميداليات، تعليقات السيارات، والساعات المصممة حسب الطلب.' },
  { year: 'اليوم', title: 'تجربة مخصصة', text: 'كل قطعة تمر بمرحلة اختيار الألوان، الصور، الأسماء، والتغليف حتى تصل كهدية جاهزة ومميزة.' },
];

export function AboutPage() {
  return (
    <main className="about-page">
      <section className="about-hero">
        <div className="about-hero-copy">
          <p className="eyebrow">من نحن</p>
          <h1>Resin Bon</h1>
          <p>
            هنا نصنع قطع ريزن يدوية مخصصة، مصممة لتخلد ذكرياتك وتضيف لمسة فنية مميزة إلى منزلك أو هديتك.
          </p>
        </div>
        <div className="about-hero-media">
          <img src={BRAND.coverUrl} alt="قطع ريزن يدوية من Resin Bon" loading="lazy" decoding="async" />
        </div>
      </section>

      <section className="about-story">
        <div>
          <p className="eyebrow">حكاية المشروع</p>
          <h2>من فكرة صغيرة إلى قطع تحمل ذكرى</h2>
          <p>
            انطلق Resin Bon من حب التفاصيل الصغيرة: وردة من مناسبة، اسم قريب، لون له معنى، أو صورة تستحق أن تبقى.
            لذلك نعامل كل طلب كقطعة واحدة لا تتكرر، ونصنعها يدويًا بخطوات هادئة تبدأ من فهم الفكرة وتنتهي بتغليف يليق بها.
          </p>
        </div>
        <img src={BRAND.logoUrl} alt="شعار Resin Bon" loading="lazy" decoding="async" />
      </section>

      <section className="about-milestones">
        {milestones.map((item) => (
          <article key={item.title}>
            <span>{item.year}</span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </section>

      <section className="about-values">
        <div>
          <h2>ماذا نراعي في كل قطعة؟</h2>
          <p>نختار المواد بعناية، نراجع الألوان قبل الصب، ونعطي كل طبقة وقتها حتى تكون النتيجة نظيفة، لامعة، وشخصية.</p>
        </div>
        <div className="about-value-grid">
          <span>تصميم مخصص</span>
          <span>صناعة يدوية</span>
          <span>تغليف هدايا</span>
          <span>تفاصيل تحفظ الذكرى</span>
        </div>
      </section>
    </main>
  );
}
