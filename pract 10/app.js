const h = React.createElement;

const books = [
  { id: 1, title: "Quiet Bloom", image: "book-1.png", oldPrice: "50.00", price: "24.00" },
  { id: 2, title: "Sea of Light", image: "book-2.png", oldPrice: "20.00", price: "17.00" },
  { id: 3, title: "Golden Silence", image: "book-3.png", oldPrice: "23.00", price: "12.00" },
  { id: 4, title: "House of Ferns", image: "book-4.png", oldPrice: "25.00", price: "19.00" },
  { id: 5, title: "Soft Horizon", image: "book-5.png", oldPrice: "25.00", price: "20.00" },
  { id: 6, title: "Morning Glass", image: "book-6.png", oldPrice: "10.00", price: "7.00" },
];

function Brand({ footer = false }) {
  return h("a", { className: footer ? "brand brand--footer" : "brand", href: "#home", "aria-label": "Book Store home" },
    h("img", { src: "./assets/logo.png", alt: "Book Store" })
  );
}

function CartIcon() {
  return h("svg", { viewBox: "0 0 32 32", "aria-hidden": "true", className: "cart-icon", fill: "none" },
    h("path", { d: "M2 4h4l3.3 17.1a2 2 0 0 0 2 1.6h13.3a2 2 0 0 0 1.9-1.4L30 10H7", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }),
    h("circle", { cx: "12", cy: "27", r: "1.8", fill: "currentColor" }),
    h("circle", { cx: "24", cy: "27", r: "1.8", fill: "currentColor" })
  );
}

function Header({ cartCount }) {
  const links = [
    ["HOME", "#home"], ["ABOUT", "#about"], ["CONTACT", "#contact"],
    ["PAGE 1", "#collection"], ["PAGE 2", "#featured"], ["STORE", "#collection"],
  ];
  return h("header", { className: "site-header" },
    h("div", { className: "header-inner page-width" },
      h(Brand),
      h("nav", { className: "main-nav", "aria-label": "Main navigation" },
        links.map(([label, href]) => h("a", { href, key: label }, label))
      ),
      h("a", { className: "cart", href: "#collection", "aria-label": `Shopping cart, ${cartCount} items` },
        h(CartIcon), h("span", { className: "cart-count", "aria-live": "polite" }, cartCount)
      )
    )
  );
}

function Hero() {
  return h("section", { className: "hero page-width", id: "home" },
    h("div", { className: "hero-copy" },
      h("p", { className: "hero-kicker" }, "Over 4000 Amazon Reviews"),
      h("h1", null, "Best", h("br"), "selling", h("br"), "book"),
      h("p", { className: "hero-description" }, "Our bookstore is a welcoming place for readers, writers, and curious minds."),
      h("a", { className: "button button--hero", href: "#collection" }, "VIEW MORE")
    ),
    h("div", { className: "hero-image" },
      h("img", { src: "./assets/two-new-books-wrappers-4.jpg", alt: "Two copies of Everything Inside You by Virginia Burton" })
    )
  );
}

function BookCard({ book, onAdd }) {
  return h("article", { className: "book-card" },
    h("img", { className: "book-cover", src: `./assets/${book.image}`, alt: `${book.title} book cover`, loading: "lazy" }),
    h("h3", null, book.title),
    h("p", { className: "book-price" },
      h("s", null, `$${book.oldPrice}`), h("strong", null, `$${book.price}`)
    ),
    h("button", { className: "button button--cart", type: "button", onClick: onAdd }, "ADD TO CART")
  );
}

function Collection({ onAdd }) {
  return h("section", { className: "collection-section", id: "collection" },
    h("div", { className: "page-width" },
      h("div", { className: "section-heading" },
        h("p", null, "Book Collection"),
        h("h2", null, "My Books")
      ),
      h("div", { className: "book-grid" },
        books.map((book) => h(BookCard, { book, onAdd, key: book.id }))
      )
    )
  );
}

function FeaturedBook({ reverse = false, image, imageAlt, title, author, children, id }) {
  return h("section", { className: `featured-book${reverse ? " featured-book--reverse" : ""}`, id },
    h("div", { className: "featured-image" },
      h("img", { src: `./assets/${image}`, alt: imageAlt, loading: "lazy" })
    ),
    h("div", { className: "featured-copy" },
      h("h2", null, title),
      author ? h("p", { className: "featured-author" }, "By ", author) : null,
      children
    )
  );
}

function FeaturedSection() {
  return h("div", { className: "featured-section page-width", id: "featured" },
    h(FeaturedBook, {
      image: "book-7.png",
      imageAlt: "Simple Grace and a collection of botanical books",
      title: "Featured Books for Thoughtful Living",
      author: "Maya Ellison",
      id: "about",
    },
      h("p", { className: "featured-description" }, "Discover a carefully selected collection of inspiring books about personal growth, creativity, nature, and the quiet moments that shape everyday life. Each title combines thoughtful writing with elegant botanical design, making these books meaningful reads and beautiful additions to any home library."),
      h("h3", { className: "featured-title" }, "The Quiet Season")
    ),
    h(FeaturedBook, {
      reverse: true,
      image: "book-8.png",
      imageAlt: "A set of botanical books including Simple Moments and Wild Heart",
      title: "Hold Still",
      author: "Jonah Reeves",
    },
      h("p", { className: "featured-description" }, "Through short essays and personal observations, Hold Still invites readers to pause, breathe, and become more present. This thoughtful collection is ideal for anyone looking for calm, clarity, and a more intentional approach to daily life."),
      h("p", { className: "book-detail" }, h("strong", null, "Genre: "), "Essays & Reflections"),
      h("p", { className: "book-detail" }, h("strong", null, "Price: "), "$26.00")
    )
  );
}

function Footer() {
  return h("footer", { className: "site-footer", id: "contact" },
    h("div", { className: "page-width footer-inner" },
      h(Brand, { footer: true }),
      h("div", { className: "footer-grid" },
        h("section", null, h("h2", null, "Address"), h("p", null, "Leaf & Letter Books", h("br"), "148 Willow Street", h("br"), "Portland, OR 97205")),
        h("section", null, h("h2", null, "Opening Hours"), h("p", null, "Monday–Friday: 9:00 AM–7:00 PM", h("br"), "Saturday: 10:00 AM–6:00 PM", h("br"), "Sunday: 11:00 AM–5:00 PM")),
        h("section", null, h("h2", null, "Contact"), h("p", null, "Phone: +1 503 555 0148", h("br"), "Email: hello@leafandletterbooks.com")),
        h("section", null, h("h2", null, "Send Us a Message"), h("p", null, "Looking for a particular title, planning a book-club order, or interested in an upcoming event?"))
      )
    )
  );
}

function App() {
  const [cartCount, setCartCount] = React.useState(0);
  const addToCart = () => setCartCount((count) => count + 1);
  return h(React.Fragment, null,
    h(Header, { cartCount }),
    h("main", null,
      h(Hero),
      h(Collection, { onAdd: addToCart }),
      h(FeaturedSection)
    ),
    h(Footer)
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(h(App));
