import { BRAND } from '../../../shared/constants/brand';

type StaticPageProps = {
  title: string;
  subtitle: string;
};

export function StaticPage({ title, subtitle }: StaticPageProps) {
  return (
    <main className="app-page">
      <section className="placeholder-page static-page">
        <p className="eyebrow">{BRAND.name}</p>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </section>
    </main>
  );
}
