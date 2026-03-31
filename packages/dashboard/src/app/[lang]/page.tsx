// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { getDictionary } from "../../i18n/getDictionary";
import { Locale } from "../../i18n/config";
import HomeWrapper from "./HomeWrapper";

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = (await params) as { lang: Locale };
  const dictionary = await getDictionary(lang);

  return <HomeWrapper dictionary={dictionary} lang={lang} />;
}
