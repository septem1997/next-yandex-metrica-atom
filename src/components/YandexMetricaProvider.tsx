'use client';

import { useSetAtom } from 'jotai';
import Script, { ScriptProps } from 'next/script';
import React, { FC, useEffect, useMemo } from 'react';

import { useTrackRouteChange } from '../hooks/useTrackRouteChange';
import { metricaTagIDAtom } from '../lib/atom';
import { InitParameters } from '../lib/types/parameters';
import { NextRouter } from '../lib/types/router';

interface Props {
  tagID?: number;
  strategy?: ScriptProps['strategy'];
  initParameters?: InitParameters;
  shouldUseAlternativeCDN?: boolean;
  router: NextRouter;
}

export const YandexMetricaProvider: FC<Props> = ({
  tagID,
  strategy = 'afterInteractive',
  initParameters,
  shouldUseAlternativeCDN = false,
  router,
}) => {
  const setTagID = useSetAtom(metricaTagIDAtom);
  const YANDEX_METRICA_ID = process.env.NEXT_PUBLIC_YANDEX_METRICA_ID;
  const id = useMemo(() => {
    return tagID || (YANDEX_METRICA_ID ? Number(YANDEX_METRICA_ID) : null);
  }, [YANDEX_METRICA_ID, tagID]);

  useEffect(() => {
    setTagID(id);
  }, [id, setTagID]);

  useTrackRouteChange({ tagID: id, router });

  if (!id) {
    console.warn('[next-yandex-metrica] Yandex.Metrica tag ID is not defined');

    return null;
  }

  const scriptSrc = shouldUseAlternativeCDN
    ? 'https://cdn.jsdelivr.net/npm/yandex-metrica-watch/tag.js'
    : 'https://mc.yandex.ru/metrika/tag.js';

  return (
    <>
      <Script id="yandex-metrica" strategy={strategy}>
        {`
          (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
          m[i].l=1*new Date();
          for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
          k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
          (window, document, "script", "${scriptSrc}", "ym");
          ym(${id}, "init", ${JSON.stringify(initParameters || {})});
        `}
      </Script>
      {/** Using dangerouslySetInnerHTML to bypass Next.js image optimization which interferes with Yandex tracking pixel
       * @see https://github.com/vercel/next.js/issues/56882
       */}
      <noscript
        id="yandex-metrica-pixel"
        dangerouslySetInnerHTML={{
          __html: `<div><img src="https://mc.yandex.ru/watch/${id}" style="position:absolute; left:-9999px;" alt="" /></div>`,
        }}
      />
    </>
  );
};
