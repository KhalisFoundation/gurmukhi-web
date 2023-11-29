import React from 'react';

export default function WordsPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // check if children contains 
  return (
    <div className="flex flex-col items-center justify-between gap-5 p-12 pb-0">
      {children}
    </div>
  );
}
