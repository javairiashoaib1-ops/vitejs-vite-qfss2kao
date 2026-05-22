import { useState, useEffect, useRef } from 'react';

const ORANGE = '#FF6B35';
const GOLD = '#FFD166';
const TEAL = '#1D9E75';
const DARK = '#0E0A07';
const CARD = '#1C1510';
const MUTED = 'rgba(255,255,255,0.4)';
const WHITE = '#fff';

const deals = [
  {
    id: 1,
    name: 'Assorted Croissants',
    resto: 'Pie in the Sky',
    emoji: '🥐',
    mins: 28,
    orig: 500,
    cat: 'Bakeries',
    qty: 4,
    total: 12,
    bg: '#2A1F0E',
    dist: '0.4 km',
    rating: 4.7,
    desc: 'Freshly baked assorted croissants — butter, almond & chocolate. Baked this morning.',
  },
  {
    id: 2,
    name: 'Bento Box Set',
    resto: 'Sakura Kitchen',
    emoji: '🍱',
    mins: 55,
    orig: 900,
    cat: 'Japanese',
    qty: 2,
    total: 10,
    bg: '#0E1F1A',
    dist: '1.1 km',
    rating: 4.5,
    desc: 'A full Japanese bento with rice, teriyaki chicken, tamagoyaki and pickles.',
  },
  {
    id: 3,
    name: 'Pastry + Latte',
    resto: 'Brewed Awakening',
    emoji: '☕',
    mins: 18,
    orig: 760,
    cat: 'Cafés',
    qty: 6,
    total: 11,
    bg: '#1A1220',
    dist: '0.8 km',
    rating: 4.6,
    desc: 'Your choice of latte (hot/iced) with a freshly baked pastry of the day.',
  },
  {
    id: 4,
    name: 'Margherita Pizza',
    resto: "Napoli's",
    emoji: '🍕',
    mins: 42,
    orig: 1400,
    cat: 'Italian',
    qty: 3,
    total: 8,
    bg: '#1A0E0E',
    dist: '1.5 km',
    rating: 4.8,
    desc: '12-inch wood-fired Margherita with San Marzano tomatoes and fresh mozzarella.',
  },
  {
    id: 5,
    name: 'Grilled Sandwich',
    resto: 'The Green Bowl',
    emoji: '🥪',
    mins: 65,
    orig: 450,
    cat: 'Healthy',
    qty: 8,
    total: 15,
    bg: '#12200E',
    dist: '0.6 km',
    rating: 4.3,
    desc: 'Whole grain bread, grilled chicken, avocado, lettuce & house sauce.',
  },
  {
    id: 6,
    name: 'Choco Lava Cake',
    resto: 'Sweet Spot',
    emoji: '🍫',
    mins: 22,
    orig: 350,
    cat: 'Desserts',
    qty: 5,
    total: 9,
    bg: '#200E1A',
    dist: '0.9 km',
    rating: 4.9,
    desc: 'Warm molten chocolate cake served with a scoop of vanilla ice cream.',
  },
];

const rouletteItems = [
  { label: 'Free Drink', emoji: '🥤', prob: 0.3, color: '#1D9E75' },
  { label: '50% Pizza', emoji: '🍕', prob: 0.2, color: '#FF6B35' },
  { label: 'Mystery Box', emoji: '🎁', prob: 0.25, color: '#7F77DD' },
  { label: 'Free Meal', emoji: '🍽️', prob: 0.05, color: '#FFD166' },
  { label: '10% Off', emoji: '🏷️', prob: 0.15, color: '#D4537E' },
  { label: 'Try Again', emoji: '🔄', prob: 0.05, color: '#888780' },
];

const friends = [
  { name: 'Ali', avatar: 'AL', coins: 340, meals: 18, saved: 12.1 },
  { name: 'Zara', avatar: 'ZA', coins: 520, meals: 31, saved: 20.4 },
  { name: 'Hassan', avatar: 'HA', coins: 210, meals: 12, saved: 8.2 },
  { name: 'Ayesha', avatar: 'AY', coins: 680, meals: 42, saved: 28.7 },
];

const cityBoard = [
  { city: 'Lahore', meals: 1842, co2: 1104 },
  { city: 'Karachi', meals: 2310, co2: 1386 },
  { city: 'Islamabad', meals: 940, co2: 564 },
  { city: 'Multan', meals: 510, co2: 306 },
];

function getDiscount(mins) {
  if (mins <= 30) return 70;
  if (mins <= 60) return 40;
  if (mins <= 120) return 20;
  return 10;
}
function getDiscountColor(mins) {
  if (mins <= 30) return '#E24B4A';
  if (mins <= 60) return ORANGE;
  return GOLD;
}
function discountedPrice(orig, mins) {
  return Math.round(orig * (1 - getDiscount(mins) / 100));
}
function fmtMins(m) {
  if (m <= 0) return 'Expired';
  if (m < 60) return `${Math.round(m)}m`;
  return `${Math.floor(m / 60)}h ${Math.round(m % 60)}m`;
}

function Pill({ children, color, bg }) {
  return (
    <span
      style={{
        background: bg || 'rgba(255,107,53,0.15)',
        color: color || ORANGE,
        fontSize: 10,
        fontWeight: 600,
        padding: '2px 8px',
        borderRadius: 7,
      }}
    >
      {children}
    </span>
  );
}
function Avatar({ label, color = ORANGE, size = 36 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: color + '22',
        border: `1.5px solid ${color}44`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.35,
        fontWeight: 600,
        color,
        flexShrink: 0,
      }}
    >
      {label}
    </div>
  );
}

