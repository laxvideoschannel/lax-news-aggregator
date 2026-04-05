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

export async function GET(request: NextRequest) {
  const teamId = request.nextUrl.searchParams.get('teamId') || 'chaos';
  const base = getTeamMerch(teamId);
  const source = TEAM_MERCH_SOURCES[teamId];

  if (!source?.collectionHandle) {
    return NextResponse.json({ items: base.items, shopUrl: base.shopUrl });
  }

  const collectionUrl = `${source.baseUrl}/collections/${source.collectionHandle}/products.json?limit=4`;

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
    const items: TeamMerchItem[] = (data.products ?? []).slice(0, 4).map((product, index) => {
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
