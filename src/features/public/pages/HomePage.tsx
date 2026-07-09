import { Link } from 'react-router-dom';
import { ROUTES } from '../../../shared/constants/routes';

const categories = [
  {
    title: 'تعليقات سيارات',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFRH27m6VdFxCk-h19fX6PkaZlzOr1iExr7bUt6v2uBR42ux-JjnjBM8dAd4biiq4c3kfj4LaAviA5mSLjKf57Mqq763LmpXpduUAd7lmKZLtU6R9xLKLDVyBJKR2oI0_nODvfaC4gCLZJ7lfsOh2U5I9i9k2qZfJIbTKC_UC5Tg2mA4G-6HI2q-eVMWb-IMu_6JmsWYmV8OHcdMd_XMvPLM9bTdUiqIqzFgFAm8ef8FTKv-RTmR8X8SVYOwtj2yQ1_-rjo3v8Hwlk',
  },
  {
    title: 'صواني ومجسمات ريزن',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB7EWaldaSheFLff9gCmLx124XYkK7Dw9pH_AsZLkmRMk3ieLsVrW6MVWlxOKoaBqTjMb1AKQ9gyh-TchD8IS9XsOlcjaqju6KaUPssz_Zr72uSCfhaDmAZGHEARoXxOAptu61fBKZ6rw7RKlBAnz2nViibK8Nco1U80t7Z8YdYPquJ1Ycw6LS5LUibRDaGraKJY4Jf4t9k2BYKcBNFp3Ow6hILNleRS74sxo8dzHxCsWVeQLWEixhYsR0Xxtls_AUckc2FR6UeA5Fl',
    large: true,
  },
  {
    title: 'هدايا مطرزة',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDhLQrTu3-cGxnDwFG8ZLofoOV0IZwmMP2QvNrZEzikQEuEpdqH_G_xJHuzPTiV6rjXHPwZIQZVE_IPXWSqtXGdYBNuaC1y4XGI25me1iJTdLC9Npkw31B-84S2XAaRD2pQAVjXtwMxaGdhcsqQAwDzCOQtGOWmFbT-iSbZs4WJy00mxUTtteZdhcSGe0mgiEJrFbkFQXBcxmn028CNav4B48he7-ENuGw_VTzZLwnlb-2B3hidkqLMPdKdcTHh0Z_msZeKX7AlEl7a',
  },
];

const products = [
  {
    title: 'ميدالية حروف مخصصة',
    tag: 'الأكثر طلباً',
    description: 'حروف ريزن شفافة بتفاصيل ورود مجففة ولمسة ذهبية ناعمة.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0QYp5oMW2aNdFeRUrybX3hLumIuI99OtwxYYMDi51tNAInaKgvg-kPmpYSLMil_hGPEW3Z_GgZrJJGoeikEs3jsoJVDzxCFSmf3hRcgr4-_lIYk6lKiuj01m6rRy9myfgIvSE1TmerJMljeK-FbSra8eecuN9-4HOw9gILkl-mPUO-FdhX-leDdIv78gKMiHePhanxst58h_BxwqdMphUHdtqm025qI7KqUNvsadu0YOx8-UG_SmTOOg2K_xq86v5IDuWWh5Tt3MO',
  },
  {
    title: 'صينية ريزن ملكية',
    tag: 'يدوي الصنع',
    description: 'قطعة تقديم أنيقة للأعياد والمناسبات بتدرجات دافئة.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCD8cy3-oTUISlX0PtEXKgOOb51M-074qPwE3h-_MSdVV9jJvmo2R1czy78EBSdVfxotC_5ku3XB2vK9F-qScElRUhmGufanU1-jle92LdlzxvjRdCLE43y60olgBhzR1vYtCs0jw-98PHPZ7LnG6l2htO31KLC8WqENKOZBwHNAS-HPAko-G9PD3WrVW-XcAkw8HsEYfJJhNT1gLmrpQ6bHCjc1fq6h00T9xPmn48Iw_lGldke1WRxUk6U0-fjYnzdCyq_CvfvYtXo',
  },
  {
    title: 'تعليقة سيارة باسم',
    tag: 'تخصيص',
    description: 'تصميم خفيف يضيف لمسة شخصية وراقية داخل السيارة.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgAXR2GHU0Rw3M4KX8wNRS5WuMaelqNmt-TQKQfS17nvEqbPQjRKk_HT-OfOsMTDuKRCtQrdn-R0vtYfROwesmEN-VDp8V00DthVKFjksNL_-YIc7oxW84_aB4XP5yMkPSKx7ORxzK3aYH5aXwdUaC-pIWCVpBMiVUpQPr1kXto7Tn6w_aPYZaWmJhs2gT_Z4dH30r_NMpUFzfkiKNh9tbYfffgP4mCeMOcokiZJUMmQ8qRHH8op-MJrUTnMaNwyvu81YD7o2sR8Z7',
  },
  {
    title: 'مزهرية ترابية ناعمة',
    tag: 'ديكور',
    description: 'هدية منزلية بسيطة بملمس طبيعي مناسب للتغليف الفاخر.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCD8cy3-oTUISlX0PtEXKgOOb51M-074qPwE3h-_MSdVV9jJvmo2R1czy78EBSdVfxotC_5ku3XB2vK9F-qScElRUhmGufanU1-jle92LdlzxvjRdCLE43y60olgBhzR1vYtCs0jw-98PHPZ7LnG6l2htO31KLC8WqENKOZBwHNAS-HPAko-G9PD3WrVW-XcAkw8HsEYfJJhNT1gLmrpQ6bHCjc1fq6h00T9xPmn48Iw_lGldke1WRxUk6U0-fjYnzdCyq_CvfvYtXo',
  },
];

