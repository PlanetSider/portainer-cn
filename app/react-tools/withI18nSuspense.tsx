import { ComponentType, Suspense } from 'react';

export function withI18nSuspense<T>(
  WrappedComponent: ComponentType<T>
): ComponentType<T> {
  // Try to create a nice displayName for React Dev Tools.
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || 'Component';

  function WrapperComponent(props: T & JSX.IntrinsicAttributes) {
    return (
      <Suspense fallback="正在加载翻译...">
        <WrappedComponent {...props} />
      </Suspense>
    );
  }

  WrapperComponent.displayName = `withI18nSuspense(${displayName})`;

  return WrapperComponent;
}
