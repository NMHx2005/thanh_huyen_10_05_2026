"use client";

import Box from "@mui/material/Box";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { DocumentCard, type DocumentCardModel } from "@/components/document/DocumentCard";

type Props = {
  documents: DocumentCardModel[];
  /** Số slide hiển thị mặc định (desktop) */
  slidesPerView?: number;
};

export function DocumentSwiper({ documents, slidesPerView = 4 }: Props) {
  if (!documents.length) return null;

  return (
    <Box
      className="document-swiper"
      sx={{
        width: 1,
        minWidth: 0,
        position: "relative",
        pb: 3,
        "& .swiper": { width: "100%", maxWidth: "100%" },
        "& .swiper-button-prev, & .swiper-button-next": {
          color: "primary.main",
        },
        "& .swiper-button-prev::after, & .swiper-button-next::after": {
          fontSize: "1.35rem !important",
        },
      }}
    >
      <Swiper
        modules={[Navigation, Pagination]}
        navigation
        pagination={{ clickable: true, dynamicBullets: true }}
        direction="horizontal"
        grabCursor
        spaceBetween={20}
        slidesPerView={1.75}
        breakpoints={{
          480: { slidesPerView: 2.35, spaceBetween: 20 },
          640: { slidesPerView: 2.65, spaceBetween: 22 },
          768: { slidesPerView: 3.15, spaceBetween: 22 },
          1024: { slidesPerView, spaceBetween: 24 },
          1280: { slidesPerView: Math.min(slidesPerView + 0.35, 5.5), spaceBetween: 24 },
        }}
        style={
          {
            paddingBottom: "8px",
            "--swiper-navigation-size": "36px",
            "--swiper-navigation-color": "#F97316",
          } as React.CSSProperties
        }
      >
        {documents.map((doc) => (
          <SwiperSlide key={doc.id} style={{ height: "auto" }}>
            <DocumentCard doc={doc} compact />
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
}
