/* @ds-bundle: {"format":3,"namespace":"RockfonDesignSystem_8b09d1","components":[{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Input","sourcePath":"components/core/Input.jsx"},{"name":"Tag","sourcePath":"components/core/Tag.jsx"}],"sourceHashes":{"components/core/Button.jsx":"138e38a96ad3","components/core/Card.jsx":"c927dfd9157e","components/core/Input.jsx":"1b86c2d104eb","components/core/Tag.jsx":"59382b5af48e","ui_kit_website/Hero.jsx":"7ce27c984236","ui_kit_website/SampleForm.jsx":"a959eaf8097d","ui_kit_website/SiteFooter.jsx":"9d98161d3d42","ui_kit_website/SiteHeader.jsx":"19dd819542d4","ui_kit_website/SolutionGrid.jsx":"1d3f4557baef","ui_kit_website/StatBand.jsx":"1db7d78aefaa"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.RockfonDesignSystem_8b09d1 = window.RockfonDesignSystem_8b09d1 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Rockfon Button — primary action control.
 * Variants: primary (Rockfon Blue), secondary (outline), ghost, dark (on light over navy).
 */
function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  iconLeft = null,
  iconRight = null,
  type = "button",
  onClick,
  style = {},
  ...rest
}) {
  const sizes = {
    sm: {
      padding: "8px 16px",
      fontSize: "0.875rem"
    },
    md: {
      padding: "11px 22px",
      fontSize: "1rem"
    },
    lg: {
      padding: "14px 28px",
      fontSize: "1.0625rem"
    }
  };
  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    fontFamily: "var(--font-brand)",
    fontWeight: "var(--fw-bold)",
    lineHeight: 1,
    letterSpacing: "0.01em",
    borderRadius: "var(--radius-sm)",
    border: "2px solid transparent",
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "background var(--dur-base) var(--ease-standard), color var(--dur-base) var(--ease-standard), border-color var(--dur-base) var(--ease-standard), box-shadow var(--dur-base) var(--ease-standard)",
    opacity: disabled ? 0.45 : 1,
    whiteSpace: "nowrap",
    ...sizes[size]
  };
  const variants = {
    primary: {
      background: "var(--rf-blue)",
      color: "var(--rf-white)",
      borderColor: "var(--rf-blue)"
    },
    secondary: {
      background: "transparent",
      color: "var(--rf-blue)",
      borderColor: "var(--rf-blue)"
    },
    ghost: {
      background: "transparent",
      color: "var(--rf-blue)",
      borderColor: "transparent"
    },
    dark: {
      background: "var(--rf-white)",
      color: "var(--rf-navy)",
      borderColor: "var(--rf-white)"
    }
  };
  const [hover, setHover] = React.useState(false);
  const hoverStyle = !disabled && hover ? {
    primary: {
      background: "var(--action-hover)",
      borderColor: "var(--action-hover)"
    },
    secondary: {
      background: "var(--rf-blue)",
      color: "var(--rf-white)"
    },
    ghost: {
      background: "var(--rf-cloud)"
    },
    dark: {
      background: "var(--rf-gray-light)",
      borderColor: "var(--rf-gray-light)"
    }
  }[variant] : {};
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      ...base,
      ...variants[variant],
      ...hoverStyle,
      ...style
    }
  }, rest), iconLeft, children, iconRight);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Rockfon Card — white surface with optional full-bleed image on top.
 * The core content container: product cards, resource tiles, feature blocks.
 */
