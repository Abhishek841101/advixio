"use client";

import { useEffect, useState } from "react";

type Props = {
  images?: string[];
  productName: string;
};

export default function ProductImageGallery({
  images = [],
  productName,
}: Props) {
  const validImages = images.filter(
    (image) =>
      typeof image === "string" &&
      image.trim() !== ""
  );

  const [activeIndex, setActiveIndex] = useState(0);

  /*
   * ==========================================
   * CURRENT IMAGE
   * ==========================================
   */

  const currentImage =
    validImages[activeIndex] ||
    "/products/product-placeholder.jpg";

  /*
   * ==========================================
   * NEXT IMAGE
   * ==========================================
   */

  const nextImage = () => {
    if (validImages.length <= 1) {
      return;
    }

    setActiveIndex((current) => {
      if (
        current >=
        validImages.length - 1
      ) {
        return 0;
      }

      return current + 1;
    });
  };

  /*
   * ==========================================
   * PREVIOUS IMAGE
   * ==========================================
   */

  const previousImage = () => {
    if (validImages.length <= 1) {
      return;
    }

    setActiveIndex((current) => {
      if (current === 0) {
        return validImages.length - 1;
      }

      return current - 1;
    });
  };

  /*
   * ==========================================
   * AUTO SLIDER
   *
   * Every 5 seconds
   * ==========================================
   */

  useEffect(() => {
    if (validImages.length <= 1) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((current) => {
        if (
          current >=
          validImages.length - 1
        ) {
          return 0;
        }

        return current + 1;
      });
    }, 5000);

    return () => {
      window.clearInterval(interval);
    };
  }, [validImages.length]);

  /*
   * ==========================================
   * RESET INDEX IF IMAGES CHANGE
   * ==========================================
   */

  useEffect(() => {
    if (
      activeIndex >= validImages.length &&
      validImages.length > 0
    ) {
      setActiveIndex(0);
    }
  }, [validImages.length, activeIndex]);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "600px",
      }}
    >
      {/* ======================================
          MAIN IMAGE
      ====================================== */}

      <div
        style={{
          position: "relative",
          width: "100%",
          height: "460px",
          overflow: "hidden",
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "14px",
        }}
      >
        <img
          key={currentImage}
          src={currentImage}
          alt={`${productName} image ${
            activeIndex + 1
          }`}
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            objectFit: "contain",
            padding: "18px",
          }}
          onLoad={() => {
            console.log(
              "IMAGE LOADED:",
              currentImage
            );
          }}
          onError={() => {
            console.error(
              "IMAGE FAILED:",
              currentImage
            );
          }}
        />

        {/* ====================================
            PREVIOUS ARROW
        ==================================== */}

        {validImages.length > 1 && (
          <button
            type="button"
            onClick={previousImage}
            aria-label="Previous image"
            style={{
              position: "absolute",
              left: "15px",
              top: "50%",
              transform:
                "translateY(-50%)",

              width: "46px",
              height: "46px",

              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              padding: 0,

              border:
                "1px solid #e5e7eb",
              borderRadius: "50%",

              background:
                "rgba(255,255,255,0.96)",

              color: "#1a1a1a",

              fontSize: "34px",
              fontWeight: "400",
              lineHeight: "1",

              cursor: "pointer",

              zIndex: 20,

              boxShadow:
                "0 4px 14px rgba(0,0,0,0.18)",
            }}
          >
            ‹
          </button>
        )}

        {/* ====================================
            NEXT ARROW
        ==================================== */}

        {validImages.length > 1 && (
          <button
            type="button"
            onClick={nextImage}
            aria-label="Next image"
            style={{
              position: "absolute",
              right: "15px",
              top: "50%",
              transform:
                "translateY(-50%)",

              width: "46px",
              height: "46px",

              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              padding: 0,

              border:
                "1px solid #e5e7eb",
              borderRadius: "50%",

              background:
                "rgba(255,255,255,0.96)",

              color: "#1a1a1a",

              fontSize: "34px",
              fontWeight: "400",
              lineHeight: "1",

              cursor: "pointer",

              zIndex: 20,

              boxShadow:
                "0 4px 14px rgba(0,0,0,0.18)",
            }}
          >
            ›
          </button>
        )}

        {/* ====================================
            IMAGE COUNTER
        ==================================== */}

        {validImages.length > 1 && (
          <div
            style={{
              position: "absolute",
              right: "15px",
              bottom: "15px",

              padding:
                "6px 11px",

              borderRadius:
                "999px",

              background:
                "rgba(0,0,0,0.65)",

              color: "#ffffff",

              fontSize: "12px",
              fontWeight: 600,

              zIndex: 15,
            }}
          >
            {activeIndex + 1} /{" "}
            {validImages.length}
          </div>
        )}
      </div>

      {/* ======================================
          THUMBNAILS
      ====================================== */}

      {validImages.length > 1 && (
        <div
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "14px",
            overflowX: "auto",
            paddingBottom: "4px",
          }}
        >
          {validImages.map(
            (thumbnail, index) => (
              <button
                key={`${thumbnail}-${index}`}
                type="button"
                onClick={() =>
                  setActiveIndex(index)
                }
                aria-label={`Show image ${
                  index + 1
                }`}
                style={{
                  flex: "0 0 auto",

                  width: "72px",
                  height: "72px",

                  padding: "3px",

                  background: "#ffffff",

                  border:
                    activeIndex === index
                      ? "2px solid #4f46e5"
                      : "1px solid #e5e7eb",

                  borderRadius: "9px",

                  cursor: "pointer",

                  overflow: "hidden",
                }}
              >
                <img
                  src={thumbnail}
                  alt={`${productName} ${
                    index + 1
                  }`}
                  style={{
                    display: "block",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "5px",
                  }}
                />
              </button>
            )
          )}
        </div>
      )}

      {/* ======================================
          DOTS
      ====================================== */}

      {validImages.length > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent:
              "center",
            alignItems: "center",
            gap: "7px",
            marginTop: "10px",
          }}
        >
          {validImages.map(
            (_, index) => (
              <button
                key={index}
                type="button"
                onClick={() =>
                  setActiveIndex(index)
                }
                aria-label={`Go to image ${
                  index + 1
                }`}
                style={{
                  width:
                    activeIndex === index
                      ? "20px"
                      : "7px",

                  height: "7px",

                  padding: 0,

                  border: "none",

                  borderRadius:
                    "999px",

                  background:
                    activeIndex === index
                      ? "#4f46e5"
                      : "#d1d5db",

                  cursor: "pointer",

                  transition:
                    "all 0.2s ease",
                }}
              />
            )
          )}
        </div>
      )}
    </div>
  );
}