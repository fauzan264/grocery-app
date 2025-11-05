"use client";
import { mockBanners } from "@/features/home/data/banners";
import { categories } from "@/features/home/data/categories";
import { IProduct, IPromo } from "@/features/home/types";
import { getPublicProducts } from "@/services/public";
import useLocationStore from "@/store/useLocationStore";
import { formatPrice } from "@/utils/formatPrice";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [banners, setBanners] = useState<IPromo[]>([]);
  const { selectedStore } = useLocationStore();

  const onGetProducts = async ({
    storeId,
    page,
    limit,
  }: {
    storeId?: string;
    page?: string;
    limit?: string;
  }) => {
    const response = await getPublicProducts({ storeId, page, limit });
    setProducts(response.data.data.products);
  };

  useEffect(() => {
    setBanners(mockBanners);
    if (selectedStore) {
      onGetProducts({ storeId: selectedStore.id });
    }
  }, [selectedStore]);

  // Auto slide carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);

  return (
    <div className="bg-slate-200 min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Carousel - Full Width */}
        <div className="w-full">
          <div className="relative w-full h-[200px] sm:h-[250px] md:h-[350px] lg:h-[450px] bg-gray-300 overflow-hidden">
            {banners.length > 0 && (
              <>
                <Image
                  src={banners[currentSlide]?.image}
                  alt="Banner"
                  fill
                  className="object-cover transition-opacity duration-500"
                  priority
                />
                <div className="absolute inset-0 flex items-center justify-between px-2 sm:px-4 md:px-6">
                  <button
                    onClick={prevSlide}
                    className="btn btn-circle btn-xs sm:btn-sm md:btn-md bg-white/80 hover:bg-white border-0 shadow-lg"
                  >
                    ❮
                  </button>
                  <button
                    onClick={nextSlide}
                    className="btn btn-circle btn-xs sm:btn-sm md:btn-md bg-white/80 hover:bg-white border-0 shadow-lg"
                  >
                    ❯
                  </button>
                </div>
                <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2">
                  {banners.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`h-2 sm:h-2.5 rounded-full transition-all ${
                        idx === currentSlide
                          ? "bg-white w-6 sm:w-8"
                          : "bg-white/50 w-2 sm:w-2.5"
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Categories */}
        <div className="bg-gradient-to-b from-slate-50 via-slate-200 to-slate-300">
          <div className="w-full max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 md:gap-6">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex flex-col items-center gap-2 cursor-pointer group"
                >
                  <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden bg-white shadow-md group-hover:shadow-lg transition-shadow">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="text-xs md:text-sm text-center font-medium text-slate-700">
                    {category.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="w-full max-w-7xl mx-auto px-4 py-10 pb-20">
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-10 text-slate-900">
            Featured Products
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {products.map((product) => (
              <Link key={product.id} href={`/product/${product.id}`}>
                <div className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                  <figure className="relative h-40 overflow-hidden bg-gray-200">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </figure>
                  <div className="card-body p-4">
                    <h2 className="card-title text-base truncate">
                      {product.name}
                    </h2>
                    <p className="text-lg font-semibold text-amber-600">
                      {formatPrice(product.price)}
                    </p>
                    <button className="btn btn-sm bg-amber-400 hover:bg-amber-500 text-white border-0 w-full mt-2">
                      Buy Now
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