// ── DEAL DETAIL ───────────────────────────────────────────────
function DealDetail({ deal, mins, onBack, onAddToCart, cart }) {
  const curMins = Math.round(mins);
  const disc = getDiscount(curMins);
  const price = discountedPrice(deal.orig, curMins);
  const dColor = getDiscountColor(curMins);
  const inCart = cart.find((c) => c.id === deal.id);
  const [qty, setQty] = useState(inCart ? inCart.qty : 1);

  return (
    <div style={{ minHeight: 500 }}>
      <div
        style={{
          background: deal.bg,
          height: 180,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 80,
          position: 'relative',
        }}
      >
        {deal.emoji}
        <button
          onClick={onBack}
          style={{
            position: 'absolute',
            top: 14,
            left: 14,
            background: 'rgba(0,0,0,0.5)',
            border: 'none',
            borderRadius: 10,
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: WHITE,
            fontSize: 18,
          }}
        >
          ←
        </button>
        <span
          style={{
            position: 'absolute',
            top: 14,
            right: 14,
            background: dColor,
            color: '#fff',
            fontSize: 11,
            fontWeight: 700,
            padding: '4px 10px',
            borderRadius: 8,
          }}
        >
          {disc}% OFF
        </span>
        <span
          style={{
            position: 'absolute',
            bottom: 14,
            right: 14,
            background: 'rgba(0,0,0,0.6)',
            borderRadius: 8,
            padding: '4px 9px',
            fontSize: 11,
            color: GOLD,
            fontWeight: 600,
          }}
        >
          ⏱ {fmtMins(curMins)} left
        </span>
      </div>
      <div style={{ padding: '18px 16px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 6,
          }}
        >
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: WHITE,
                marginBottom: 4,
              }}
            >
              {deal.name}
            </div>
            <div
              style={{
                fontSize: 12,
                color: MUTED,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <span>📍 {deal.resto}</span>
              <span>·</span>
              <span>⭐ {deal.rating}</span>
              <span>·</span>
              <span>{deal.dist}</span>
            </div>
          </div>
        </div>

        <div
          style={{
            background: CARD,
            borderRadius: 14,
            padding: '12px 14px',
            margin: '14px 0',
            border: '0.5px solid rgba(255,255,255,0.06)',
          }}
        >
          <div style={{ fontSize: 11, color: MUTED, marginBottom: 6 }}>
            About this item
          </div>
          <div
            style={{
              fontSize: 13,
              color: 'rgba(255,255,255,0.75)',
              lineHeight: 1.6,
            }}
          >
            {deal.desc}
          </div>
        </div>

        <div
          style={{
            background: '#1A0A00',
            borderRadius: 14,
            padding: '12px 14px',
            marginBottom: 16,
            border: `0.5px solid ${dColor}44`,
          }}
        >
          <div style={{ fontSize: 11, color: MUTED, marginBottom: 8 }}>
            ⚡ Reverse Surge Pricing
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[
              ['≤30 min', '70%', '#E24B4A'],
              ['≤1 hr', '40%', ORANGE],
              ['≤2 hr', '20%', GOLD],
            ].map(([t, d, c]) => (
              <div
                key={t}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  borderRadius: 9,
                  padding: '6px 10px',
                  textAlign: 'center',
                  border: `0.5px solid ${c}33`,
                }}
              >
                <div style={{ fontSize: 10, color: MUTED }}>{t}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: c }}>
                  {d} off
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 16,
          }}
        >
          <div>
            <div style={{ fontSize: 11, color: MUTED, marginBottom: 3 }}>
              Price per item
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontSize: 24, fontWeight: 700, color: dColor }}>
                Rs {price}
              </span>
              <span
                style={{
                  fontSize: 13,
                  color: 'rgba(255,255,255,0.25)',
                  textDecoration: 'line-through',
                }}
              >
                Rs {deal.orig}
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                background: CARD,
                border: '0.5px solid rgba(255,255,255,0.1)',
                color: WHITE,
                fontSize: 18,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              −
            </button>
            <span
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: WHITE,
                minWidth: 20,
                textAlign: 'center',
              }}
            >
              {qty}
            </span>
            <button
              onClick={() => setQty((q) => Math.min(deal.qty, q + 1))}
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                background: ORANGE,
                border: 'none',
                color: WHITE,
                fontSize: 18,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              +
            </button>
          </div>
        </div>

        <div
          style={{
            height: 3,
            background: 'rgba(255,255,255,0.07)',
            borderRadius: 2,
            marginBottom: 5,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${(deal.qty / deal.total) * 100}%`,
              height: '100%',
              background: deal.qty / deal.total < 0.35 ? '#E24B4A' : GOLD,
              borderRadius: 2,
            }}
          />
        </div>
        <div style={{ fontSize: 10, color: MUTED, marginBottom: 16 }}>
          Only {deal.qty} left — hurry!
        </div>

        <button
          onClick={() => onAddToCart(deal, qty, price)}
          style={{
            width: '100%',
            background: ORANGE,
            border: 'none',
            borderRadius: 14,
            padding: '15px',
            fontSize: 15,
            fontWeight: 700,
            color: WHITE,
            cursor: 'pointer',
          }}
        >
          {inCart ? 'Update cart' : 'Add to cart'} · Rs {price * qty}
        </button>
      </div>
    </div>
  );
}

// ── CART SCREEN ───────────────────────────────────────────────
function CartScreen({ cart, setCart, onCheckout, onBack }) {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const saved = cart.reduce((s, i) => s + (i.orig - i.price) * i.qty, 0);

  function updateQty(id, delta) {
    setCart((c) =>
      c
        .map((i) =>
          i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i
        )
        .filter((i) => i.qty > 0)
    );
  }

  if (cart.length === 0)
    return (
      <div style={{ padding: '60px 16px', textAlign: 'center' }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>🛒</div>
        <div style={{ fontSize: 16, color: WHITE, marginBottom: 8 }}>
          Your cart is empty
        </div>
        <div style={{ fontSize: 13, color: MUTED }}>
          Grab a deal before it expires!
        </div>
        <button
          onClick={onBack}
          style={{
            marginTop: 20,
            background: ORANGE,
            border: 'none',
            borderRadius: 14,
            padding: '12px 28px',
            fontSize: 14,
            fontWeight: 600,
            color: WHITE,
            cursor: 'pointer',
          }}
        >
          Browse Deals
        </button>
      </div>
    );

  return (
    <div style={{ padding: '16px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 18,
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: CARD,
            border: '0.5px solid rgba(255,255,255,0.1)',
            borderRadius: 10,
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: WHITE,
            fontSize: 18,
            flexShrink: 0,
          }}
        >
          ←
        </button>
        <div style={{ fontSize: 17, fontWeight: 600, color: WHITE }}>
          Your Cart
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <Pill>
            {cart.length} item{cart.length > 1 ? 's' : ''}
          </Pill>
        </div>
      </div>

      {cart.map((item) => (
        <div
          key={item.id}
          style={{
            background: CARD,
            borderRadius: 16,
            padding: '13px',
            border: '0.5px solid rgba(255,255,255,0.06)',
            marginBottom: 10,
            display: 'flex',
            gap: 12,
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: 12,
              background: item.bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 26,
              flexShrink: 0,
            }}
          >
            {item.emoji}
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: WHITE,
                marginBottom: 2,
              }}
            >
              {item.name}
            </div>
            <div style={{ fontSize: 11, color: MUTED, marginBottom: 6 }}>
              {item.resto}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: ORANGE }}>
                Rs {item.price}
              </span>
              <span
                style={{
                  fontSize: 10,
                  color: 'rgba(255,255,255,0.2)',
                  textDecoration: 'line-through',
                }}
              >
                Rs {item.orig}
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={() => updateQty(item.id, -1)}
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: 'rgba(255,255,255,0.07)',
                border: 'none',
                color: WHITE,
                fontSize: 16,
                cursor: 'pointer',
              }}
            >
              −
            </button>
            <span
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: WHITE,
                minWidth: 16,
                textAlign: 'center',
              }}
            >
              {item.qty}
            </span>
            <button
              onClick={() => updateQty(item.id, 1)}
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: ORANGE,
                border: 'none',
                color: WHITE,
                fontSize: 16,
                cursor: 'pointer',
              }}
            >
              +
            </button>
          </div>
        </div>
      ))}

      <div
        style={{
          background: '#0E1F1A',
          borderRadius: 14,
          padding: '14px',
          border: `0.5px solid rgba(29,158,117,0.3)`,
          margin: '14px 0',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 8,
          }}
        >
          <span style={{ fontSize: 13, color: MUTED }}>Subtotal</span>
          <span style={{ fontSize: 13, color: WHITE }}>Rs {total}</span>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 8,
          }}
        >
          <span style={{ fontSize: 13, color: MUTED }}>Discount saved</span>
          <span style={{ fontSize: 13, color: TEAL }}>− Rs {saved}</span>
        </div>
        <div
          style={{
            height: '0.5px',
            background: 'rgba(255,255,255,0.08)',
            margin: '10px 0',
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: WHITE }}>
            Total
          </span>
          <span style={{ fontSize: 15, fontWeight: 700, color: ORANGE }}>
            Rs {total}
          </span>
        </div>
      </div>

      <div
        style={{
          background: CARD,
          borderRadius: 14,
          padding: '12px 14px',
          border: '0.5px solid rgba(255,255,255,0.06)',
          marginBottom: 14,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <span style={{ fontSize: 18 }}>🌍</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: TEAL, fontWeight: 500 }}>
            You're rescuing {cart.length} meal{cart.length > 1 ? 's' : ''}!
          </div>
          <div style={{ fontSize: 10, color: 'rgba(93,202,165,0.6)' }}>
            Preventing ~{(cart.length * 0.42).toFixed(1)}kg of food waste
          </div>
        </div>
        <Pill bg="rgba(29,158,117,0.15)" color={TEAL}>
          +{cart.length * 20} coins
        </Pill>
      </div>

      <button
        onClick={onCheckout}
        style={{
          width: '100%',
          background: ORANGE,
          border: 'none',
          borderRadius: 14,
          padding: '15px',
          fontSize: 15,
          fontWeight: 700,
          color: WHITE,
          cursor: 'pointer',
        }}
      >
        Proceed to Checkout →
      </button>
    </div>
  );
}

// ── CHECKOUT SCREEN ───────────────────────────────────────────
function CheckoutScreen({ cart, onBack, onPlaceOrder }) {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const [method, setMethod] = useState('cod');
  const [pickup, setPickup] = useState('pickup');
  const [address, setAddress] = useState('');
  const [useCoins, setUseCoins] = useState(false);
  const coinDiscount = useCoins ? Math.min(50, total) : 0;
  const finalTotal = total - coinDiscount;

  return (
    <div style={{ padding: '16px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 18,
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: CARD,
            border: '0.5px solid rgba(255,255,255,0.1)',
            borderRadius: 10,
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: WHITE,
            fontSize: 18,
            flexShrink: 0,
          }}
        >
          ←
        </button>
        <div style={{ fontSize: 17, fontWeight: 600, color: WHITE }}>
          Checkout
        </div>
      </div>

      {/* Pickup / Delivery */}
      <div
        style={{
          background: CARD,
          borderRadius: 16,
          padding: '14px',
          border: '0.5px solid rgba(255,255,255,0.06)',
          marginBottom: 12,
        }}
      >
        <div style={{ fontSize: 12, color: MUTED, marginBottom: 10 }}>
          How do you want it?
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0,1fr))',
            gap: 8,
          }}
        >
          {[
            ['pickup', '🏪', 'Self Pickup', 'Free'],
            ['delivery', '🛵', 'Delivery', '+ Rs 60'],
          ].map(([val, icon, label, note]) => (
            <button
              key={val}
              onClick={() => setPickup(val)}
              style={{
                background: pickup === val ? ORANGE + '22' : '#0E0A07',
                border:
                  pickup === val
                    ? `1.5px solid ${ORANGE}`
                    : '0.5px solid rgba(255,255,255,0.1)',
                borderRadius: 12,
                padding: '12px 10px',
                cursor: 'pointer',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 22, marginBottom: 4 }}>{icon}</div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: pickup === val ? ORANGE : WHITE,
                }}
              >
                {label}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: pickup === val ? ORANGE + 'aa' : MUTED,
                }}
              >
                {note}
              </div>
            </button>
          ))}
        </div>
        {pickup === 'delivery' && (
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your delivery address..."
            style={{
              width: '100%',
              background: '#0E0A07',
              border: '0.5px solid rgba(255,255,255,0.12)',
              borderRadius: 10,
              padding: '10px 12px',
              fontSize: 13,
              color: WHITE,
              marginTop: 10,
              outline: 'none',
            }}
          />
        )}
      </div>

      {/* Payment method */}
      <div
        style={{
          background: CARD,
          borderRadius: 16,
          padding: '14px',
          border: '0.5px solid rgba(255,255,255,0.06)',
          marginBottom: 12,
        }}
      >
        <div style={{ fontSize: 12, color: MUTED, marginBottom: 10 }}>
          Payment method
        </div>
        {[
          ['cod', '💵', 'Cash on Pickup'],
          ['jazzcash', '📱', 'JazzCash'],
          ['card', '💳', 'Card'],
        ].map(([val, icon, label]) => (
          <button
            key={val}
            onClick={() => setMethod(val)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              background: method === val ? ORANGE + '15' : 'transparent',
              border:
                method === val
                  ? `0.5px solid ${ORANGE}44`
                  : '0.5px solid rgba(255,255,255,0.06)',
              borderRadius: 12,
              padding: '11px 13px',
              cursor: 'pointer',
              marginBottom: 7,
            }}
          >
            <span style={{ fontSize: 20 }}>{icon}</span>
            <span
              style={{
                fontSize: 13,
                color: method === val ? ORANGE : WHITE,
                fontWeight: method === val ? 600 : 400,
              }}
            >
              {label}
            </span>
            <span
              style={{
                marginLeft: 'auto',
                width: 18,
                height: 18,
                borderRadius: '50%',
                border:
                  method === val
                    ? `5px solid ${ORANGE}`
                    : '1.5px solid rgba(255,255,255,0.25)',
                display: 'inline-block',
              }}
            />
          </button>
        ))}
      </div>

      {/* Use coins */}
      <button
        onClick={() => setUseCoins((u) => !u)}
        style={{
          width: '100%',
          background: useCoins ? GOLD + '22' : CARD,
          border: useCoins
            ? `0.5px solid ${GOLD}66`
            : '0.5px solid rgba(255,255,255,0.06)',
          borderRadius: 14,
          padding: '12px 14px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: 12,
        }}
      >
        <span style={{ fontSize: 20 }}>🪙</span>
        <div style={{ flex: 1, textAlign: 'left' }}>
          <div
            style={{
              fontSize: 13,
              color: useCoins ? GOLD : WHITE,
              fontWeight: 500,
            }}
          >
            Use CraveCoins
          </div>
          <div style={{ fontSize: 10, color: useCoins ? GOLD + 'aa' : MUTED }}>
            Save Rs 50 with your coins
          </div>
        </div>
        <div
          style={{
            width: 22,
            height: 22,
            borderRadius: 6,
            background: useCoins ? GOLD : 'rgba(255,255,255,0.07)',
            border: useCoins ? 'none' : '0.5px solid rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 13,
          }}
        >
          {useCoins ? '✓' : ''}
        </div>
      </button>

      {/* Bill summary */}
      <div
        style={{
          background: '#0E1F1A',
          borderRadius: 14,
          padding: '14px',
          border: `0.5px solid rgba(29,158,117,0.25)`,
          marginBottom: 16,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 6,
          }}
        >
          <span style={{ fontSize: 12, color: MUTED }}>Items total</span>
          <span style={{ fontSize: 12, color: WHITE }}>Rs {total}</span>
        </div>
        {pickup === 'delivery' && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 6,
            }}
          >
            <span style={{ fontSize: 12, color: MUTED }}>Delivery fee</span>
            <span style={{ fontSize: 12, color: WHITE }}>Rs 60</span>
          </div>
        )}
        {useCoins && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 6,
            }}
          >
            <span style={{ fontSize: 12, color: GOLD }}>
              CraveCoins discount
            </span>
            <span style={{ fontSize: 12, color: GOLD }}>
              − Rs {coinDiscount}
            </span>
          </div>
        )}
        <div
          style={{
            height: '0.5px',
            background: 'rgba(255,255,255,0.08)',
            margin: '8px 0',
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: WHITE }}>
            Total payable
          </span>
          <span style={{ fontSize: 14, fontWeight: 700, color: ORANGE }}>
            Rs {finalTotal + (pickup === 'delivery' ? 60 : 0)}
          </span>
        </div>
      </div>

      <button
        onClick={() => onPlaceOrder(method, pickup)}
        style={{
          width: '100%',
          background: ORANGE,
          border: 'none',
          borderRadius: 14,
          padding: '15px',
          fontSize: 15,
          fontWeight: 700,
          color: WHITE,
          cursor: 'pointer',
        }}
      >
        Place Order 🎉
      </button>
    </div>
  );
}

// ── ORDER TRACKING ────────────────────────────────────────────
function OrderTracking({ order, onDone }) {
  const [step, setStep] = useState(0);
  const steps = [
    {
      label: 'Order placed!',
      icon: '✅',
      desc: 'Your order has been confirmed',
    },
    {
      label: 'Restaurant preparing',
      icon: '👨‍🍳',
      desc: "They're packing your rescue meal",
    },
    {
      label:
        order.pickup === 'pickup' ? 'Ready for pickup!' : 'Out for delivery!',
      icon: order.pickup === 'pickup' ? '🏪' : '🛵',
      desc:
        order.pickup === 'pickup'
          ? 'Head to the restaurant now'
          : 'Your rider is on the way',
    },
    {
      label: 'Enjoy your meal!',
      icon: '🎉',
      desc: 'You saved food & money — legend!',
    },
  ];

  useEffect(() => {
    if (step < steps.length - 1) {
      const t = setTimeout(() => setStep((s) => s + 1), 2500);
      return () => clearTimeout(t);
    }
  }, [step]);

  return (
    <div style={{ padding: '24px 16px' }}>
      {/* Order ID */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ fontSize: 48, marginBottom: 10 }}>{steps[step].icon}</div>
        <div
          style={{
            fontSize: 18,
            fontWeight: 600,
            color: WHITE,
            marginBottom: 4,
          }}
        >
          {steps[step].label}
        </div>
        <div style={{ fontSize: 12, color: MUTED, marginBottom: 10 }}>
          {steps[step].desc}
        </div>
        <Pill>Order #CS{order.id}</Pill>
      </div>

      {/* Progress steps */}
      <div
        style={{
          background: CARD,
          borderRadius: 16,
          padding: '16px',
          border: '0.5px solid rgba(255,255,255,0.06)',
          marginBottom: 14,
        }}
      >
        {steps.map((s, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              gap: 12,
              alignItems: 'flex-start',
              marginBottom: i < steps.length - 1 ? 14 : 0,
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: i <= step ? ORANGE : 'rgba(255,255,255,0.07)',
                  border:
                    i <= step ? 'none' : '0.5px solid rgba(255,255,255,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 13,
                }}
              >
                {i <= step ? (
                  '✓'
                ) : (
                  <span style={{ fontSize: 10, color: MUTED }}>{i + 1}</span>
                )}
              </div>
              {i < steps.length - 1 && (
                <div
                  style={{
                    width: 2,
                    height: 18,
                    background: i < step ? ORANGE : 'rgba(255,255,255,0.07)',
                    marginTop: 3,
                  }}
                />
              )}
            </div>
            <div style={{ paddingTop: 4 }}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: i <= step ? 500 : 400,
                  color: i <= step ? WHITE : MUTED,
                }}
              >
                {s.label}
              </div>
              {i === step && (
                <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>
                  {s.desc}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Order items */}
      <div
        style={{
          background: CARD,
          borderRadius: 16,
          padding: '14px',
          border: '0.5px solid rgba(255,255,255,0.06)',
          marginBottom: 14,
        }}
      >
        <div style={{ fontSize: 12, color: MUTED, marginBottom: 10 }}>
          Order summary
        </div>
        {order.items.map((item) => (
          <div
            key={item.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 8,
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: 18 }}>{item.emoji}</span>
              <div>
                <div style={{ fontSize: 12, color: WHITE }}>{item.name}</div>
                <div style={{ fontSize: 10, color: MUTED }}>x{item.qty}</div>
              </div>
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: ORANGE }}>
              Rs {item.price * item.qty}
            </span>
          </div>
        ))}
        <div
          style={{
            height: '0.5px',
            background: 'rgba(255,255,255,0.08)',
            margin: '8px 0',
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 13, color: MUTED }}>Total paid</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: ORANGE }}>
            Rs {order.total}
          </span>
        </div>
      </div>

      {/* Impact */}
      <div
        style={{
          background: '#0E1F1A',
          borderRadius: 14,
          padding: '12px 14px',
          border: `0.5px solid rgba(29,158,117,0.3)`,
          marginBottom: 16,
        }}
      >
        <div
          style={{
            fontSize: 11,
            color: TEAL,
            fontWeight: 500,
            marginBottom: 6,
          }}
        >
          🌍 Your impact today
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Pill bg="rgba(29,158,117,0.15)" color={TEAL}>
            🍽️ {order.items.length} meal rescued
          </Pill>
          <Pill bg="rgba(29,158,117,0.15)" color={TEAL}>
            🌱 CO₂ saved
          </Pill>
          <Pill bg="rgba(255,209,102,0.15)" color={GOLD}>
            🪙 +{order.items.length * 20} coins
          </Pill>
        </div>
      </div>

      {step === steps.length - 1 && (
        <button
          onClick={onDone}
          style={{
            width: '100%',
            background: ORANGE,
            border: 'none',
            borderRadius: 14,
            padding: '14px',
            fontSize: 14,
            fontWeight: 700,
            color: WHITE,
            cursor: 'pointer',
          }}
        >
          Back to Home 🏠
        </button>
      )}
    </div>
  );
}

// ── HOME SCREEN ───────────────────────────────────────────────
function HomeScreen({
  setTab,
  userCoins,
  setUserCoins,
  savedMeals,
  setSavedMeals,
  cart,
  setCart,
  setScreen,
  setActiveDeal,
}) {
  const [activeCat, setActiveCat] = useState('All');
  const cats = [
    'All',
    'Bakeries',
    'Cafés',
    'Italian',
    'Healthy',
    'Desserts',
    'Japanese',
  ];
  const filtered =
    activeCat === 'All' ? deals : deals.filter((d) => d.cat === activeCat);
  const [mins, setMins] = useState(deals.map((d) => d.mins));

  useEffect(() => {
    const t = setInterval(
      () => setMins((m) => m.map((x) => (x > 0 ? x - 1 / 60 : 0))),
      1000
    );
    return () => clearInterval(t);
  }, []);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <div>
      <div style={{ background: DARK, padding: '10px 18px 18px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 14,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 26,
                fontWeight: 700,
                letterSpacing: -1,
                color: WHITE,
                lineHeight: 1,
              }}
            >
              Crave<span style={{ color: ORANGE }}>Save</span>
            </div>
            <div
              style={{
                fontSize: 9,
                color: 'rgba(255,255,255,0.35)',
                letterSpacing: 2,
                marginTop: 2,
              }}
            >
              RESCUE FOOD · SAVE MONEY
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
              }}
              onClick={() => setTab('score')}
            >
              <div style={{ fontSize: 11, color: GOLD, fontWeight: 600 }}>
                🪙 {userCoins}
              </div>
              <div style={{ fontSize: 9, color: MUTED }}>coins</div>
            </div>
            <button
              onClick={() => setScreen('cart')}
              style={{
                position: 'relative',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 12,
                  background: CARD,
                  border: '0.5px solid rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                }}
              >
                🛒
              </div>
              {cartCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: -4,
                    right: -4,
                    background: ORANGE,
                    color: WHITE,
                    fontSize: 9,
                    fontWeight: 700,
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
        <div
          style={{
            background: '#1C1510',
            borderRadius: 14,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 14px',
            border: '0.5px solid rgba(255,255,255,0.07)',
          }}
        >
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 16 }}>
            🔍
          </span>
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>
            Search deals, restaurants...
          </span>
        </div>
      </div>

      <div
        style={{
          margin: '0 16px 14px',
          background: '#12172A',
          border: `0.5px solid rgba(55,138,221,0.3)`,
          borderRadius: 14,
          padding: '11px 14px',
        }}
      >
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <div style={{ fontSize: 22, flexShrink: 0 }}>🤖</div>
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: '#85B7EB',
                marginBottom: 3,
              }}
            >
              AI Match for you
            </div>
            <div
              style={{
                fontSize: 12,
                color: 'rgba(133,183,235,0.75)',
                lineHeight: 1.5,
              }}
            >
              You usually grab coffee at this time — Brewed Awakening has a
              Pastry + Latte for Rs 380 only 0.8km away!
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          margin: '0 16px 14px',
          background: ORANGE,
          borderRadius: 12,
          padding: '9px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: '#fff',
            animation: 'pulse 1.1s ease-in-out infinite',
          }}
        />
        <span style={{ fontSize: 12, color: '#fff', fontWeight: 500, flex: 1 }}>
          Reverse surge pricing — prices drop every minute!
        </span>
        <span
          style={{
            background: 'rgba(0,0,0,0.2)',
            padding: '3px 8px',
            borderRadius: 8,
            fontSize: 11,
            color: '#fff',
            fontWeight: 600,
          }}
        >
          {filtered.length} live
        </span>
      </div>

      <div
        style={{
          display: 'flex',
          gap: 8,
          overflowX: 'auto',
          padding: '0 16px 14px',
          scrollbarWidth: 'none',
        }}
      >
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setActiveCat(c)}
            style={{
              background: activeCat === c ? ORANGE : CARD,
              border:
                activeCat === c
                  ? `0.5px solid ${ORANGE}`
                  : '0.5px solid rgba(255,255,255,0.07)',
              borderRadius: 20,
              padding: '7px 14px',
              whiteSpace: 'nowrap',
              fontSize: 12,
              color: activeCat === c ? '#fff' : MUTED,
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            {c}
          </button>
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '0 16px',
          marginBottom: 12,
        }}
      >
        <span style={{ fontSize: 15, fontWeight: 500, color: WHITE }}>
          ⚡ Flash deals
        </span>
        <span style={{ fontSize: 12, color: ORANGE }}>See all</span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0,1fr))',
          gap: 10,
          padding: '0 16px 16px',
        }}
      >
        {filtered.map((deal) => {
          const idx = deals.indexOf(deal);
          const curMins = Math.round(mins[idx]);
          const disc = getDiscount(curMins);
          const price = discountedPrice(deal.orig, curMins);
          const dColor = getDiscountColor(curMins);
          return (
            <div
              key={deal.id}
              onClick={() => {
                setActiveDeal({ deal, mins: mins[idx] });
                setScreen('detail');
              }}
              style={{
                background: CARD,
                borderRadius: 16,
                overflow: 'hidden',
                border: '0.5px solid rgba(255,255,255,0.06)',
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  background: deal.bg,
                  height: 100,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 44,
                  position: 'relative',
                }}
              >
                {deal.emoji}
                <span
                  style={{
                    position: 'absolute',
                    top: 8,
                    left: 8,
                    background: dColor,
                    color: '#fff',
                    fontSize: 10,
                    fontWeight: 700,
                    padding: '3px 7px',
                    borderRadius: 7,
                  }}
                >
                  {disc}% OFF
                </span>
                <span
                  style={{
                    position: 'absolute',
                    bottom: 8,
                    right: 8,
                    background: 'rgba(0,0,0,0.55)',
                    borderRadius: 8,
                    padding: '3px 7px',
                    fontSize: 10,
                    color: GOLD,
                  }}
                >
                  ⏱ {fmtMins(curMins)}
                </span>
              </div>
              <div style={{ padding: '10px 10px 11px' }}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: WHITE,
                    marginBottom: 2,
                  }}
                >
                  {deal.name}
                </div>
                <div style={{ fontSize: 10, color: MUTED, marginBottom: 7 }}>
                  {deal.resto}
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: 5,
                    marginBottom: 7,
                  }}
                >
                  <span
                    style={{ fontSize: 16, fontWeight: 700, color: dColor }}
                  >
                    Rs {price}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      color: 'rgba(255,255,255,0.25)',
                      textDecoration: 'line-through',
                    }}
                  >
                    Rs {deal.orig}
                  </span>
                </div>
                <div
                  style={{
                    height: 3,
                    background: 'rgba(255,255,255,0.07)',
                    borderRadius: 2,
                    marginBottom: 5,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${(deal.qty / deal.total) * 100}%`,
                      height: '100%',
                      background:
                        deal.qty / deal.total < 0.35 ? '#E24B4A' : GOLD,
                      borderRadius: 2,
                    }}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>
                    {deal.qty} left
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const p = discountedPrice(
                        deal.orig,
                        Math.round(mins[deals.indexOf(deal)])
                      );
                      setCart((c) => {
                        const ex = c.find((x) => x.id === deal.id);
                        if (ex)
                          return c.map((x) =>
                            x.id === deal.id ? { ...x, qty: x.qty + 1 } : x
                          );
                        return [...c, { ...deal, price: p, qty: 1 }];
                      });
                    }}
                    style={{
                      background: ORANGE,
                      border: 'none',
                      borderRadius: 8,
                      padding: '4px 10px',
                      fontSize: 10,
                      fontWeight: 600,
                      color: '#fff',
                      cursor: 'pointer',
                    }}
                  >
                    + Add
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {cartCount > 0 && (
        <div style={{ margin: '0 16px 20px' }}>
          <button
            onClick={() => setScreen('cart')}
            style={{
              width: '100%',
              background: ORANGE,
              border: 'none',
              borderRadius: 14,
              padding: '14px',
              fontSize: 14,
              fontWeight: 700,
              color: WHITE,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
            }}
          >
            <span>
              🛒 View Cart ({cartCount} item{cartCount > 1 ? 's' : ''})
            </span>
            <span
              style={{
                background: 'rgba(0,0,0,0.2)',
                padding: '2px 10px',
                borderRadius: 8,
              }}
            >
              Rs {cart.reduce((s, i) => s + i.price * i.qty, 0)}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}

// ── RESCUE SCORE ──────────────────────────────────────────────
function ScoreScreen({ userCoins, savedMeals }) {
  const co2 = (savedMeals * 0.65).toFixed(1);
  const kg = (savedMeals * 0.42).toFixed(1);
  const [activeTab, setActiveTab] = useState('friends');
  return (
    <div style={{ padding: '18px 16px' }}>
      <div
        style={{
          background: '#0E1F1A',
          border: `0.5px solid rgba(29,158,117,0.3)`,
          borderRadius: 20,
          padding: '22px 20px',
          marginBottom: 16,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontSize: 13,
            color: 'rgba(93,202,165,0.7)',
            marginBottom: 8,
          }}
        >
          Your Food Rescue Score
        </div>
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: TEAL,
            lineHeight: 1,
            marginBottom: 4,
          }}
        >
          {savedMeals * 4 + userCoins}
        </div>
        <div
          style={{
            fontSize: 12,
            color: 'rgba(93,202,165,0.5)',
            marginBottom: 12,
          }}
        >
          Rescue Ranger 🌿
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 8,
            flexWrap: 'wrap',
          }}
        >
          <Pill bg="rgba(29,158,117,0.15)" color={TEAL}>
            {savedMeals} meals
          </Pill>
          <Pill bg="rgba(29,158,117,0.15)" color={TEAL}>
            {kg}kg rescued
          </Pill>
          <Pill bg="rgba(29,158,117,0.15)" color={TEAL}>
            {co2}kg CO₂
          </Pill>
        </div>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0,1fr))',
          gap: 10,
          marginBottom: 16,
        }}
      >
        {[
          ['🍽️', savedMeals, 'Meals saved', TEAL],
          ['♻️', `${kg} kg`, 'Food rescued', '#97C459'],
          ['🌍', `${co2} kg`, 'CO₂ prevented', '#5DCAA5'],
          ['🪙', userCoins, 'CraveCoins', GOLD],
        ].map(([icon, val, label, color]) => (
          <div
            key={label}
            style={{
              background: CARD,
              borderRadius: 14,
              padding: '14px 12px',
              border: '0.5px solid rgba(255,255,255,0.06)',
            }}
          >
            <div style={{ fontSize: 22, marginBottom: 6 }}>{icon}</div>
            <div
              style={{ fontSize: 20, fontWeight: 700, color, marginBottom: 2 }}
            >
              {val}
            </div>
            <div style={{ fontSize: 11, color: MUTED }}>{label}</div>
          </div>
        ))}
      </div>
      <div
        style={{
          background: CARD,
          borderRadius: 16,
          padding: '14px',
          border: '0.5px solid rgba(255,255,255,0.06)',
          marginBottom: 12,
        }}
      >
        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          {['friends', 'cities'].map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              style={{
                flex: 1,
                background: activeTab === t ? ORANGE : 'transparent',
                border:
                  activeTab === t
                    ? 'none'
                    : '0.5px solid rgba(255,255,255,0.1)',
                borderRadius: 10,
                padding: '7px',
                fontSize: 12,
                fontWeight: 500,
                color: activeTab === t ? '#fff' : MUTED,
                cursor: 'pointer',
              }}
            >
              {t === 'friends' ? '👥 Friends' : '🏙️ Cities'}
            </button>
          ))}
        </div>
        {activeTab === 'friends'
          ? friends.map((f, idx) => (
              <div
                key={f.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  marginBottom: 10,
                }}
              >
                <span style={{ fontSize: 16, width: 22, textAlign: 'center' }}>
                  {['🥇', '🥈', '🥉', '4️⃣'][idx]}
                </span>
                <Avatar label={f.avatar} color={ORANGE} size={32} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: WHITE, fontWeight: 500 }}>
                    {f.name}
                  </div>
                  <div style={{ fontSize: 10, color: MUTED }}>
                    {f.meals} meals · {f.saved}kg
                  </div>
                </div>
                <span style={{ fontSize: 12, color: GOLD, fontWeight: 600 }}>
                  🪙 {f.coins}
                </span>
              </div>
            ))
          : cityBoard.map((c, idx) => (
              <div
                key={c.city}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  marginBottom: 10,
                }}
              >
                <span style={{ fontSize: 16, width: 22, textAlign: 'center' }}>
                  {['🥇', '🥈', '🥉', '4️⃣'][idx]}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: WHITE, fontWeight: 500 }}>
                    {c.city}
                  </div>
                  <div style={{ fontSize: 10, color: MUTED }}>
                    {c.co2}kg CO₂ prevented
                  </div>
                </div>
                <span style={{ fontSize: 12, color: TEAL, fontWeight: 600 }}>
                  {c.meals} meals
                </span>
              </div>
            ))}
      </div>
      <div
        style={{
          background: '#1A0E1A',
          border: `0.5px solid rgba(212,83,126,0.3)`,
          borderRadius: 16,
          padding: '14px',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: 10,
            alignItems: 'center',
            marginBottom: 12,
          }}
        >
          <span style={{ fontSize: 22 }}>❤️</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: '#ED93B1' }}>
              Donate coins · Feed someone
            </div>
            <div style={{ fontSize: 11, color: 'rgba(237,147,177,0.6)' }}>
              100 coins = 1 meal via Edhi Foundation
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[50, 100, 200].map((amt) => (
            <button
              key={amt}
              style={{
                flex: 1,
                background: 'rgba(212,83,126,0.15)',
                border: '0.5px solid rgba(212,83,126,0.3)',
                borderRadius: 10,
                padding: '8px',
                fontSize: 12,
                color: '#ED93B1',
                cursor: 'pointer',
                fontWeight: 500,
              }}
            >
              🪙 {amt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── TOGETHER SCREEN ───────────────────────────────────────────
function TogetherScreen() {
  const [showCreate, setShowCreate] = useState(false);
  const groups = [
    {
      name: 'Hostel Food Squad',
      members: 5,
      deal: "Napoli's Big Pizza",
      savings: 280,
      emoji: '🍕',
      progress: 4,
    },
    {
      name: 'Office Lunch Gang',
      members: 3,
      deal: 'Bento Box Bundle',
      savings: 180,
      emoji: '🍱',
      progress: 2,
    },
  ];
  return (
    <div style={{ padding: '18px 16px' }}>
      <div
        style={{ fontSize: 18, fontWeight: 500, color: WHITE, marginBottom: 4 }}
      >
        Rescue Together
      </div>
      <div style={{ fontSize: 12, color: MUTED, marginBottom: 18 }}>
        Split deals with friends. Buy more, save more.
      </div>
      {groups.map((g) => (
        <div
          key={g.name}
          style={{
            background: CARD,
            borderRadius: 18,
            padding: '16px',
            border: '0.5px solid rgba(255,255,255,0.06)',
            marginBottom: 12,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 10,
            }}
          >
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: WHITE }}>
                {g.emoji} {g.name}
              </div>
              <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>
                Claiming: {g.deal}
              </div>
            </div>
            <Pill bg="rgba(29,158,117,0.15)" color={TEAL}>
              Rs {g.savings} saved
            </Pill>
          </div>
          <div style={{ marginBottom: 10 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 5,
              }}
            >
              <span style={{ fontSize: 11, color: MUTED }}>
                {g.progress}/{g.members} joined
              </span>
              <span style={{ fontSize: 11, color: ORANGE }}>
                {g.members - g.progress} spots left
              </span>
            </div>
            <div
              style={{
                height: 6,
                background: 'rgba(255,255,255,0.07)',
                borderRadius: 3,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${(g.progress / g.members) * 100}%`,
                  height: '100%',
                  background: ORANGE,
                  borderRadius: 3,
                }}
              />
            </div>
          </div>
          <button
            style={{
              width: '100%',
              background: ORANGE,
              border: 'none',
              borderRadius: 12,
              padding: '11px',
              fontSize: 13,
              fontWeight: 600,
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            Join this squad →
          </button>
        </div>
      ))}
      <button
        onClick={() => setShowCreate(!showCreate)}
        style={{
          width: '100%',
          background: CARD,
          border: `0.5px solid ${ORANGE}44`,
          borderRadius: 16,
          padding: '14px',
          fontSize: 13,
          fontWeight: 500,
          color: ORANGE,
          cursor: 'pointer',
          marginBottom: showCreate ? 12 : 0,
        }}
      >
        + Create new group
      </button>
      {showCreate && (
        <div
          style={{
            background: CARD,
            borderRadius: 16,
            padding: '16px',
            border: '0.5px solid rgba(255,255,255,0.08)',
          }}
        >
          <input
            placeholder="Group name..."
            style={{
              width: '100%',
              background: '#0E0A07',
              border: '0.5px solid rgba(255,255,255,0.12)',
              borderRadius: 10,
              padding: '10px 12px',
              fontSize: 13,
              color: WHITE,
              marginBottom: 10,
              outline: 'none',
            }}
          />
          <input
            placeholder="Invite friends by username..."
            style={{
              width: '100%',
              background: '#0E0A07',
              border: '0.5px solid rgba(255,255,255,0.12)',
              borderRadius: 10,
              padding: '10px 12px',
              fontSize: 13,
              color: WHITE,
              marginBottom: 12,
              outline: 'none',
            }}
          />
          <button
            style={{
              width: '100%',
              background: ORANGE,
              border: 'none',
              borderRadius: 12,
              padding: '11px',
              fontSize: 13,
              fontWeight: 600,
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            Create squad 🤝
          </button>
        </div>
      )}
    </div>
  );
}

// ── AI SCREEN ─────────────────────────────────────────────────
function AIScreen() {
  const [mood, setMood] = useState(null);
  const [budget, setBudget] = useState(500);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const moods = [
    { id: 'hungry', label: 'Starving 😤' },
    { id: 'snack', label: 'Just a snack 🍪' },
    { id: 'healthy', label: 'Healthy 🥗' },
    { id: 'sweet', label: 'Sweet tooth 🍫' },
    { id: 'coffee', label: 'Caffeine fix ☕' },
  ];
  function findMatches() {
    if (!mood) return;
    setLoading(true);
    setTimeout(() => {
      const moodMap = {
        hungry: ['Italian', 'Japanese'],
        snack: ['Cafés', 'Bakeries'],
        healthy: ['Healthy'],
        sweet: ['Desserts'],
        coffee: ['Cafés', 'Bakeries'],
      };
      const cats = moodMap[mood] || [];
      const result = deals
        .filter(
          (d) =>
            cats.includes(d.cat) && discountedPrice(d.orig, d.mins) <= budget
        )
        .slice(0, 3);
      setMatches(
        result.length
          ? result
          : deals
              .filter((d) => discountedPrice(d.orig, d.mins) <= budget)
              .slice(0, 2)
      );
      setLoading(false);
    }, 1000);
  }
  return (
    <div style={{ padding: '18px 16px' }}>
      <div
        style={{
          display: 'flex',
          gap: 12,
          alignItems: 'flex-start',
          marginBottom: 18,
        }}
      >
        <div style={{ fontSize: 28 }}>🤖</div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 500, color: WHITE }}>
            AI Meal Match
          </div>
          <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>
            Tell me your vibe. I'll find the best rescue deals for you.
          </div>
        </div>
      </div>
      <div
        style={{
          background: CARD,
          borderRadius: 16,
          padding: '14px',
          border: '0.5px solid rgba(255,255,255,0.06)',
          marginBottom: 12,
        }}
      >
        <div style={{ fontSize: 12, color: MUTED, marginBottom: 10 }}>
          What are you feeling?
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {moods.map((m) => (
            <button
              key={m.id}
              onClick={() => setMood(m.id)}
              style={{
                background: mood === m.id ? ORANGE : '#0E0A07',
                border:
                  mood === m.id ? 'none' : '0.5px solid rgba(255,255,255,0.1)',
                borderRadius: 10,
                padding: '8px 12px',
                fontSize: 12,
                color: mood === m.id ? '#fff' : MUTED,
                cursor: 'pointer',
                fontWeight: mood === m.id ? 600 : 400,
              }}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>
      <div
        style={{
          background: CARD,
          borderRadius: 16,
          padding: '14px',
          border: '0.5px solid rgba(255,255,255,0.06)',
          marginBottom: 12,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 10,
          }}
        >
          <span style={{ fontSize: 12, color: MUTED }}>Max budget</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: ORANGE }}>
            Rs {budget}
          </span>
        </div>
        <input
          type="range"
          min={100}
          max={1500}
          step={50}
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
          style={{ width: '100%', accentColor: ORANGE }}
        />
      </div>
      <button
        onClick={findMatches}
        disabled={!mood}
        style={{
          width: '100%',
          background: mood ? ORANGE : 'rgba(255,255,255,0.07)',
          border: 'none',
          borderRadius: 14,
          padding: '13px',
          fontSize: 14,
          fontWeight: 600,
          color: mood ? '#fff' : MUTED,
          cursor: mood ? 'pointer' : 'not-allowed',
          marginBottom: 16,
        }}
      >
        {loading ? 'Finding matches...' : 'Find my matches ✨'}
      </button>
      {matches.length > 0 &&
        !loading &&
        matches.map((deal) => {
          const price = discountedPrice(deal.orig, deal.mins);
          return (
            <div
              key={deal.id}
              style={{
                background: CARD,
                borderRadius: 16,
                padding: '14px',
                border: `0.5px solid ${ORANGE}33`,
                marginBottom: 10,
                display: 'flex',
                gap: 12,
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: deal.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 26,
                  flexShrink: 0,
                }}
              >
                {deal.emoji}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: WHITE }}>
                  {deal.name}
                </div>
                <div style={{ fontSize: 11, color: MUTED, marginBottom: 6 }}>
                  {deal.resto} · {fmtMins(deal.mins)} left
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <Pill>{getDiscount(deal.mins)}% off</Pill>
                  <Pill bg="rgba(29,158,117,0.15)" color={TEAL}>
                    Rs {price}
                  </Pill>
                </div>
              </div>
              <button
                style={{
                  background: ORANGE,
                  border: 'none',
                  borderRadius: 10,
                  padding: '8px 12px',
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#fff',
                  cursor: 'pointer',
                }}
              >
                Grab
              </button>
            </div>
          );
        })}
    </div>
  );
}

// ── ROULETTE ──────────────────────────────────────────────────
function RouletteScreen({ userCoins, setUserCoins }) {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [angle, setAngle] = useState(0);
  const [history, setHistory] = useState([]);
  const canvasRef = useRef(null);
  const segCount = rouletteItems.length;
  const segAngle = 360 / segCount;

  useEffect(() => {
    drawWheel(angle);
  }, [angle]);

  function drawWheel(rot) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const cx = canvas.width / 2,
      cy = canvas.height / 2,
      r = cx - 6;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    rouletteItems.forEach((item, i) => {
      const start = ((i * segAngle - 90 + rot) * Math.PI) / 180;
      const end = (((i + 1) * segAngle - 90 + rot) * Math.PI) / 180;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, start, end);
      ctx.fillStyle = item.color + 'CC';
      ctx.fill();
      ctx.strokeStyle = '#0E0A07';
      ctx.lineWidth = 2;
      ctx.stroke();
      const mid = (start + end) / 2;
      const tx = cx + r * 0.65 * Math.cos(mid),
        ty = cy + r * 0.65 * Math.sin(mid);
      ctx.save();
      ctx.translate(tx, ty);
      ctx.rotate(mid + Math.PI / 2);
      ctx.textAlign = 'center';
      ctx.font = 'bold 10px sans-serif';
      ctx.fillStyle = '#fff';
      ctx.fillText(item.label, 0, 0);
      ctx.restore();
      ctx.font = '14px sans-serif';
      const ex = cx + r * 0.38 * Math.cos(mid),
        ey = cy + r * 0.38 * Math.sin(mid);
      ctx.fillText(item.emoji, ex - 7, ey + 5);
    });
    ctx.beginPath();
    ctx.arc(cx, cy, 20, 0, Math.PI * 2);
    ctx.fillStyle = DARK;
    ctx.fill();
    ctx.strokeStyle = ORANGE;
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  function spin() {
    if (spinning || userCoins < 100) return;
    setUserCoins((c) => c - 100);
    setSpinning(true);
    setResult(null);
    const extra = 1440 + Math.random() * 360;
    const duration = 3500,
      startAngle = angle,
      start = performance.now();
    function animate(now) {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 4);
      const cur = startAngle + extra * ease;
      setAngle(cur);
      drawWheel(cur);
      if (t < 1) {
        requestAnimationFrame(animate);
        return;
      }
      const finalAngle = cur % 360;
      const idx =
        Math.floor(((360 - finalAngle + 90) % 360) / segAngle) % segCount;
      const winner = rouletteItems[idx];
      setResult(winner);
      setHistory((h) => [winner, ...h].slice(0, 5));
      setSpinning(false);
    }
    requestAnimationFrame(animate);
  }

  return (
    <div style={{ padding: '18px 16px' }}>
      <div
        style={{ fontSize: 18, fontWeight: 500, color: WHITE, marginBottom: 4 }}
      >
        Flash Roulette 🎰
      </div>
      <div style={{ fontSize: 12, color: MUTED, marginBottom: 16 }}>
        Spend 100 coins, win deals, free meals & more!
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: 14,
          position: 'relative',
        }}
      >
        <div style={{ position: 'relative' }}>
          <canvas ref={canvasRef} width={260} height={260} />
          <div
            style={{
              position: 'absolute',
              top: -8,
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: 22,
            }}
          >
            🔻
          </div>
        </div>
      </div>
      {result && (
        <div
          style={{
            background: result.color + '22',
            border: `0.5px solid ${result.color}66`,
            borderRadius: 16,
            padding: '14px',
            marginBottom: 12,
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 6 }}>{result.emoji}</div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: WHITE,
              marginBottom: 4,
            }}
          >
            You won: {result.label}!
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
            Added to your rewards 🎉
          </div>
        </div>
      )}
      <div
        style={{
          display: 'flex',
          gap: 10,
          alignItems: 'center',
          marginBottom: 12,
        }}
      >
        <div
          style={{
            flex: 1,
            background: CARD,
            borderRadius: 12,
            padding: '10px 14px',
            border: '0.5px solid rgba(255,255,255,0.07)',
          }}
        >
          <span style={{ fontSize: 11, color: MUTED }}>Your coins</span>
          <div style={{ fontSize: 18, fontWeight: 700, color: GOLD }}>
            🪙 {userCoins}
          </div>
        </div>
        <button
          onClick={spin}
          disabled={spinning || userCoins < 100}
          style={{
            flex: 2,
            background: userCoins >= 100 ? ORANGE : 'rgba(255,255,255,0.05)',
            border: 'none',
            borderRadius: 14,
            padding: '14px',
            fontSize: 14,
            fontWeight: 700,
            color: userCoins >= 100 ? '#fff' : MUTED,
            cursor: userCoins >= 100 ? 'pointer' : 'not-allowed',
          }}
        >
          {spinning ? 'Spinning...' : 'Spin 🪙 100'}
        </button>
      </div>
      {history.length > 0 && (
        <div
          style={{
            background: CARD,
            borderRadius: 14,
            padding: '12px 14px',
            border: '0.5px solid rgba(255,255,255,0.06)',
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: WHITE,
              marginBottom: 8,
            }}
          >
            Recent wins
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {history.map((h, i) => (
              <Pill key={i} bg={h.color + '22'} color={h.color}>
                {h.emoji} {h.label}
              </Pill>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────
export default function CraveSave() {
  const [tab, setTab] = useState('home');
  const [screen, setScreen] = useState('main'); // main | detail | cart | checkout | tracking
  const [cart, setCart] = useState([]);
  const [activeDeal, setActiveDeal] = useState(null);
  const [order, setOrder] = useState(null);
  const [userCoins, setUserCoins] = useState(240);
  const [savedMeals, setSavedMeals] = useState(8);

  const tabs = [
    { id: 'home', icon: 'ti-home-2', label: 'Home' },
    { id: 'ai', icon: 'ti-robot', label: 'AI Match' },
    { id: 'together', icon: 'ti-users', label: 'Together' },
    { id: 'score', icon: 'ti-leaf', label: 'Impact' },
    { id: 'roulette', icon: 'ti-rotate-clockwise-2', label: 'Spin' },
  ];

  function addToCart(deal, qty, price) {
    setCart((c) => {
      const ex = c.find((x) => x.id === deal.id);
      if (ex)
        return c.map((x) => (x.id === deal.id ? { ...x, qty, price } : x));
      return [...c, { ...deal, qty, price }];
    });
    setScreen('cart');
  }

  function placeOrder(method, pickup) {
    const total =
      cart.reduce((s, i) => s + i.price * i.qty, 0) +
      (pickup === 'delivery' ? 60 : 0);
    const newOrder = {
      id: Math.floor(Math.random() * 9000 + 1000),
      items: [...cart],
      total,
      method,
      pickup,
    };
    setOrder(newOrder);
    setUserCoins((c) => c + cart.length * 20);
    setSavedMeals((m) => m + cart.length);
    setCart([]);
    setScreen('tracking');
  }

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  let content;
  if (screen === 'detail' && activeDeal) {
    content = (
      <DealDetail
        deal={activeDeal.deal}
        mins={activeDeal.mins}
        onBack={() => setScreen('main')}
        onAddToCart={addToCart}
        cart={cart}
      />
    );
  } else if (screen === 'cart') {
    content = (
      <CartScreen
        cart={cart}
        setCart={setCart}
        onCheckout={() => setScreen('checkout')}
        onBack={() => setScreen('main')}
      />
    );
  } else if (screen === 'checkout') {
    content = (
      <CheckoutScreen
        cart={cart}
        onBack={() => setScreen('cart')}
        onPlaceOrder={placeOrder}
      />
    );
  } else if (screen === 'tracking' && order) {
    content = (
      <OrderTracking
        order={order}
        onDone={() => {
          setScreen('main');
          setTab('home');
        }}
      />
    );
  } else {
    const screens = {
      home: (
        <HomeScreen
          setTab={setTab}
          userCoins={userCoins}
          setUserCoins={setUserCoins}
          savedMeals={savedMeals}
          setSavedMeals={setSavedMeals}
          cart={cart}
          setCart={setCart}
          setScreen={setScreen}
          setActiveDeal={setActiveDeal}
        />
      ),
      ai: <AIScreen />,
      together: <TogetherScreen />,
      score: <ScoreScreen userCoins={userCoins} savedMeals={savedMeals} />,
      roulette: (
        <RouletteScreen userCoins={userCoins} setUserCoins={setUserCoins} />
      ),
    };
    content = screens[tab];
  }

  const showNav = screen === 'main';

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '8px 0 24px',
        background: 'transparent',
      }}
    >
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.7)} }
        * { box-sizing:border-box; }
        input[type=range] { height:4px; }
        button { font-family:inherit; }
        input { font-family:inherit; color:white; }
        ::placeholder { color:rgba(255,255,255,0.25); }
        ::-webkit-scrollbar { display:none; }
      `}</style>
      <div
        style={{
          width: 390,
          background: DARK,
          borderRadius: 40,
          overflow: 'hidden',
          border: `5px solid #1a1410`,
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            background: DARK,
            padding: '10px 20px 4px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 500, color: WHITE }}>
            9:41
          </span>
          <div style={{ display: 'flex', gap: 6 }}>
            <i
              className="ti ti-wifi"
              style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}
            />
            <i
              className="ti ti-battery-2"
              style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}
            />
          </div>
        </div>
        <div
          style={{ overflowY: 'auto', maxHeight: 600, scrollbarWidth: 'none' }}
        >
          {content}
        </div>
        {showNav && (
          <div
            style={{
              background: '#150F0A',
              borderTop: '0.5px solid rgba(255,255,255,0.06)',
              display: 'flex',
              padding: '10px 0 16px',
            }}
          >
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 3,
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  position: 'relative',
                }}
              >
                <i
                  className={`ti ${t.icon}`}
                  style={{
                    fontSize: 20,
                    color: tab === t.id ? ORANGE : 'rgba(255,255,255,0.25)',
                  }}
                />
                {tab === t.id ? (
                  <div
                    style={{
                      width: 4,
                      height: 4,
                      borderRadius: '50%',
                      background: ORANGE,
                    }}
                  />
                ) : (
                  <span
                    style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)' }}
                  >
                    {t.label}
                  </span>
                )}
                {t.id === 'home' && cartCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: '18%',
                      background: ORANGE,
                      color: WHITE,
                      fontSize: 8,
                      fontWeight: 700,
                      width: 14,
                      height: 14,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {cartCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
