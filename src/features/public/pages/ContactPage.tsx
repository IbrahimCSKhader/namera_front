import { BRAND } from '../../../shared/constants/brand';

const contactLinks = [
  {
    label: 'WhatsApp',
    username: '+972 59-576-9185',
    description: 'للطلبات السريعة والاستفسارات عن التخصيصات.',
    href: 'https://wa.me/972595769185',
    className: 'whatsapp',
    Icon: WhatsAppIcon,
  },
  {
    label: 'Instagram',
    username: '@resin.bon',
    description: 'تابع أحدث التصاميم والقطع الجاهزة للإلهام.',
    href: 'https://www.instagram.com/resin.bon',
    className: 'instagram',
    Icon: InstagramIcon,
  },
];

export function ContactPage() {
  return (
    <main className="contact-page">
      <section className="contact-hero">
        <p className="eyebrow">{BRAND.name}</p>
        <h1>تواصل معنا</h1>
        <p>اختر الطريقة الأنسب، وأرسل تفاصيل القطعة أو المناسبة لنرتب الطلب بالشكل المناسب.</p>
      </section>

      <section className="contact-card">
        <div className="contact-card-copy">
          <span>معلومات التواصل</span>
          <h2>نرد عليك بأقرب وقت</h2>
          <p>للطلبات المخصصة، الصور، الألوان، والتغليف، أرسل الفكرة أو صورة مرجعية وسنرتب التفاصيل معك.</p>
        </div>

        <div className="contact-link-grid">
          {contactLinks.map(({ Icon, ...link }) => (
            <a className={`contact-link-card ${link.className}`} href={link.href} key={link.label} rel="noreferrer" target="_blank">
              <span className="contact-link-logo" aria-hidden="true">
                <Icon />
              </span>
              <span>
                <small>{link.label}</small>
                <strong dir="ltr">{link.username}</strong>
                <em>{link.description}</em>
              </span>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <path d="M16 3.2A12.5 12.5 0 0 0 5.4 22.4L4 28l5.7-1.5A12.5 12.5 0 1 0 16 3.2Zm0 2.4a10.1 10.1 0 0 1 8.6 15.3 10.1 10.1 0 0 1-13.9 3.6l-.4-.2-3 .8.8-2.9-.3-.4A10.1 10.1 0 0 1 16 5.6Zm-4.4 5.1c-.3 0-.8.1-1.2.6-.4.4-1.5 1.5-1.5 3.6s1.5 4.1 1.7 4.4c.2.3 3 4.7 7.4 6.3 3.6 1.4 4.4.9 5.2.8.8-.1 2.5-1 2.9-2 .4-1 .4-1.8.3-2-.1-.2-.4-.3-.8-.5l-2.8-1.4c-.4-.1-.7-.2-1 .2-.3.4-1.1 1.4-1.3 1.7-.2.3-.5.3-.9.1a8.3 8.3 0 0 1-2.5-1.5 9.4 9.4 0 0 1-1.7-2.1c-.2-.4 0-.6.2-.8l.6-.7c.2-.2.3-.4.4-.7.1-.3.1-.5 0-.7l-1.3-3.1c-.3-.8-.6-.7-1-.7h-.8Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <path d="M10.7 4h10.6A6.7 6.7 0 0 1 28 10.7v10.6a6.7 6.7 0 0 1-6.7 6.7H10.7A6.7 6.7 0 0 1 4 21.3V10.7A6.7 6.7 0 0 1 10.7 4Zm0 2.4a4.3 4.3 0 0 0-4.3 4.3v10.6a4.3 4.3 0 0 0 4.3 4.3h10.6a4.3 4.3 0 0 0 4.3-4.3V10.7a4.3 4.3 0 0 0-4.3-4.3H10.7Zm12 2.2a1.7 1.7 0 1 1 0 3.4 1.7 1.7 0 0 1 0-3.4ZM16 9.9a6.1 6.1 0 1 1 0 12.2 6.1 6.1 0 0 1 0-12.2Zm0 2.4a3.7 3.7 0 1 0 0 7.4 3.7 3.7 0 0 0 0-7.4Z" />
    </svg>
  );
}