function Card({
  image,
  imageAlt = "",
  eyebrow,
  title,
  children,
  footer,
  elevation = "sm",
  href,
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const shadows = {
    none: "none",
    sm: "var(--shadow-sm)",
    md: "var(--shadow-md)"
  };
  const interactive = !!href;
  const wrap = {
    display: "flex",
    flexDirection: "column",
    background: "var(--surface-card)",
    border: "1px solid var(--rf-gray-light)",
    borderRadius: "var(--radius-md)",
    overflow: "hidden",
    boxShadow: interactive && hover ? "var(--shadow-md)" : shadows[elevation],
    transform: interactive && hover ? "translateY(-2px)" : "none",
    transition: "box-shadow var(--dur-base) var(--ease-standard), transform var(--dur-base) var(--ease-standard)",
    textDecoration: "none",
    color: "inherit",
    ...style
  };
  const inner = /*#__PURE__*/React.createElement(React.Fragment, null, image && /*#__PURE__*/React.createElement("div", {
    style: {
      aspectRatio: "16 / 10",
      overflow: "hidden",
      background: "var(--rf-cloud)"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: imageAlt,
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "block"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "var(--sp-5)",
      display: "flex",
      flexDirection: "column",
      gap: "var(--sp-2)",
      flex: 1
    }
  }, eyebrow && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-brand)",
      fontSize: "0.6875rem",
      fontWeight: "var(--fw-bold)",
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      color: "var(--rf-blue)"
    }
  }, eyebrow), title && /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontFamily: "var(--font-brand)",
      fontSize: "1.25rem",
      fontWeight: "var(--fw-bold)",
      lineHeight: 1.25,
      color: "var(--rf-ink)"
    }
  }, title), children && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: "0.9375rem",
      lineHeight: 1.6,
      color: "var(--rf-gray)"
    }
  }, children), footer && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "auto",
      paddingTop: "var(--sp-3)"
    }
  }, footer)));
  if (href) {
    return /*#__PURE__*/React.createElement("a", _extends({
      href: href,
      style: wrap,
      onMouseEnter: () => setHover(true),
      onMouseLeave: () => setHover(false)
    }, rest), inner);
  }
  return /*#__PURE__*/React.createElement("div", _extends({
    style: wrap
  }, rest), inner);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Rockfon Input — labelled text field with hairline border and blue focus.
 */
function Input({
  label,
  hint,
  error,
  id,
  type = "text",
  style = {},
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const inputId = id || (label ? `in-${label.replace(/\s+/g, "-").toLowerCase()}` : undefined);
  const borderColor = error ? "var(--rf-red)" : focus ? "var(--rf-blue)" : "var(--rf-gray-mid)";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "0.375rem",
      fontFamily: "var(--font-body)",
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: {
      fontSize: "0.8125rem",
      fontWeight: "var(--fw-demi)",
      color: "var(--rf-ink)"
    }
  }, label), /*#__PURE__*/React.createElement("input", _extends({
    id: inputId,
    type: type,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      fontFamily: "var(--font-body)",
      fontSize: "0.9375rem",
      color: "var(--rf-ink)",
      padding: "10px 13px",
      background: "var(--rf-white)",
      border: `1px solid ${borderColor}`,
      borderRadius: "var(--radius-sm)",
      outline: "none",
      boxShadow: focus && !error ? "0 0 0 3px rgba(69,166,222,0.30)" : "none",
      transition: "border-color var(--dur-base), box-shadow var(--dur-base)"
    }
  }, rest)), (hint || error) && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "0.75rem",
      color: error ? "var(--rf-red)" : "var(--rf-gray)"
    }
  }, error || hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Input.jsx", error: String((e && e.message) || e) }); }

// components/core/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Rockfon Tag / Badge — compact label for categories, statuses, metadata.
 * tone: brand | neutral | sand | teal | sky | coral | danger
 * variant: soft (tinted) | solid | outline
 */
