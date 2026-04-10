import Image from 'next/image';

export default function AppDownloadSection() {
  return (
    <section
      className="relative"
      style={{ background: 'linear-gradient(296.47deg, #005F56 -2.82%, #00B1C5 97.17%)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 lg:py-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 lg:gap-12">

          {/* Left: text + QR + store badges */}
          <div className="flex-1 text-white space-y-5 max-w-md">
            <div>
              <h2 className="text-4xl sm:text-5xl font-bold leading-tight">
                Take it easy!
              </h2>
              <p className="mt-3 text-white/80 text-base sm:text-lg leading-relaxed">
                Book, track, change date and time, or cancel rides.
              </p>
            </div>

            {/* QR + badges row */}
            <div className="flex flex-wrap items-center gap-5">

              {/* QR code */}
              <div className="bg-white rounded-xl p-2 shadow-lg flex-shrink-0">
                <Image
                  src="/ksa-images/qr.png"
                  alt="Scan to download KSA Rides app"
                  width={90}
                  height={90}
                  className="rounded"
                />
                <p className="text-[#005F56] text-[9px] font-semibold text-center mt-1">
                  Download KSA Rides App
                </p>
              </div>

              {/* Store badges */}
              <div className="flex flex-col gap-3">
                {/* App Store */}
                <a
                  href="#"
                  className="flex items-center gap-2.5 bg-black text-white rounded-xl px-4 py-2.5 hover:bg-gray-900 transition-colors shadow-md w-[145px]"
                  aria-label="Download on the App Store"
                >
                  <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  <div className="leading-tight">
                    <div className="text-[10px] text-white/70">Download on the</div>
                    <div className="text-sm font-semibold">App Store</div>
                  </div>
                </a>

                {/* Google Play */}
                <a
                  href="#"
                  className="block shadow-md rounded-xl overflow-hidden hover:opacity-90 transition-opacity w-[145px]"
                  aria-label="Get it on Google Play"
                >
                  <Image
                    src="/ksa-images/google play.png"
                    alt="Get it on Google Play"
                    width={145}
                    height={44}
                    className="w-full h-auto"
                  />
                </a>
              </div>
            </div>
          </div>

          {/* Right: phone screenshots — constrained height so they never overflow */}
          <div className="flex items-end justify-center lg:justify-end gap-3 flex-shrink-0">
            {/* Left phone — slightly pushed down */}
            <Image
              src="/ksa-images/mobile-2.png"
              alt="KSA Rides app – route view"
              width={185}
              height={370}
              className="drop-shadow-2xl w-auto h-[240px] sm:h-[290px] lg:h-[310px] object-contain self-end translate-y-[16px]"
            />
            {/* Right phone — full height */}
            <Image
              src="/ksa-images/mobile-1.png"
              alt="KSA Rides app – booking view"
              width={210}
              height={420}
              className="drop-shadow-2xl w-auto h-[270px] sm:h-[320px] lg:h-[350px] object-contain"
            />
          </div>

        </div>
      </div>
    </section>
  );
}
