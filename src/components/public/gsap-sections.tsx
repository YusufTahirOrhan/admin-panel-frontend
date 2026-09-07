import Image from "next/image";
import { ArrowUpRight, Check, Clock3, Glasses, Mail, MapPin, Phone } from "lucide-react";
import { getGoogleMapsLinks, safePublicHref } from "@/lib/public-content";

type Action = { label: string; href: string } | null;
type SectionHeadingProps = { eyebrow: string; title: string; subtitle?: string; dark?: boolean };

export function SectionHeading({ eyebrow, title, subtitle, dark = false }: SectionHeadingProps) {
  return <div className="max-w-2xl">
    <p className={`text-xs font-bold uppercase tracking-[0.18em] ${dark ? 'text-teal-300' : 'text-teal-700'}`}>{eyebrow}</p>
    <h2 className={`mt-3 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl ${dark ? 'text-white' : 'text-slate-950'}`}>{title}</h2>
    {subtitle && <p className={`mt-4 text-base leading-7 ${dark ? 'text-slate-300' : 'text-slate-600'}`}>{subtitle}</p>}
  </div>;
}

function Actions({ primary, secondary }: { primary?: Action; secondary?: Action }) {
  const actions = [primary, secondary].filter((action): action is NonNullable<Action> => Boolean(action && safePublicHref(action.href)));
  return actions.length > 0 && <div className="mt-8 flex flex-wrap gap-3">
    {actions.map((action, index) => <a key={action.href} href={action.href} className={`inline-flex min-h-12 items-center justify-center gap-3 rounded-lg px-5 py-3 text-sm font-semibold ${index === 0 ? 'bg-teal-300 text-slate-950 hover:bg-teal-200' : 'border border-white/25 text-white hover:bg-white/10'}`}>
      {action.label}<ArrowUpRight aria-hidden="true" className="size-4 shrink-0" />
    </a>)}
  </div>;
}

export function GsapHero({ eyebrow, title, subtitle, highlights, imageUrl, primaryButton, secondaryButton }: {
  eyebrow: string; title: string; subtitle: string; highlights: string[]; imageUrl: string; primaryButton?: Action; secondaryButton?: Action;
}) {
  return <section className="bg-slate-950 text-white">
    <div className="public-container grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:py-20">
      <div className="min-w-0">
        <p className="max-w-sm text-xs font-bold uppercase leading-6 tracking-[0.18em] text-teal-300">{eyebrow}</p>
        <h1 className="mt-5 max-w-2xl text-4xl font-semibold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">{title}</h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">{subtitle}</p>
        <Actions primary={primaryButton} secondary={secondaryButton} />
        {highlights.length > 0 && <ul className="mt-9 flex flex-wrap gap-x-5 gap-y-3 border-t border-white/15 pt-6 text-sm text-slate-300">
          {highlights.map((highlight, index) => <li key={`${highlight}-${index}`} className="flex items-center gap-2"><Check aria-hidden="true" className="size-4 shrink-0 text-teal-300" />{highlight}</li>)}
        </ul>}
      </div>
      {imageUrl ? <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-900"><Image src={imageUrl} alt={title} fill preload sizes="(min-width: 1024px) 480px, 100vw" className="object-cover" /></div> : <div aria-hidden="true" className="relative grid aspect-[4/3] place-items-center rounded-2xl border border-white/15 bg-slate-900">
        <Glasses className="h-32 w-3/4 text-teal-200 sm:h-44" strokeWidth={0.65} />
      </div>}
    </div>
  </section>;
}

type ListProps = { title: string; subtitle?: string; items: string[] };
export function GsapServices({ title, subtitle, items }: ListProps) {
  return <section id="services" className="public-section bg-white"><div className="public-container">
    <SectionHeading eyebrow="Hizmetler" title={title} subtitle={subtitle} />
    <ul className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{items.map((item, index) => <li key={`${item}-${index}`} className="rounded-xl border border-slate-200 bg-slate-50 p-6">
      <span aria-hidden="true" className="text-xs font-semibold text-teal-700">{String(index + 1).padStart(2, '0')}</span>
      <h3 className="mt-5 text-lg font-semibold leading-7 text-slate-900">{item}</h3>
    </li>)}</ul>
  </div></section>;
}

export function GsapProducts({ title, subtitle, items }: ListProps) {
  return <section id="products" className="public-section border-y border-slate-200 bg-slate-50"><div className="public-container">
    <SectionHeading eyebrow="Koleksiyon" title={title} subtitle={subtitle} />
    <ul className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{items.map((item, index) => <li key={`${item}-${index}`} className="flex items-center gap-5 rounded-xl border border-slate-200 bg-white p-6">
      <Glasses aria-hidden="true" className="size-9 shrink-0 text-teal-700" strokeWidth={1.3} /><h3 className="text-lg font-semibold leading-7 text-slate-950">{item}</h3>
    </li>)}</ul>
  </div></section>;
}

export function GsapAbout({ title, body, imageUrl }: { title: string; body: string; imageUrl: string }) {
  return <section id="about" className="public-section bg-white"><div className={`public-container grid items-center gap-8 ${imageUrl ? 'md:grid-cols-2' : 'md:grid-cols-[1fr_1.1fr]'}`}>
    <SectionHeading eyebrow="OptiMaxx yaklaşımı" title={title} />
    <div>{imageUrl && <div className="relative mb-6 aspect-video overflow-hidden rounded-xl"><Image src={imageUrl} alt={title} fill sizes="(min-width: 768px) 560px, 100vw" className="object-cover" /></div>}<p className="whitespace-pre-line text-lg leading-8 text-slate-600">{body}</p></div>
  </div></section>;
}

