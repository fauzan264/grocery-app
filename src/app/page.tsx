"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

interface IPromo {
  id: number;
  image: string;
}

interface IProduct {
  id: number;
  name: string;
  price: number;
  image: string;
}

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [banners, setBanners] = useState<IPromo[]>([]);

  const mockBanners: IPromo[] = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1721219178064-7758ebc5580d?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1672363547647-8fad02572412?q=80&w=2344&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];

  const mockProducts: IProduct[] = [
    {
      id: 1,
      name: "Orange",
      price: 20000,
      image:
        "https://images.unsplash.com/photo-1572898170625-b4344fa56d22?q=80&w=2334&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 2,
      name: "Apple",
      price: 20000,
      image:
        "https://images.unsplash.com/photo-1623780494339-f7ed013ebbc4?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 3,
      name: "Mango",
      price: 20000,
      image:
        "https://plus.unsplash.com/premium_photo-1724255862358-b58750ad31a8?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 4,
      name: "Banana",
      price: 20000,
      image:
        "https://plus.unsplash.com/premium_photo-1724250081102-cab0e5cb314c?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 5,
      name: "Milk",
      price: 20000,
      image:
        "https://images.unsplash.com/photo-1588710929895-6ee7a0a4d155?q=80&w=2342&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 6,
      name: "Coffee",
      price: 20000,
      image:
        "https://plus.unsplash.com/premium_photo-1675237625862-d982e7f44696?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];

  useEffect(() => {
    setBanners(mockBanners);
    setProducts(mockProducts);
    // Nanti ganti dengan:
    // fetchBanners();
    // fetchProducts();
  }, []);

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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="bg-slate-200 min-h-screen flex flex-col pt-20">
      <main className="flex-1">
        {/* Carousel */}
        <div className="flex justify-center py-8">
          <div className="w-full max-w-7xl px-4 md:px-0">
            <div className="relative w-full h-80 md:h-96 bg-gray-300 rounded-lg overflow-hidden shadow-lg">
              {banners.length > 0 && (
                <>
                  <img
                    src={banners[currentSlide]?.image}
                    alt="Banner"
                    className="w-full h-full object-cover transition-opacity duration-500"
                  />
                  <div className="absolute inset-0 flex items-center justify-between px-4">
                    <button
                      onClick={prevSlide}
                      className="btn btn-circle btn-sm md:btn-md bg-white/80 hover:bg-white border-0"
                    >
                      ❮
                    </button>
                    <button
                      onClick={nextSlide}
                      className="btn btn-circle btn-sm md:btn-md bg-white/80 hover:bg-white border-0"
                    >
                      ❯
                    </button>
                  </div>
                  {/* Dots */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {banners.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          idx === currentSlide ? "bg-white w-6" : "bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
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
                  <figure className="h-40 overflow-hidden bg-gray-200">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </figure>
                  <div className="card-body p-4">
                    <h2 className="card-title text-base">{product.name}</h2>
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
