interface ObjectImageProps {
  imageUrl: string;
  altText: string;
}

export function ObjectImage({
  imageUrl,
  altText,
}: ObjectImageProps) {
  return (
    <div className="object-image-container">
      <img
        src={imageUrl}
        alt={altText}
        className="object-image"
      />
    </div>
  );
}