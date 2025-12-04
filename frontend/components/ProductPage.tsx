import React from 'react';

const ProductPage: React.FC = () => {
  return (
    <>
      <nav className="w-full h-16 border-b border-brand-gray flex items-center justify-between px-10">
        <div className="font-bold text-xl tracking-tighter">ART<span className="text-brand-orange">OBJECT</span></div>
        <div className="flex gap-6 text-sm font-medium text-gray-500">
          <span className="hover:text-black cursor-pointer">Men</span>
          <span className="hover:text-black cursor-pointer">Women</span>
          <span className="hover:text-black cursor-pointer">Kids</span>
          <span className="hover:text-black cursor-pointer">Sale</span>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-10 mt-10 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Image Area */}
        <div className="bg-brand-offwhite aspect-square flex items-center justify-center p-8 border border-brand-gray relative group cursor-crosshair">
          <div className="absolute top-4 left-4 bg-brand-orange text-white text-xs font-bold px-2 py-1">NEW ARRIVAL</div>
          <img 
            src="https://picsum.photos/600/600" 
            alt="Product" 
            className="w-full h-full object-cover mix-blend-multiply"
          />
        </div>

        {/* Product Details Area */}
        <div className="flex flex-col justify-center space-y-6">
          <div>
            <h1 className="text-5xl font-extrabold tracking-tight mb-2">Product Example</h1>
            <p className="text-gray-500 text-lg">Art / Design</p>
          </div>

          <div className="text-3xl font-bold">$189.00</div>

          <div className="space-y-4">
            <label className="text-sm font-bold uppercase text-gray-400">Select Size</label>
            <div className="grid grid-cols-4 gap-2">
              {[7, 8, 9, 10, 11, 12].map(size => (
                <button key={size} className="h-12 border border-brand-gray hover:border-black flex items-center justify-center font-medium transition-colors">
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-6">
            <button className="w-full bg-brand-black text-white h-16 text-lg font-bold uppercase tracking-widest hover:bg-brand-orange transition-colors">
              Add to Cart
            </button>
            <p className="text-xs text-gray-400 mt-4 text-center">Free shipping on orders over $100. Returns valid for 30 days.</p>
          </div>

          <div className="border-t border-brand-gray pt-6 space-y-4">
            <div className="flex justify-between items-center cursor-pointer hover:bg-brand-offwhite p-2 -mx-2">
              <span className="font-bold">Description</span>
              <span>+</span>
            </div>
            <div className="flex justify-between items-center cursor-pointer hover:bg-brand-offwhite p-2 -mx-2">
              <span className="font-bold">Reviews (42)</span>
              <span>+</span>
            </div>
          </div>
        </div>
      </main>

      <section className="bg-brand-black text-white py-20 mt-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-6">Join our Newsletter</h2>
          <p className="text-gray-400 mb-8">Get the heatmap of the latest trends.</p>
          <div className="flex max-w-md mx-auto">
            <input type="email" placeholder="Email address" className="flex-1 bg-transparent border border-white/20 px-4 text-white focus:outline-none focus:border-white" />
            <button className="bg-brand-orange px-8 py-3 font-bold uppercase">Sign Up</button>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductPage;
