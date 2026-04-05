import { NextRequest, NextResponse } from 'next/server';
import { TEAM_MERCH_SOURCES, TeamMerchItem, getTeamMerch } from '@/lib/team-merch';

type ShopifyCollectionResponse = {
  products?: Array<{
    title?: string;
    handle?: string;
    product_type?: string;
    images?: Array<{ src?: string }>;
    variants?: Array<{ price?: string }>;
  }>;
};

function scoreProduct(product: NonNullable<ShopifyCollectionResponse['products']>[number]) {
  const text = `${product.title ?? ''} ${product.product_type ?? ''}`.toLowerCase();

  if (text.includes('mini stick') || text.includes('mini-stick')) return 120;
  if (text.includes('bobble')) return 110;
  if (text.includes('jersey')) return 100;
  if (text.includes('hoodie')) return 90;
  if (text.includes('tee') || text.includes('t-shirt') || text.includes('shirt')) return 80;
  if (text.includes('hat') || text.includes('cap')) return 70;
  if (text.includes('sticker') || text.includes('decal')) return 60;
  if (text.includes('flag') || text.includes('pennant')) return 50;

  return 10;
}

function getBucket(product: NonNullable<ShopifyCollectionResponse['products']>[number]) {
  const text = `${product.title ?? ''} ${product.product_type ?? ''}`.toLowerCase();

  if (text.includes('mini stick') || text.includes('mini-stick')) return 'mini-stick';
  if (text.includes('bobble')) return 'bobblehead';
  if (text.includes('jersey')) return 'jersey';
  if (text.includes('hoodie')) return 'hoodie';
  if (text.includes('tee') || text.includes('t-shirt') || text.includes('shirt')) return 'shirt';
  if (text.includes('hat') || text.includes('cap')) return 'hat';
  if (text.includes('sticker') || text.includes('decal')) return 'sticker';
  if (text.includes('flag') || text.includes('pennant')) return 'flag';

  return (product.product_type || 'other').toLowerCase();
}

function pickProducts(products: NonNullable<ShopifyCollectionResponse['products']>) {
  const sorted = [...products].sort((a, b) => scoreProduct(b) - scoreProduct(a));
  const selected: typeof sorted = [];
  const seenBuckets = new Set<string>();

  for (const product of sorted) {
    const bucket = getBucket(product);
    if (!seenBuckets.has(bucket)) {
      selected.push(product);
      seenBuckets.add(bucket);
    }
    if (selected.length === 4) {
      return selected;
    }
  }

  for (const product of sorted) {
    if (!selected.includes(product)) {
      selected.push(product);
    }
    if (selected.length === 4) {
      break;
    }
  }

  return selected;
}

export async function GET(request: NextRequest) {
  const teamId = request.nextUrl.searchParams.get('teamId') || 'chaos';
  const base = getTeamMerch(teamId);
  const source = TEAM_MERCH_SOURCES[teamId];

  if (!source?.collectionHandle) {
    return NextResponse.json({ items: base.items, shopUrl: base.shopUrl });
  }

  const collectionUrl = `${source.baseUrl}/collections/${source.collectionHandle}/products.json?limit=20`;

  try {
    const response = await fetch(collectionUrl, {
      headers: {
        Accept: 'application/json',
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return NextResponse.json({ items: base.items, shopUrl: base.shopUrl });
    }

    const data = (await response.json()) as ShopifyCollectionResponse;
    const chosenProducts = pickProducts(data.products ?? []);
    const items: TeamMerchItem[] = chosenProducts.map((product, index) => {
      const image = product.images?.[0]?.src;
      const href = product.handle ? `${source.baseUrl}/products/${product.handle}` : base.shopUrl;
      const price = product.variants?.[0]?.price ? `$${product.variants[0].price}` : undefined;

      return {
        title: product.title || base.items[index]?.title || 'Official Team Gear',
        subtitle: product.product_type || base.items[index]?.subtitle || 'Official shop item',
        href,
        accent: base.items[index]?.accent || `ITEM 0${index + 1}`,
        image,
        price,
      };
    });

    return NextResponse.json({
      items: items.length ? items : base.items,
      shopUrl: base.shopUrl,
    });
  } catch {
    return NextResponse.json({ items: base.items, shopUrl: base.shopUrl });
  }
}