function Tag({
  children,
  tone = "brand",
  variant = "soft",
  size = "md",
  style = {},
  ...rest
}) {
  const palette = {
    brand: {
      c: "#00638E",
      soft: "rgba(0,99,142,0.10)"
    },
    neutral: {
      c: "#63666A",
      soft: "rgba(99,102,106,0.12)"
    },
    sand: {
      c: "#9A7B2E",
      soft: "rgba(214,184,116,0.22)"
    },
    teal: {
      c: "#0E7C66",
      soft: "rgba(26,176,146,0.16)"
    },
    sky: {
      c: "#1E7CB8",
      soft: "rgba(69,166,222,0.16)"
    },
    coral: {
      c: "#C8483B",
      soft: "rgba(255,119,104,0.18)"
    },
    danger: {
      c: "#D20014",
      soft: "rgba(210,0,20,0.10)"
    }
  }[tone];
  const sizes = {
    sm: {
      padding: "2px 8px",
      fontSize: "0.6875rem"
    },
    md: {
      padding: "4px 11px",
      fontSize: "0.75rem"
    }
  };
  const variants = {
    soft: {
      background: palette.soft,
      color: palette.c,
      border: "1px solid transparent"
    },
    solid: {
      background: palette.c,
      color: "#fff",
      border: "1px solid transparent"
    },
    outline: {
      background: "transparent",
      color: palette.c,
      border: `1px solid ${palette.c}`
    }
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "0.35em",
      fontFamily: "var(--font-brand)",
      fontWeight: "var(--fw-demi)",
      letterSpacing: "0.02em",
      lineHeight: 1.4,
      borderRadius: "var(--radius-pill)",
      whiteSpace: "nowrap",
      ...sizes[size],
      ...variants[variant],
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tag.jsx", error: String((e && e.message) || e) }); }

// ui_kit_website/Hero.jsx
try { (() => {
// Rockfon marketing site — hero
function Hero({
  onRequest
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      position: "relative",
      height: 560,
      overflow: "hidden",
      background: "#000"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "url('../assets/photo-office.jpg') center/cover"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "linear-gradient(90deg, rgba(20,40,80,.80) 0%, rgba(20,40,80,.45) 45%, rgba(20,40,80,0) 75%)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      maxWidth: 1200,
      margin: "0 auto",
      height: "100%",
      padding: "0 32px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 600
    }
  }, /*#__PURE__*/React.createElement(RDS.Tag, {
    tone: "sky",
    variant: "solid",
    style: {
      marginBottom: 20
    }
  }, "Acoustic ceilings & walls"), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontFamily: "var(--font-brand)",
      fontSize: 56,
      fontWeight: 800,
      lineHeight: 1.05,
      letterSpacing: "-0.01em",
      color: "#fff"
    }
  }, "Spaces that sound as good as they look"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "20px 0 32px",
      fontFamily: "var(--font-body)",
      fontSize: 20,
      lineHeight: 1.5,
      color: "rgba(255,255,255,.92)",
      maxWidth: 500
    }
  }, "Stone wool ceilings and walls that absorb noise, reflect light and help every building feel better."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(RDS.Button, {
    variant: "primary",
    size: "lg",
    onClick: onRequest
  }, "Request a sample"), /*#__PURE__*/React.createElement(RDS.Button, {
    variant: "dark",
    size: "lg"
  }, "Explore products")))));
}
window.Hero = Hero;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kit_website/Hero.jsx", error: String((e && e.message) || e) }); }

// ui_kit_website/SampleForm.jsx
try { (() => {
// Rockfon marketing site — sample request form (uses DS Input + Button)
function SampleForm() {
  const [done, setDone] = React.useState(false);
  const [err, setErr] = React.useState({});
  const submit = e => {
    e.preventDefault();
    const f = e.target;
    const next = {};
    if (!f.name.value.trim()) next.name = "Please enter your name.";
    if (!/.+@.+\..+/.test(f.email.value)) next.email = "Enter a valid work email.";
    setErr(next);
    if (Object.keys(next).length === 0) setDone(true);
  };
  return /*#__PURE__*/React.createElement("section", {
    id: "sample",
    style: {
      background: "var(--rf-navy)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: "0 auto",
      padding: "84px 32px",
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 64,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-brand)",
      fontSize: 13,
      fontWeight: 700,
      letterSpacing: ".12em",
      textTransform: "uppercase",
      color: "var(--rf-sand)"
    }
  }, "Free sample"), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: "8px 0 16px",
      fontFamily: "var(--font-brand)",
      fontSize: 40,
      fontWeight: 800,
      color: "#fff",
      lineHeight: 1.08,
      letterSpacing: "-0.01em"
    }
  }, "Feel the difference in your hands"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: "var(--font-body)",
      fontSize: 17,
      lineHeight: 1.6,
      color: "rgba(255,255,255,.85)",
      maxWidth: 420
    }
  }, "Order a free stone wool sample and our specialists will help you specify the right system for your project.")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#fff",
      borderRadius: "var(--radius-md)",
      padding: 32,
      boxShadow: "var(--shadow-lg)"
    }
  }, done ? /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      padding: "32px 8px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 56,
      height: 56,
      borderRadius: "50%",
      background: "rgba(26,176,146,.14)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 auto 16px"
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "check",
    style: {
      width: 28,
      height: 28,
      color: "var(--rf-teal)"
    }
  })), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: "0 0 8px",
      fontFamily: "var(--font-brand)",
      fontSize: 22,
      fontWeight: 800,
      color: "var(--rf-ink)"
    }
  }, "Sample on its way"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: "var(--font-body)",
      fontSize: 15,
      color: "var(--rf-gray)"
    }
  }, "We'll be in touch within two working days.")) : /*#__PURE__*/React.createElement("form", {
    onSubmit: submit,
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(RDS.Input, {
    label: "Full name",
    name: "name",
    placeholder: "Jane Architect",
    error: err.name
  }), /*#__PURE__*/React.createElement(RDS.Input, {
    label: "Work email",
    name: "email",
    type: "email",
    placeholder: "you@firm.com",
    error: err.email
  }), /*#__PURE__*/React.createElement(RDS.Input, {
    label: "Project (optional)",
    name: "project",
    placeholder: "e.g. Riverside School"
  }), /*#__PURE__*/React.createElement(RDS.Button, {
    variant: "primary",
    size: "lg",
    type: "submit",
    style: {
      marginTop: 4
    }
  }, "Send my sample")))));
}
window.SampleForm = SampleForm;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kit_website/SampleForm.jsx", error: String((e && e.message) || e) }); }

