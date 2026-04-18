import { Metadata } from "next";
import { i18n, Locale } from "../../i18n/config";
import { getDictionary } from "../../i18n/getDictionary";
import HomeWrapper from "./HomeWrapper";

import { generateLocalizedMetadata } from "@/i18n/generate-metadata";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    return generateLocalizedMetadata({
        params,
        title: "SupraWall | Enterprise AI Agent Security & Runtime Guardrails",
        description: "Secure your autonomous AI agents with the first zero-trust runtime firewall. Block prompt injection, prevent unauthorized tool execution, and control LLM costs.",
        internalPath: ""
    });
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
