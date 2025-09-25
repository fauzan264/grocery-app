import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-slate-200 min-h-screen">
      <div className="flex justify-center mb-15">
        <div className="carousel w-full max-w-11/12 rounded-box mt-20">
          <div id="slide1" className="carousel-item relative w-full">
            <img
              src="https://images.unsplash.com/photo-1721219178064-7758ebc5580d?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              className="w-full h-92 object-cover"
            />
            <div className="absolute left-5 right-5 top-50 flex -translate-y-1/2 transform justify-between">
              <a href="#slide2" className="btn btn-circle">
                ❮
              </a>
              <a href="#slide2" className="btn btn-circle">
                ❯
              </a>
            </div>
          </div>
          <div id="slide2" className="carousel-item relative w-full">
            <img
              src="https://images.unsplash.com/photo-1672363547647-8fad02572412?q=80&w=2344&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              className="w-full h-92 object-cover"
            />
            <div className="absolute left-5 right-5 top-50 flex -translate-y-1/2 transform justify-between">
              <a href="#slide1" className="btn btn-circle">
                ❮
              </a>
              <a href="#slide3" className="btn btn-circle">
                ❯
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="w-11/12 mx-auto py-10">
        <h1 className="py-5 text-lg font-semibold text-center">Product</h1>
        <div className="grid grid-cols-1 md:grid-cols-6 justify-items-center">
          <div className="card bg-base-100 w-52 shadow-sm gap-3 mb-10">
            <Link href={"#"}>
              <figure className="rounded-t-md">
                <img
                  src="https://images.unsplash.com/photo-1572898170625-b4344fa56d22?q=80&w=2334&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Orange"
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title text-md">Orange</h2>
                <p>Rp. 20.000</p>
                <div className="card-actions justify-end">
                  <button className="btn btn-sm bg-amber-400 text-white hover:shadow-md text-sm rounded-md w-full">
                    Buy Now
                  </button>
                </div>
              </div>
            </Link>
          </div>
          <div className="card bg-base-100 w-52 shadow-sm gap-3 mb-10">
            <Link href={"#"}>
              <figure className="rounded-t-md">
                <img
                  src="https://images.unsplash.com/photo-1623780494339-f7ed013ebbc4?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Apple"
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title text-md">Apple</h2>
                <p>Rp. 20.000</p>
                <div className="card-actions justify-end">
                  <button className="btn btn-sm bg-amber-400 text-white hover:shadow-md text-sm rounded-md w-full">
                    Buy Now
                  </button>
                </div>
              </div>
            </Link>
          </div>
          <div className="card bg-base-100 w-52 shadow-sm gap-3 mb-10">
            <Link href={"#"}>
              <figure className="rounded-t-md">
                <img
                  src="https://plus.unsplash.com/premium_photo-1724255862358-b58750ad31a8?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Mango"
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title text-md">Mango</h2>
                <p>Rp. 20.000</p>
                <div className="card-actions justify-end">
                  <button className="btn btn-sm bg-amber-400 text-white hover:shadow-md text-sm rounded-md w-full">
                    Buy Now
                  </button>
                </div>
              </div>
            </Link>
          </div>
          <div className="card bg-base-100 w-52 shadow-sm gap-3 mb-10">
            <Link href={"#"}>
              <figure className="rounded-t-md">
                <img
                  src="https://plus.unsplash.com/premium_photo-1724250081102-cab0e5cb314c?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Banana"
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title text-md">Banana</h2>
                <p>Rp. 20.000</p>
                <div className="card-actions justify-end">
                  <button className="btn btn-sm bg-amber-400 text-white hover:shadow-md text-sm rounded-md w-full">
                    Buy Now
                  </button>
                </div>
              </div>
            </Link>
          </div>
          <div className="card bg-base-100 w-52 shadow-sm gap-3 mb-10">
            <Link href={"#"}>
              <figure className="rounded-t-md">
                <img
                  src="https://images.unsplash.com/photo-1588710929895-6ee7a0a4d155?q=80&w=2342&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Milk"
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title text-md">Milk</h2>
                <p>Rp. 20.000</p>
                <div className="card-actions justify-end">
                  <button className="btn btn-sm bg-amber-400 text-white hover:shadow-md text-sm rounded-md w-full">
                    Buy Now
                  </button>
                </div>
              </div>
            </Link>
          </div>
          <div className="card bg-base-100 w-52 shadow-sm gap-3 mb-10">
            <Link href={"#"}>
              <figure className="rounded-t-md">
                <img
                  src="https://plus.unsplash.com/premium_photo-1675237625862-d982e7f44696?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Coffee"
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title text-md">Coffee</h2>
                <p>Rp. 20.000</p>
                <div className="card-actions justify-end">
                  <button className="btn btn-sm bg-amber-400 text-white hover:shadow-md text-sm rounded-md w-full">
                    Buy Now
                  </button>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