const steps = [
  {
    title: 'اختاري القطعة',
    description: 'تصفحي المجموعة وحددي المنتج الأقرب للمناسبة أو الذكرى.',
  },
  {
    title: 'خصصي التفاصيل',
    description: 'أضيفي الاسم، الألوان، العبارة، أو أي لمسة خاصة تريدينها.',
  },
  {
    title: 'استلميها بتغليف راق',
    description: 'نجهز الطلب بعناية ليصل كهدية جاهزة ومميزة.',
  },
];

export function HomePage() {
  return (
    <main className="site-page">
      <header className="site-nav">
        <nav className="site-nav-inner" aria-label="التنقل الرئيسي">
          <Link className="site-logo" to={ROUTES.home}>
            <span className="site-logo-mark">ر</span>
            <span>هدايا ريزن يدوية</span>
          </Link>
          <div className="site-links">
            <a className="active" href="#home">
              الرئيسية
            </a>
            <a href="#categories">التصنيفات</a>
            <a href="#products">مختاراتنا</a>
            <a href="#order">طريقة الطلب</a>
          </div>
          <div className="nav-actions">
            <Link className="nav-action" to={ROUTES.login}>
              تسجيل الدخول
            </Link>
            <Link className="nav-action primary" to={ROUTES.register}>
              إنشاء حساب
            </Link>
          </div>
        </nav>
      </header>

      <section id="home" className="hero-section">
        <div className="hero-panel">
          <div className="hero-content">
            <p className="eyebrow">هدايا مخصصة بتفاصيل يدوية</p>
            <h1 className="hero-title">هدايا صنعت بكل حب، لتبقى ذكرى للأبد</h1>
            <p className="hero-copy">
              اختاري من قطع الريزن والهدايا المطرزة، وخصصي الأسماء والألوان والتفاصيل الصغيرة لتصلي
              إلى هدية تشبه صاحبها.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#products">
                تصفح المختارات
              </a>
              <Link className="button button-secondary" to={ROUTES.register}>
                ابدئي طلبك
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="categories" className="home-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">عالمنا الإبداعي</p>
            <h2 className="section-title">تصنيفات تناسب كل مناسبة</h2>
          </div>
          <p className="section-subtitle">واجهة دافئة وبسيطة تعرض المنتجات كمعرض بوتيك واضح على كل الشاشات.</p>
        </div>
        <div className="category-grid">
          {categories.map((category) => (
            <article className={`category-card ${category.large ? 'large' : ''}`} key={category.title}>
              <img src={category.image} alt={category.title} />
              <span>{category.title}</span>
            </article>
          ))}
        </div>
      </section>

      <section id="products" className="home-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">وصل حديثاً</p>
            <h2 className="section-title">مختارات يدوية بتغليف أنيق</h2>
          </div>
          <a className="nav-action" href="#order">
            كيف أطلب؟
          </a>
        </div>
        <div className="product-grid">
          {products.map((product) => (
            <article className="product-card" key={product.title}>
              <div className="product-image">
                <img src={product.image} alt={product.title} />
              </div>
              <div className="product-body">
                <span className="product-tag">{product.tag}</span>
                <h3>{product.title}</h3>
                <p>{product.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="order" className="steps-section">
        <div className="home-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">خطوات سهلة</p>
              <h2 className="section-title">كيف يتم الطلب؟</h2>
            </div>
          </div>
          <div className="steps-grid">
            {steps.map((step, index) => (
              <article className="step-card" key={step.title}>
                <span className="step-number">{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="site-footer-inner">
          <strong>هدايا ريزن يدوية</strong>
          <span>واجهة متجر متناسقة، دافئة، ومهيأة للتوسع بالمنتجات والطلبات.</span>
        </div>
      </footer>
    </main>
  );
}
