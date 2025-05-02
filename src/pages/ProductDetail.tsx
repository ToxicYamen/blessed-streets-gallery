import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import ProductGrid from '../components/product/ProductGrid';
import AnimatedImage from '../components/ui/AnimatedImage';
import { ShoppingBag, Heart, ChevronLeft, Minus, Plus, X, ArrowLeft, ArrowRight } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import { Button } from "../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../components/ui/breadcrumb";
import { cartIconAnimation } from '@/lib/transitions';
import { toast } from 'sonner';
import { useCart } from '@/context/CartContext';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from '@/lib/utils';
import { Json } from '@/integrations/supabase/types';

interface ProductInventory {
  size: string;
  quantity: number;
}

// Updated Product interface to match what we're getting from Supabase
interface Product {
  id: string;
  name: string;
  price: number;
  description: string | null;
  color: string | null;
  images: string[] | null;
  size: string[] | null;
  size_quantities: Record<string, number> | null;
  is_featured: boolean | null;
  is_new: boolean | null;
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const navigate = useNavigate();

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [quantity, setQuantity] = useState(1);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [isHeartAnimating, setIsHeartAnimating] = useState(false);

  const { addToCart, addToWishlist } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const { data: productData, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        
        // Convert the JSON data from Supabase to our Product type
        const processedProduct: Product = {
          ...productData,
          // Ensure size_quantities is a Record<string, number>
          size_quantities: productData.size_quantities ? 
            (typeof productData.size_quantities === 'string' 
              ? JSON.parse(productData.size_quantities) 
              : productData.size_quantities as Record<string, number>)
            : null
        };
        
        setProduct(processedProduct);
        
        // Fetch related products (products with same color but different id)
        const { data: relatedData, error: relatedError } = await supabase
          .from('products')
          .select('*')
          .neq('id', id)
          .limit(4);

        if (!relatedError && relatedData) {
          // Process related products the same way
          const processedRelated = relatedData.map(item => ({
            ...item,
            size_quantities: item.size_quantities ? 
              (typeof item.size_quantities === 'string' 
                ? JSON.parse(item.size_quantities) 
                : item.size_quantities as Record<string, number>)
              : null
          }));
          setRelatedProducts(processedRelated);
        }
      } catch (error: any) {
        console.error('Error fetching product:', error);
        toast.error('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Reset selected size when product changes
  useEffect(() => {
    setSelectedSize(null);
    setQuantity(1);
    setSelectedImage(0);
  }, [product]);

  // --- Definitionen ---
  const productDetails = {
    material: "57% Baumwolle, 43% Polyester",
    fit: "Weit (oversize)",
    cut: "Gerade",
    length: "Lang",
    sleeveLength: "Langarm",
    modelInfo: "Unser Model ist 176 cm groß und trägt Größe M"
  };

  const productFeatures = {
    collar: "Kapuze",
    pockets: "Kängurutaschen",
    pattern: "Stick",
    details: "Elastischer Bund"
  };

  const careInstructions = "30 Grad, Maschinenwäsche, Buntwäsche, nicht bleichen, Für den Trockner nicht geeignet!";

  const sizeGuide = {
    M: { length: '73cm', shoulder: '61cm', chest: '62cm' },
    L: { length: '75cm', shoulder: '63cm', chest: '64cm' },
    XL: { length: '77cm', shoulder: '65cm', chest: '66cm' }
  };
  // --- Ende Definitionen ---

  // Get inventory quantity for a specific size
  const getQuantityForSize = (size: string): number => {
    if (!product || !product.size_quantities) return 0;
    return product.size_quantities[size] || 0;
  };
  
  const handleQuantityChange = (e: React.MouseEvent, change: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (!selectedSize) return;

    const currentStock = selectedSize ? getQuantityForSize(selectedSize) : 0;
    const newQuantity = quantity + change;

    if (newQuantity < 1) return;
    if (newQuantity > currentStock) {
      toast.error(`Nur noch ${currentStock} Stück verfügbar`);
      return;
    }

    setQuantity(newQuantity);
  };

  const handleButtonClick = (handler: (e: React.MouseEvent) => void) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!(e.target instanceof HTMLButtonElement)) {
      return;
    }

    if (!selectedSize) {
      toast.error('Bitte wähle eine Größe aus');
      return;
    }

    const currentStock = selectedSize ? getQuantityForSize(selectedSize) : 0;
    if (quantity > currentStock) {
      toast.error(`Nur noch ${currentStock} Stück verfügbar`);
      return;
    }

    handler(e);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    if (!selectedSize || !product) return;

    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize,
      quantity: quantity,
      image: product.images ? product.images[0] : '',
      color: product.color || 'default', // Include color in cart item
    };