// ui_kit_website/SiteFooter.jsx
try { (() => {
// Rockfon marketing site — footer
function SiteFooter() {
  const cols = [{
    h: "Products",
    links: ["Ceiling panels", "Ceiling systems", "Acoustic walls", "Accessories"]
  }, {
    h: "Knowledge",
    links: ["Acoustics", "Documentation", "Case studies", "Specification"]
  }, {
    h: "Company",
    links: ["About Rockfon", "Sustainability", "Careers", "Contact"]
  }];
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: "var(--rf-ink)",
      color: "#fff"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: "0 auto",
      padding: "64px 32px 28px",
      display: "grid",
      gridTemplateColumns: "1.4fr 1fr 1fr 1fr",
      gap: 40
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
    src: "../assets/logo-rockfon-white.png",
    alt: "Rockfon",
    style: {
      height: 28,
      marginBottom: 18
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: "var(--font-body)",
      fontSize: 14,
      lineHeight: 1.6,
      color: "rgba(255,255,255,.65)",
      maxWidth: 260
    }
  }, "Stone wool acoustic ceilings and walls for healthier, more beautiful buildings.")), cols.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.h
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      margin: "0 0 14px",
      fontFamily: "var(--font-brand)",
      fontSize: 12,
      fontWeight: 700,
      letterSpacing: ".1em",
      textTransform: "uppercase",
      color: "var(--rf-sand)"
    }
  }, c.h), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: "none",
      margin: 0,
      padding: 0,
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, c.links.map(l => /*#__PURE__*/React.createElement("li", {
    key: l
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      fontFamily: "var(--font-body)",
      fontSize: 14,
      color: "rgba(255,255,255,.78)",
      textDecoration: "none"
    }
  }, l))))))), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: "1px solid rgba(255,255,255,.12)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: "0 auto",
      padding: "18px 32px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-brand)",
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: ".08em",
      textTransform: "uppercase",
      color: "rgba(255,255,255,.55)"
    }
  }, "Part of ROCKWOOL Group"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: 13,
      color: "rgba(255,255,255,.5)"
    }
  }, "\xA9 2026 Rockfon. All rights reserved."))));
}
window.SiteFooter = SiteFooter;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kit_website/SiteFooter.jsx", error: String((e && e.message) || e) }); }

// ui_kit_website/SiteHeader.jsx
try { (() => {
// Rockfon marketing site — top navigation
function SiteHeader({
  onRequest
}) {
  const [open, setOpen] = React.useState(null);
  const nav = ["Products", "Inspiration", "Knowledge", "Sustainability", "About"];
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: "sticky",
      top: 0,
      zIndex: 20,
      background: "#fff",
      borderBottom: "1px solid var(--rf-gray-light)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: "0 auto",
      height: 72,
      padding: "0 32px",
      display: "flex",
      alignItems: "center",
      gap: 40
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../assets/logo-rockfon-blue.png",
    alt: "Rockfon",
    style: {
      height: 26
    }
  }), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: "flex",
      gap: 4,
      marginLeft: 8
    }
  }, nav.map(n => /*#__PURE__*/React.createElement("a", {
    key: n,
    href: "#",
    onMouseEnter: () => setOpen(n),
    onMouseLeave: () => setOpen(null),
    style: {
      fontFamily: "var(--font-brand)",
      fontSize: 15,
      fontWeight: 600,
      color: open === n ? "var(--rf-blue)" : "var(--rf-ink)",
      textDecoration: "none",
      padding: "10px 14px",
      borderRadius: 4,
      background: open === n ? "var(--rf-cloud)" : "transparent",
      transition: "background .2s, color .2s"
    }
  }, n))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: "auto",
      display: "flex",
      alignItems: "center",
      gap: 18
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6,
      fontFamily: "var(--font-brand)",
      fontSize: 14,
      fontWeight: 600,
      color: "var(--rf-gray)",
      textDecoration: "none"
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "search",
    style: {
      width: 18,
      height: 18
    }
  }), " Search"), /*#__PURE__*/React.createElement(RDS.Button, {
    variant: "primary",
    size: "sm",
    onClick: onRequest
  }, "Request a sample"))));
}
window.SiteHeader = SiteHeader;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kit_website/SiteHeader.jsx", error: String((e && e.message) || e) }); }

