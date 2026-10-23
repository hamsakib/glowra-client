import Image from "next/image";

/**
 * Optimised image: Unsplash photos go through next/image (resized, AVIF/WebP, lazy).
 * Images uploaded to our API are already resized to WebP by the server, so they render
 * as a plain lazy <img> to avoid proxying them through the optimiser twice.
 */
export function SmartImage({ src, alt, fill, sizes, priority, className, width, height }) {
  if (!src) return <div className={className} aria-hidden="true" />;
  if (src.startsWith("https://images.unsplash.com/")) {
    return (
      <Image
        src={src}
        alt={alt}
        fill={fill}
        sizes={sizes}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        priority={priority}
        quality={75}
        className={className}
      />
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      width={width}
      height={height}
      className={fill ? `absolute inset-0 h-full w-full ${className || ""}` : className}
    />
  );
}
