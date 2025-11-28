# Next.js Yandex Metrica (Atom Version)

Yandex Metrica integration for Next.js, refactored to use [Jotai](https://github.com/pmndrs/jotai) atoms instead of React Context. This eliminates the need for provider nesting.

> This project is a fork of [next-yandex-metrica](https://github.com/v-doronin/next-yandex-metrica) by Vladislav Doronin. It has been refactored to use Jotai atoms for better flexibility.

## Features

- **No Nesting Required**: The Provider component doesn't need to wrap your application. Just place it in your root layout.
- **Global Access**: Access Metrica methods from anywhere using the hook.
- **Lightweight**: Powered by Jotai atoms.
- **Cache Component Compatible**: Works seamlessly with Next.js cache components, unlike traditional Context-based solutions.

## Why Jotai?

This package is a fork of [next-yandex-metrica](https://github.com/v-doronin/next-yandex-metrica) refactored to use [Jotai](https://github.com/pmndrs/jotai) atoms instead of React Context.

The main reason for this change is **Next.js cache component compatibility**. When you enable cache components in Next.js, you cannot use `usePathname` or other router hooks directly within cached components. Traditional Context-based solutions require nesting the provider inside the component tree, which conflicts with cache components.

With Jotai atoms, the provider doesn't need to wrap the component tree - it can be placed anywhere in your root layout, and the atoms provide global state access without Context nesting. This makes it compatible with Next.js cache components while maintaining the same API.

```tsx
// ✅ Works with cache components
<Suspense>
  <YandexMetricaProvider
    tagID={12345678}
    initParameters={{ clickmap: true, trackLinks: true, accurateTrackBounce: true }}
    router="app"
  />
</Suspense>
```

## Installation

```bash
npm install next-yandex-metrica-atom
# or
pnpm add next-yandex-metrica-atom
```

## Usage

### Add the provider

Place the `<YandexMetricaProvider />` in your root layout or app component. It does not need to wrap `children`.

#### App router

```tsx
// app/layout.tsx
import { YandexMetricaProvider } from 'next-yandex-metrica-atom';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
    <Suspense>
      <YandexMetricaProvider
        tagID={12345678}
        initParameters={{ clickmap: true, trackLinks: true, accurateTrackBounce: true }}
        router="app"
      />
        </Suspense>
      {children}
    </>
  );
}
```

> **Note:** `YandexMetricaProvider` uses the `"use client"` directive.

#### `YandexMetricaProvider` Props

| Name                      | Description                                                                                                                          |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `tagID`                   | Yandex.Metrica tag ID.                                                                                                               |
| `strategy`                | [next/script](https://nextjs.org/docs/api-reference/next/script#strategy) loading strategy. Defaults to `afterInteractive`.          |
| `initParameters`          | Yandex.Metrica tag [initialization parameters](https://yandex.com/support/metrica/code/counter-initialize.html).                     |
| `shouldUseAlternativeCDN` | Use the [alternative CDN](https://yandex.ru/support/metrica/general/counter-general.html?lang=en#other__cdn) to load Yandex.Metrica. |
| `router`                  | `app` or `pages`                                                                                                                     |

Yandex.Metrica tag ID is read from the `tagID` property and the `NEXT_PUBLIC_YANDEX_METRICA_ID` environment variable. If both are set, the provider property takes priority.

### Send events

`next/router` pageviews are tracked automatically.

The package provides `useMetrica` hook for sending custom analytics events.

```jsx
import { useMetrica } from 'next-yandex-metrica-atom';

export function ActionButton() {
  const { reachGoal } = useMetrica();

  return (
    <button type="button" onClick={() => reachGoal('cta-click')}>
      CTA
    </button>
  );
}
```

The returned functions accept the same parameters as those found in the [Yandex.Metrica object methods](https://yandex.com/support/metrica/objects/method-reference.html).

All functions are automatically provided with the tag ID that is supplied to the provider or the environment variable. `useMetrica` hook exposes functions for calling `notBounce`, `reachGoal`, `setUserID`, and `userParams` without specifying the event name. Other methods can be called using the `ymEvent` function, with the event name as the first argument. In both cases, all event parameters are type-checked.

```jsx
import { useMetrica } from 'next-yandex-metrica-atom';

export function ActionButton() {
  const { ymEvent } = useMetrica();

  const handleExternalLinkClick = () => {
    ymEvent('extLink', 'https://www.google.com');
  };

  // ...
}
```

In case if you need to use the Yandex.Metrica object directly, you can access it using the `ym` property.

```jsx
import { ym } from 'next-yandex-metrica-atom';

export function ActionButton() {
  return (
    <button type="button" onClick={() => ym(12345678, 'reachGoal', 'cta-click')}>
      CTA
    </button>
  );
}
```

## Credits

This project is a fork of [next-yandex-metrica](https://github.com/v-doronin/next-yandex-metrica). Thanks to [Vladislav Doronin](https://github.com/v-doronin) for the original implementation.
