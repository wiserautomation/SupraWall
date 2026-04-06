import { Metadata } from "next";
import { i18n, Locale } from "../../i18n/config";
import { getDictionary } from "../../i18n/getDictionary";
import HomeWrapper from "./HomeWrapper";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;
    const baseUrl = 'https://www.supra-wall.com';
    
    const languages: Record<string, string> = {};
    i18n.locales.forEach((l) => {
        languages[l] = `${baseUrl}/${l}`;
    });
    languages['x-default'] = `${baseUrl}/en`;

    return {
        alternates: {
            canonical: `${baseUrl}/${lang}`,
            languages,
        },
        openGraph: {
            url: `${baseUrl}/${lang}`,
        }
    };
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = (await params) as { lang: Locale };
  const dictionary = await getDictionary(lang);

  return <HomeWrapper dictionary={dictionary} lang={lang} />;
}