    addToCart(cartItem);
    setQuantity(1);
    toast.success(`${quantity}x ${product.name} (Größe: ${selectedSize}) wurde zum Warenkorb hinzugefügt`);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    if (!selectedSize || !product) return;

    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize,
      quantity: quantity,
      image: product.images ? product.images[0] : '',
      color: product.color || 'default', // Include color in cart item
    };

    addToCart(cartItem);
    setQuantity(1);
    navigate('/cart');
  };

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!product) return;

    const wishlistItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize || 'M', // Standardgröße, wenn keine ausgewählt
      quantity: 1,
      image: product.images ? product.images[0] : '',
      color: product.color || 'default', // Include color in wishlist item
    };

    setIsHeartAnimating(true);
    setTimeout(() => setIsHeartAnimating(false), 1000);

    addToWishlist(wishlistItem);
    toast.success(`${product.name} wurde zur Wunschliste hinzugefügt`);
  };

  const handleSizeClick = (size: string) => {
    const isOutOfStock = getQuantityForSize(size) === 0;
    if (!isOutOfStock) {
      setSelectedSize(size);
      setQuantity(1); // Reset quantity when size changes
    }
  };

  const handleImageClick = (index: number) => {
    setSelectedImage(index);
    setIsImageOpen(true);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product?.images) return;
    setSelectedImage((prev) => (prev + 1) % product.images!.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product?.images) return;
    setSelectedImage((prev) => (prev - 1 + product.images!.length) % product.images!.length);
  };

  if (loading) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
        <span className="ml-3">Loading product details...</span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-mono-400 mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <button
            type="button"
            onClick={() => navigate('/shop')}
            className="bg-mono-100 text-mono-900 px-6 py-3 inline-block hover:bg-mono-200 transition-colors"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  // Create array of available sizes from product's size_quantities
  const availableSizes = product.size ? product.size : 
                         (product.size_quantities ? Object.keys(product.size_quantities) : []);

  return (
    <div className="pt-24">
      <div className="blesssed-container py-12">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Shop</BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{product?.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative overflow-hidden bg-accent/5 rounded-lg group">
              <div onClick={() => setIsImageOpen(true)} className="cursor-zoom-in">
                <AnimatedImage
                  src={product.images && product.images.length > 0 ? product.images[selectedImage] : '/placeholder.svg'}
                  alt={`${product.name} in ${product.color || 'default color'}`}
                  aspectRatio="square"
                  priority
                />
              </div>

              {/* Previous Button */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>

              {/* Next Button */}
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100"
              >
                <ArrowRight className="h-5 w-5" />
              </button>

              {/* Dots Navigation */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 p-2 bg-black/50 rounded-full opacity-0 group-hover:opacity-100">
                {product.images && product.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage(index);
                    }}
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${index === selectedImage ? 'bg-white' : 'bg-white/50'
                      }`}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {product.images && product.images.map((image, index) => (
                <div
                  key={index}
                  className="cursor-zoom-in"
                  onClick={() => handleImageClick(index)}
                >
                  <img
                    src={image}
                    alt={`${product.name} in ${product.color || 'default'} - view ${index + 1}`}
                    className="w-full h-full object-cover aspect-square"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2 text-foreground">{product.name}</h1>
            <p className="text-muted-foreground capitalize mb-6">{product.color || 'Default'}</p>

            <p className="text-xl font-medium mb-6 text-foreground">€{product.price}</p>

            {/* Low Stock Warning */}
            {selectedSize && (
              <div className="mb-4">
                {getQuantityForSize(selectedSize) <= 3 ? (
                  <p className="text-red-500 text-sm font-medium">
                    ⚠️ Nur noch {getQuantityForSize(selectedSize)} Stück verfügbar
                  </p>
                ) : (
                  <p className="text-green-500 text-sm">
                    ✓ Auf Lager
                  </p>
                )}
              </div>
            )}

            {/* Size Selection */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-sm font-medium text-foreground">Größe</h2>
                {!selectedSize && (
                  <p className="text-sm text-red-500">Bitte wähle eine Größe aus</p>
                )}
              </div>
              <div className="flex gap-3 mb-2">
                {availableSizes.map((size) => {
                  const isOutOfStock = getQuantityForSize(size) === 0;
                  const isSelected = selectedSize === size;

                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => handleSizeClick(size)}
                      disabled={isOutOfStock}
                      className={`w-12 h-10 rounded-md border ${isSelected
                        ? 'bg-foreground text-background hover:bg-foreground/90 border-white'
                        : 'bg-background text-foreground border-white hover:bg-accent'
                        } ${isOutOfStock
                          ? 'relative after:content-[""] after:absolute after:left-0 after:top-1/2 after:w-full after:h-[1px] after:bg-muted after:rotate-[-45deg] text-muted-foreground cursor-not-allowed hover:bg-transparent'
                          : ''
                        }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-sm font-medium text-foreground">Menge</h2>
                {selectedSize && (
                  <p className="text-sm text-muted-foreground">
                    {getQuantityForSize(selectedSize)} Stück verfügbar
                  </p>
                )}
              </div>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  className={`w-8 h-8 flex items-center justify-center border border-white rounded-md text-foreground hover:bg-accent ${quantity <= 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  onClick={(e) => handleQuantityChange(e, -1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center text-foreground">{quantity}</span>
                <button
                  type="button"
                  className={`w-8 h-8 flex items-center justify-center border border-white rounded-md text-foreground hover:bg-accent ${quantity >= (selectedSize ? getQuantityForSize(selectedSize) : 0) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  onClick={(e) => handleQuantityChange(e, 1)}
                  disabled={quantity >= (selectedSize ? getQuantityForSize(selectedSize) : 0)}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-[1fr,auto] gap-4 mb-8">
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={!selectedSize}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md border border-white ${!selectedSize
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
                    : 'bg-foreground text-background hover:bg-foreground/90'
                    }`}
                  onClick={(e) => handleButtonClick(handleAddToCart)(e)}
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span className="hidden md:inline">In den Warenkorb</span>
                </button>
                <button
                  type="button"
                  disabled={!selectedSize}
                  className={`flex-1 px-4 py-2 rounded-md flex items-center justify-center border border-white ${!selectedSize
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
                    : 'bg-accent text-foreground hover:bg-accent/90'
                    }`}
                  onClick={(e) => handleButtonClick(handleBuyNow)(e)}
                >
                  Jetzt Kaufen
                </button>
              </div>
              <button
                type="button"
                className="w-10 h-10 flex items-center justify-center border border-white rounded-md text-foreground hover:bg-accent relative"
                onClick={handleAddToWishlist}
              >
                <Heart className={cn(
                  "h-4 w-4 transition-all duration-300",
                  isHeartAnimating && "scale-125 fill-red-500 text-red-500 animate-[pulse_1s_ease-in-out]"
                )} />
                {isHeartAnimating && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="absolute w-8 h-8 bg-red-500/20 rounded-full animate-ping" />
                  </div>
                )}
              </button>
            </div>

            {/* Product Details Accordion */}
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border-border">
                <AccordionTrigger className="hover:bg-accent text-foreground">Produktdetails</AccordionTrigger>
                <AccordionContent className="bg-background">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Kragen</span>
                      <span className="text-foreground">{productFeatures.collar}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Taschen</span>
                      <span className="text-foreground">{productFeatures.pockets}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Muster</span>
                      <span className="text-foreground">{productFeatures.pattern}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Details</span>
                      <span className="text-foreground">{productFeatures.details}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Material</span>
                      <span className="text-foreground">{productDetails.material}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Passform</span>
                      <span className="text-foreground">{productDetails.fit}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Schnitt</span>
                      <span className="text-foreground">{productDetails.cut}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Länge</span>
                      <span className="text-foreground">{productDetails.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Armlänge</span>
                      <span className="text-foreground">{productDetails.sleeveLength}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Modelgröße</span>
                      <span className="text-foreground">{productDetails.modelInfo}</span>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border-border">
                <AccordionTrigger className="hover:bg-accent text-foreground">Versandinformationen</AccordionTrigger>
                <AccordionContent className="bg-background">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Versandzeit</span>
                      <span className="text-foreground">2-4 Werktage</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Versandkosten</span>
                      <span className="text-foreground">Kostenloser Versand</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Lieferung</span>
                      <span className="text-foreground">DHL, Hermes</span>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border-border">
                <AccordionTrigger className="hover:bg-accent text-foreground">Größentabelle</AccordionTrigger>
                <AccordionContent className="bg-background">
                  <div className="space-y-2 text-sm">
                    {Object.entries(sizeGuide).map(([size, measurements]) => (
                      <div key={size} className="grid grid-cols-4 gap-4 py-2 border-b border-border last:border-0">
                        <div className="text-muted-foreground">Größe {size}</div>
                        <div className="text-foreground">{measurements.length}</div>
                        <div className="text-foreground">{measurements.shoulder}</div>
                        <div className="text-foreground">{measurements.chest}</div>
                      </div>
                    ))}
                    <div className="grid grid-cols-4 gap-4 text-muted-foreground text-xs mt-2">
                      <div></div>
                      <div>Länge</div>
                      <div>Schulter</div>
                      <div>Brust</div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border-border">
                <AccordionTrigger className="hover:bg-accent text-foreground">Pflegehinweise</AccordionTrigger>
                <AccordionContent className="bg-background">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Waschen</span>
                      <span className="text-foreground">30 Grad</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Programm</span>
                      <span className="text-foreground">Buntwäsche</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Bleichen</span>
                      <span className="text-foreground">Nicht bleichen</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Trocknen</span>
                      <span className="text-foreground">Nicht trocknergeeignet</span>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-8 text-foreground">Ähnliche Produkte</h2>
            <ProductGrid products={relatedProducts} />
          </div>
        )}
      </div>

      {/* Image Modal */}
      <Dialog open={isImageOpen} onOpenChange={setIsImageOpen}>
        <DialogContent className="max-w-[95vw] h-[95vh] w-full p-0 bg-transparent border-none">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <button
              onClick={() => setIsImageOpen(false)}
              className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Previous Button */}
            <button
              onClick={prevImage}
              className="absolute left-4 z-50 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>

            {/* Image */}
            <img
              src={product.images && product.images.length > 0 ? product.images[selectedImage] : '/placeholder.svg'}
              alt={product.name}
              className="max-w-full max-h-full object-contain"
            />

            {/* Next Button */}
            <button
              onClick={nextImage}
              className="absolute right-4 z-50 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              <ArrowRight className="h-6 w-6" />
            </button>

            {/* Thumbnails */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 p-2 bg-black/50 rounded-full">
              {product.images && product.images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-colors ${index === selectedImage ? 'bg-white' : 'bg-white/50'
                    }`}
                />
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductDetail;