export function GsapCta({ title, subtitle, primaryButton, secondaryButton, imageUrl }: { title: string; subtitle: string; primaryButton?: Action; secondaryButton?: Action; imageUrl: string }) {
  return <section className="public-section bg-slate-950 text-white"><div className={`public-container grid items-center gap-8 ${imageUrl ? 'md:grid-cols-[1.2fr_0.8fr]' : ''}`}>
    <div><h2 className="max-w-2xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{title}</h2><p className="mt-4 max-w-2xl leading-7 text-slate-300">{subtitle}</p><Actions primary={primaryButton} secondary={secondaryButton} /></div>
    {imageUrl && <div className="relative aspect-video overflow-hidden rounded-xl"><Image src={imageUrl} alt={title} fill sizes="(min-width: 768px) 440px, 100vw" className="object-cover" /></div>}
  </div></section>;
}

export function GsapHours({ title, subtitle, weekdays, saturday, sunday, note }: { title: string; subtitle?: string; weekdays: string; saturday: string; sunday: string; note?: string }) {
  return <section id="hours" className="public-section border-b border-slate-200 bg-slate-50"><div className="public-container grid gap-8 md:grid-cols-2 md:gap-16">
    <div><SectionHeading eyebrow="Ziyaretinizi planlayın" title={title} subtitle={subtitle} />{note && <p className="mt-6 flex items-start gap-2 text-sm leading-6 text-slate-600"><Clock3 aria-hidden="true" className="mt-1 size-4 shrink-0" />{note}</p>}</div>
    <dl className="self-start rounded-xl border border-slate-200 bg-white px-6">{[['Hafta içi', weekdays], ['Cumartesi', saturday], ['Pazar', sunday]].map(([day, time]) => <div key={day} className="flex flex-wrap justify-between gap-3 border-b border-slate-200 py-5 last:border-0"><dt className="font-medium text-slate-600">{day}</dt><dd className="font-semibold text-slate-950">{time || 'Belirtilmedi'}</dd></div>)}</dl>
  </div></section>;
}

export function GsapContact({ title, address, phone, email, mapUrl }: { title: string; address: string; phone: string; email: string; mapUrl: string }) {
  const maps = getGoogleMapsLinks(mapUrl, address);
  const phoneHref = phone ? safePublicHref(`tel:${phone.replace(/[^+\d]/g, '')}`) : null;
  const emailHref = email ? safePublicHref(`mailto:${email}`) : null;
  return <section id="contact" className="public-section bg-white"><div className="public-container grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
    <div><SectionHeading eyebrow="Bize ulaşın" title={title} />
      {address && <address className="mt-6 flex items-start gap-3 not-italic leading-7 text-slate-600"><MapPin aria-hidden="true" className="mt-1 size-5 shrink-0 text-teal-700" />{address}</address>}
      <div className="mt-7 space-y-3">
        {phoneHref && <a href={phoneHref} className="flex min-h-16 items-center gap-4 rounded-xl border border-slate-200 p-4 hover:border-teal-600 hover:bg-teal-50"><Phone aria-hidden="true" className="size-5 shrink-0 text-teal-700" /><span className="min-w-0"><span className="block text-xs text-slate-600">Telefon</span><span className="mt-1 block break-words font-semibold text-slate-950">{phone}</span></span></a>}
        {emailHref && <a href={emailHref} className="flex min-h-16 items-center gap-4 rounded-xl border border-slate-200 p-4 hover:border-teal-600 hover:bg-teal-50"><Mail aria-hidden="true" className="size-5 shrink-0 text-teal-700" /><span className="min-w-0"><span className="block text-xs text-slate-600">E-posta</span><span className="mt-1 block break-all font-semibold text-slate-950">{email}</span></span></a>}
      </div>
    </div>
    <div className="min-w-0">{maps.embedUrl ? <iframe title="OptiMaxx mağaza haritası" src={maps.embedUrl} className="h-80 w-full rounded-xl border border-slate-200 bg-slate-50" loading="lazy" referrerPolicy="strict-origin-when-cross-origin" /> : <div className="grid h-64 place-items-center rounded-xl bg-slate-50 p-8 text-center text-sm leading-6 text-slate-600">Konum bilgisi şu anda görüntülenemiyor.</div>}
      {maps.directionsUrl && <a href={maps.directionsUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg border border-slate-300 px-4 text-sm font-semibold text-teal-800 hover:bg-teal-50">Google Haritalar’da aç<span className="sr-only"> (yeni sekme)</span><ArrowUpRight aria-hidden="true" className="size-4" /></a>}
    </div>
  </div></section>;
}

export function GsapSocialFooter({ socialTitle, socialSubtitle, socialItems }: { socialTitle: string; socialSubtitle?: string; socialItems: { label: string; url: string }[] }) {
  const links = socialItems.filter((item) => safePublicHref(item.url));
  return <>{links.length > 0 && <section className="border-t border-slate-200 bg-slate-50 py-10"><div className="public-container flex flex-col justify-between gap-6 md:flex-row md:items-center"><div><h2 className="text-xl font-semibold text-slate-950">{socialTitle}</h2>{socialSubtitle && <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">{socialSubtitle}</p>}</div><div className="flex flex-wrap gap-2">{links.map((item) => <a key={item.url} href={item.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-slate-300 px-4 text-sm font-medium text-slate-800 hover:bg-white">{item.label}<span className="sr-only"> (yeni sekme)</span><ArrowUpRight aria-hidden="true" className="size-4" /></a>)}</div></div></section>}</>;
}