// ui_kit_website/SolutionGrid.jsx
try { (() => {
// Rockfon marketing site — solutions grid (uses the DS Card)
function SolutionGrid() {
  const items = [{
    img: "../assets/photo-office.jpg",
    eyebrow: "Offices",
    title: "Focus, without the noise",
    body: "Open-plan acoustics that let teams concentrate and collaborate."
  }, {
    img: "../assets/photo-curved.jpg",
    eyebrow: "Retail & leisure",
    title: "Shape sound and space",
    body: "Curved and custom systems for expressive, comfortable interiors."
  }, {
    img: "../assets/photo-office.jpg",
    eyebrow: "Education",
    title: "Rooms that help learning",
    body: "Clear speech and calm classrooms backed by Class A absorption."
  }];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: "#fff"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: "0 auto",
      padding: "84px 32px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "space-between",
      marginBottom: 40,
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-brand)",
      fontSize: 13,
      fontWeight: 700,
      letterSpacing: ".12em",
      textTransform: "uppercase",
      color: "var(--rf-gray-mid)"
    }
  }, "Solutions"), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: "6px 0 0",
      fontFamily: "var(--font-brand)",
      fontSize: 36,
      fontWeight: 800,
      color: "var(--rf-ink)",
      letterSpacing: "-0.01em"
    }
  }, "Built for every kind of building")), /*#__PURE__*/React.createElement(RDS.Button, {
    variant: "secondary"
  }, "View all solutions")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3,1fr)",
      gap: 28
    }
  }, items.map((it, i) => /*#__PURE__*/React.createElement(RDS.Card, {
    key: i,
    href: "#",
    image: it.img,
    eyebrow: it.eyebrow,
    title: it.title,
    footer: /*#__PURE__*/React.createElement("span", {
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontFamily: "var(--font-brand)",
        fontSize: 14,
        fontWeight: 700,
        color: "var(--rf-blue)"
      }
    }, "Learn more ", /*#__PURE__*/React.createElement("i", {
      "data-lucide": "arrow-right",
      style: {
        width: 16,
        height: 16
      }
    }))
  }, it.body)))));
}
window.SolutionGrid = SolutionGrid;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kit_website/SolutionGrid.jsx", error: String((e && e.message) || e) }); }

// ui_kit_website/StatBand.jsx
try { (() => {
// Rockfon marketing site — stat band (sparing, claim-backed numbers)
function StatBand() {
  const stats = [{
    v: "Class A",
    l: "Sound absorption"
  }, {
    v: "1000\u00b0C+",
    l: "Fire resistance"
  }, {
    v: "87%",
    l: "Light reflection"
  }, {
    v: "100%",
    l: "Recyclable stone wool"
  }];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: "var(--rf-blue)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: "0 auto",
      padding: "44px 32px",
      display: "grid",
      gridTemplateColumns: "repeat(4,1fr)",
      gap: 24
    }
  }, stats.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      borderLeft: "2px solid rgba(255,255,255,.3)",
      paddingLeft: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-brand)",
      fontSize: 40,
      fontWeight: 800,
      color: "#fff",
      lineHeight: 1
    }
  }, s.v), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: 14,
      color: "rgba(255,255,255,.85)",
      marginTop: 8
    }
  }, s.l)))));
}
window.StatBand = StatBand;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kit_website/StatBand.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Tag = __ds_scope.Tag;

})();
