// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
