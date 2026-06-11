"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

function lerp(a, b, n) {
  return (1 - n) * a + n * b;
}

function getLocalPointerPos(e, rect) {
  let clientX = 0;
  let clientY = 0;

  if (e.touches && e.touches.length > 0) {
    clientX = e.touches[0].clientX;
    clientY = e.touches[0].clientY;
  } else {
    clientX = e.clientX;
    clientY = e.clientY;
  }

  return {
    x: clientX - rect.left,
    y: clientY - rect.top,
  };
}

function getMouseDistance(p1, p2) {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.hypot(dx, dy);
}

class ImageItem {
  constructor(DOM_el) {
    this.DOM = { el: DOM_el, inner: null };
    this.DOM.inner = this.DOM.el.querySelector(".content__img-inner");
    this.defaultStyle = { scale: 1, x: 0, y: 0, opacity: 0 };
    this.rect = null;

    this._onResize = () => {
      gsap.set(this.DOM.el, this.defaultStyle);
      this.getRect();
    };

    this.getRect();
    window.addEventListener("resize", this._onResize);
  }

  getRect() {
    this.rect = this.DOM.el.getBoundingClientRect();
  }

  destroy() {
    window.removeEventListener("resize", this._onResize);
    gsap.killTweensOf(this.DOM.el);
    gsap.killTweensOf(this.DOM.inner);
    gsap.set(this.DOM.el, this.defaultStyle);
  }
}

class BaseTrail {
  constructor(container, options = {}) {
    this.container = container;
    this.DOM = { el: container };

    const { listenTarget = "window", ignoreSelector = "#mainNav" } = options;
    this.listenTarget = listenTarget === "container" ? this.container : window;
    this.ignoreSelector = ignoreSelector;

    this.images = [...this.DOM.el.querySelectorAll(".content__img")].map(
      (img) => new ImageItem(img)
    );
    this.imagesTotal = this.images.length;
    this.imgPosition = 0;
    this.zIndexVal = 1;
    this.activeImagesCount = 0;
    this.isIdle = true;
    this.threshold = 80;

    this.mousePos = { x: 0, y: 0 };
    this.lastMousePos = { x: 0, y: 0 };
    this.cacheMousePos = { x: 0, y: 0 };

    this._isDestroyed = false;
    this._rafId = 0;
    this._renderStarted = false;
    this._isVisible = true;

    if (typeof IntersectionObserver !== "undefined") {
      this._observer = new IntersectionObserver(
        ([entry]) => {
          this._isVisible = entry.isIntersecting;
          if (this._isVisible && this._renderStarted && !this._rafId) {
            this._rafId = requestAnimationFrame(() => this.render());
          }
        },
        { threshold: 0 }
      );
      this._observer.observe(this.container);
    }

    this._handlePointerMove = (ev) => {
      if (!this._isVisible) return;
      if (this._shouldIgnoreEvent(ev)) return;
      const rect = this.container.getBoundingClientRect();
      this.mousePos = getLocalPointerPos(ev, rect);
    };

    this._initRender = (ev) => {
      if (this._renderStarted) return;
      if (this._shouldIgnoreEvent(ev)) return;
      this._renderStarted = true;

      const rect = this.container.getBoundingClientRect();
      this.mousePos = getLocalPointerPos(ev, rect);
      this.cacheMousePos = { ...this.mousePos };

      this._rafId = requestAnimationFrame(() => this.render());

      this.container.removeEventListener("mousemove", this._initRender);
      this.container.removeEventListener("touchmove", this._initRender);
    };

    this.listenTarget.addEventListener("mousemove", this._handlePointerMove, { passive: true });
    this.listenTarget.addEventListener("touchmove", this._handlePointerMove, { passive: true });
    this.listenTarget.addEventListener("mousemove", this._initRender, { passive: true });
    this.listenTarget.addEventListener("touchmove", this._initRender, { passive: true });
  }

  _shouldIgnoreEvent(ev) {
    if (!this.ignoreSelector) return false;
    if (typeof document === "undefined") return false;

    const target = ev?.target;
    if (target && typeof target.closest === "function") {
      return Boolean(target.closest(this.ignoreSelector));
    }

    const ignoreEl = document.querySelector(this.ignoreSelector);
    if (!ignoreEl) return false;

    const touch = ev?.touches?.[0];
    const x = touch ? touch.clientX : ev?.clientX;
    const y = touch ? touch.clientY : ev?.clientY;
    if (typeof x !== "number" || typeof y !== "number") return false;

    const rect = ignoreEl.getBoundingClientRect();
    return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
  }

  render() {
    if (this._isDestroyed) return;
    if (this.imagesTotal === 0) return;

    if (!this._isVisible) {
      this._rafId = 0;
      return;
    }

    const distance = getMouseDistance(this.mousePos, this.lastMousePos);
    this.cacheMousePos.x = lerp(this.cacheMousePos.x, this.mousePos.x, 0.1);
    this.cacheMousePos.y = lerp(this.cacheMousePos.y, this.mousePos.y, 0.1);

    if (distance > this.threshold) {
      this.showNextImage();
      this.lastMousePos = { ...this.mousePos };
    }

    if (this.isIdle && this.zIndexVal !== 1) {
      this.zIndexVal = 1;
    }

    this._rafId = requestAnimationFrame(() => this.render());
  }

  onImageActivated() {
    this.activeImagesCount++;
    this.isIdle = false;
  }

  onImageDeactivated() {
    this.activeImagesCount--;
    if (this.activeImagesCount === 0) this.isIdle = true;
  }

  destroy() {
    this._isDestroyed = true;
    if (this._rafId) cancelAnimationFrame(this._rafId);
    if (this._observer) {
      this._observer.disconnect();
      this._observer = null;
    }

    this.listenTarget.removeEventListener("mousemove", this._handlePointerMove);
    this.listenTarget.removeEventListener("touchmove", this._handlePointerMove);
    this.listenTarget.removeEventListener("mousemove", this._initRender);
    this.listenTarget.removeEventListener("touchmove", this._initRender);

    this.images.forEach((img) => img.destroy());
  }
}

class ImageTrailVariant1 extends BaseTrail {
  showNextImage() {
    ++this.zIndexVal;
    this.imgPosition =
      this.imgPosition < this.imagesTotal - 1 ? this.imgPosition + 1 : 0;
    const img = this.images[this.imgPosition];

    gsap.killTweensOf(img.DOM.el);
    gsap
      .timeline({
        onStart: () => this.onImageActivated(),
        onComplete: () => this.onImageDeactivated(),
      })
      .fromTo(
        img.DOM.el,
        {
          opacity: 1,
          scale: 1,
          zIndex: this.zIndexVal,
          x: this.cacheMousePos.x - img.rect.width / 2,
          y: this.cacheMousePos.y - img.rect.height / 2,
        },
        {
          duration: 0.4,
          ease: "power1",
          x: this.mousePos.x - img.rect.width / 2,
          y: this.mousePos.y - img.rect.height / 2,
        },
        0
      )
      .to(
        img.DOM.el,
        { duration: 0.4, ease: "power3", opacity: 0, scale: 0.2 },
        0.4
      );
  }
}

class ImageTrailVariant2 extends BaseTrail {
  showNextImage() {
    ++this.zIndexVal;
    this.imgPosition =
      this.imgPosition < this.imagesTotal - 1 ? this.imgPosition + 1 : 0;
    const img = this.images[this.imgPosition];

    gsap.killTweensOf(img.DOM.el);
    gsap.killTweensOf(img.DOM.inner);

    gsap
      .timeline({
        onStart: () => this.onImageActivated(),
        onComplete: () => this.onImageDeactivated(),
      })
      .fromTo(
        img.DOM.el,
        {
          opacity: 1,
          scale: 0.4,
          rotation: gsap.utils.random(-15, 15),
          zIndex: this.zIndexVal,
          x: this.cacheMousePos.x - img.rect.width / 2,
          y: this.cacheMousePos.y - img.rect.height / 2,
        },
        {
          duration: 0.6,
          ease: "power3.out",
          scale: 1,
          rotation: gsap.utils.random(-4, 4),
          x: this.mousePos.x - img.rect.width / 2,
          y: this.mousePos.y - img.rect.height / 2,
        },
        0
      )
      .fromTo(
        img.DOM.inner,
        { scale: 1.4, filter: "brightness(130%)" },
        { duration: 0.6, ease: "power2.out", scale: 1, filter: "brightness(100%)" },
        0
      )
      .to(
        img.DOM.el,
        { 
          duration: 0.6, 
          ease: "power2.in", 
          opacity: 0, 
          scale: 0.4,
          rotation: gsap.utils.random(-8, 8)
        },
        0.5
      );
  }
}

class ImageTrailVariant3 extends BaseTrail {
  showNextImage() {
    ++this.zIndexVal;
    this.imgPosition =
      this.imgPosition < this.imagesTotal - 1 ? this.imgPosition + 1 : 0;
    const img = this.images[this.imgPosition];
    gsap.killTweensOf(img.DOM.el);

    gsap
      .timeline({
        onStart: () => this.onImageActivated(),
        onComplete: () => this.onImageDeactivated(),
      })
      .fromTo(
        img.DOM.el,
        {
          opacity: 1,
          scale: 0,
          zIndex: this.zIndexVal,
          xPercent: 0,
          yPercent: 0,
          x: this.cacheMousePos.x - img.rect.width / 2,
          y: this.cacheMousePos.y - img.rect.height / 2,
        },
        {
          duration: 0.4,
          ease: "power1",
          scale: 1,
          x: this.mousePos.x - img.rect.width / 2,
          y: this.mousePos.y - img.rect.height / 2,
        },
        0
      )
      .fromTo(
        img.DOM.inner,
        { scale: 1.2 },
        { duration: 0.4, ease: "power1", scale: 1 },
        0
      )
      .to(
        img.DOM.el,
        {
          duration: 0.6,
          ease: "power2",
          opacity: 0,
          scale: 0.2,
          xPercent: () => gsap.utils.random(-30, 30),
          yPercent: -200,
        },
        0.6
      );
  }
}

class ImageTrailVariant4 extends BaseTrail {
  render() {
    if (this._isDestroyed) return;
    if (this.imagesTotal === 0) return;

    const distance = getMouseDistance(this.mousePos, this.lastMousePos);
    if (distance > this.threshold) {
      this.showNextImage();
      this.lastMousePos = { ...this.mousePos };
    }

    this.cacheMousePos.x = lerp(this.cacheMousePos.x, this.mousePos.x, 0.1);
    this.cacheMousePos.y = lerp(this.cacheMousePos.y, this.mousePos.y, 0.1);

    if (this.isIdle && this.zIndexVal !== 1) this.zIndexVal = 1;
    this._rafId = requestAnimationFrame(() => this.render());
  }

  showNextImage() {
    ++this.zIndexVal;
    this.imgPosition =
      this.imgPosition < this.imagesTotal - 1 ? this.imgPosition + 1 : 0;
    const img = this.images[this.imgPosition];
    gsap.killTweensOf(img.DOM.el);

    let dx = this.mousePos.x - this.cacheMousePos.x;
    let dy = this.mousePos.y - this.cacheMousePos.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    if (distance !== 0) { dx /= distance; dy /= distance; }
    dx *= distance / 100;
    dy *= distance / 100;

    gsap
      .timeline({
        onStart: () => this.onImageActivated(),
        onComplete: () => this.onImageDeactivated(),
      })
      .fromTo(
        img.DOM.el,
        {
          opacity: 1,
          scale: 0,
          zIndex: this.zIndexVal,
          x: this.cacheMousePos.x - img.rect.width / 2,
          y: this.cacheMousePos.y - img.rect.height / 2,
        },
        {
          duration: 0.4,
          ease: "power1",
          scale: 1,
          x: this.mousePos.x - img.rect.width / 2,
          y: this.mousePos.y - img.rect.height / 2,
        },
        0
      )
      .fromTo(
        img.DOM.inner,
        {
          scale: 2,
          filter: `brightness(${Math.max((400 * distance) / 100, 100)}%) contrast(${Math.max((400 * distance) / 100, 100)}%)`,
        },
        { duration: 0.4, ease: "power1", scale: 1, filter: "brightness(100%) contrast(100%)" },
        0
      )
      .to(img.DOM.el, { duration: 0.4, ease: "power3", opacity: 0 }, 0.4)
      .to(img.DOM.el, { duration: 1.5, ease: "power4", x: `+=${dx * 110}`, y: `+=${dy * 110}` }, 0.05);
  }
}

class ImageTrailVariant5 extends BaseTrail {
  constructor(container, options) {
    super(container, options);
    this.lastAngle = 0;
  }

  showNextImage() {
    let dx = this.mousePos.x - this.cacheMousePos.x;
    let dy = this.mousePos.y - this.cacheMousePos.y;
    let angle = Math.atan2(dy, dx) * (180 / Math.PI);
    if (angle < 0) angle += 360;
    if (angle > 90 && angle <= 270) angle += 180;
    const isMovingClockwise = angle >= this.lastAngle;
    this.lastAngle = angle;
    const startAngle = isMovingClockwise ? angle - 10 : angle + 10;

    let distance = Math.sqrt(dx * dx + dy * dy);
    if (distance !== 0) { dx /= distance; dy /= distance; }
    dx *= distance / 150;
    dy *= distance / 150;

    ++this.zIndexVal;
    this.imgPosition =
      this.imgPosition < this.imagesTotal - 1 ? this.imgPosition + 1 : 0;
    const img = this.images[this.imgPosition];
    gsap.killTweensOf(img.DOM.el);

    gsap
      .timeline({
        onStart: () => this.onImageActivated(),
        onComplete: () => this.onImageDeactivated(),
      })
      .fromTo(
        img.DOM.el,
        {
          opacity: 1,
          filter: "brightness(80%)",
          scale: 0.1,
          zIndex: this.zIndexVal,
          x: this.cacheMousePos.x - img.rect.width / 2,
          y: this.cacheMousePos.y - img.rect.height / 2,
          rotation: startAngle,
        },
        {
          duration: 1,
          ease: "power2",
          scale: 1,
          filter: "brightness(100%)",
          x: this.mousePos.x - img.rect.width / 2 + dx * 70,
          y: this.mousePos.y - img.rect.height / 2 + dy * 70,
          rotation: this.lastAngle,
        },
        0
      )
      .to(img.DOM.el, { duration: 0.4, ease: "expo", opacity: 0 }, 0.5)
      .to(img.DOM.el, { duration: 1.5, ease: "power4", x: `+=${dx * 120}`, y: `+=${dy * 120}` }, 0.05);
  }
}

class ImageTrailVariant6 extends BaseTrail {
  render() {
    if (this._isDestroyed) return;
    if (this.imagesTotal === 0) return;

    const distance = getMouseDistance(this.mousePos, this.lastMousePos);
    this.cacheMousePos.x = lerp(this.cacheMousePos.x, this.mousePos.x, 0.3);
    this.cacheMousePos.y = lerp(this.cacheMousePos.y, this.mousePos.y, 0.3);

    if (distance > this.threshold) {
      this.showNextImage();
      this.lastMousePos = { ...this.mousePos };
    }
    if (this.isIdle && this.zIndexVal !== 1) this.zIndexVal = 1;
    this._rafId = requestAnimationFrame(() => this.render());
  }

  mapSpeedToSize(speed, minSize, maxSize) {
    const maxSpeed = 200;
    return minSize + (maxSize - minSize) * Math.min(speed / maxSpeed, 1);
  }

  mapSpeedToBrightness(speed, minB, maxB) {
    const maxSpeed = 70;
    return minB + (maxB - minB) * Math.min(speed / maxSpeed, 1);
  }

  mapSpeedToBlur(speed, minBlur, maxBlur) {
    const maxSpeed = 90;
    return minBlur + (maxBlur - minBlur) * Math.min(speed / maxSpeed, 1);
  }

  mapSpeedToGrayscale(speed, minG, maxG) {
    const maxSpeed = 90;
    return minG + (maxG - minG) * Math.min(speed / maxSpeed, 1);
  }

  showNextImage() {
    const dx = this.mousePos.x - this.cacheMousePos.x;
    const dy = this.mousePos.y - this.cacheMousePos.y;
    const speed = Math.sqrt(dx * dx + dy * dy);

    ++this.zIndexVal;
    this.imgPosition =
      this.imgPosition < this.imagesTotal - 1 ? this.imgPosition + 1 : 0;
    const img = this.images[this.imgPosition];

    const scaleFactor = this.mapSpeedToSize(speed, 0.3, 2);
    const brightnessValue = this.mapSpeedToBrightness(speed, 0, 1.3);
    const blurValue = this.mapSpeedToBlur(speed, 20, 0);
    const grayscaleValue = this.mapSpeedToGrayscale(speed, 600, 0);

    gsap.killTweensOf(img.DOM.el);
    gsap
      .timeline({
        onStart: () => this.onImageActivated(),
        onComplete: () => this.onImageDeactivated(),
      })
      .fromTo(
        img.DOM.el,
        {
          opacity: 1,
          scale: 0,
          zIndex: this.zIndexVal,
          x: this.cacheMousePos.x - img.rect.width / 2,
          y: this.cacheMousePos.y - img.rect.height / 2,
        },
        {
          duration: 0.8,
          ease: "power3",
          scale: scaleFactor,
          filter: `grayscale(${grayscaleValue * 100}%) brightness(${brightnessValue * 100}%) blur(${blurValue}px)`,
          x: this.mousePos.x - img.rect.width / 2,
          y: this.mousePos.y - img.rect.height / 2,
        },
        0
      )
      .fromTo(
        img.DOM.inner,
        { scale: 2 },
        { duration: 0.8, ease: "power3", scale: 1 },
        0
      )
      .to(img.DOM.el, { duration: 0.4, ease: "power3.in", opacity: 0, scale: 0.2 }, 0.45);
  }
}

function getNewPosition(position, offset, arr) {
  const realOffset = Math.abs(offset) % arr.length;
  if (position - realOffset >= 0) return position - realOffset;
  return arr.length - (realOffset - position);
}

class ImageTrailVariant7 extends BaseTrail {
  constructor(container, options) {
    super(container, options);
    this.visibleImagesCount = 0;
    this.visibleImagesTotal = Math.min(9, Math.max(this.imagesTotal - 1, 0));
  }

  render() {
    if (this._isDestroyed) return;
    if (this.imagesTotal === 0) return;

    const distance = getMouseDistance(this.mousePos, this.lastMousePos);
    this.cacheMousePos.x = lerp(this.cacheMousePos.x, this.mousePos.x, 0.3);
    this.cacheMousePos.y = lerp(this.cacheMousePos.y, this.mousePos.y, 0.3);

    if (distance > this.threshold) {
      this.showNextImage();
      this.lastMousePos = { ...this.mousePos };
    }
    if (this.isIdle && this.zIndexVal !== 1) this.zIndexVal = 1;
    this._rafId = requestAnimationFrame(() => this.render());
  }

  showNextImage() {
    ++this.zIndexVal;
    this.imgPosition =
      this.imgPosition < this.imagesTotal - 1 ? this.imgPosition + 1 : 0;
    const img = this.images[this.imgPosition];
    ++this.visibleImagesCount;

    gsap.killTweensOf(img.DOM.el);
    const scaleValue = gsap.utils.random(0.5, 1.6);

    gsap
      .timeline({
        onStart: () => this.onImageActivated(),
        onComplete: () => this.onImageDeactivated(),
      })
      .fromTo(
        img.DOM.el,
        {
          scale: scaleValue - Math.max(gsap.utils.random(0.2, 0.6), 0),
          rotationZ: 0,
          opacity: 1,
          zIndex: this.zIndexVal,
          x: this.cacheMousePos.x - img.rect.width / 2,
          y: this.cacheMousePos.y - img.rect.height / 2,
        },
        {
          duration: 0.4,
          ease: "power3",
          scale: scaleValue,
          rotationZ: gsap.utils.random(-3, 3),
          x: this.mousePos.x - img.rect.width / 2,
          y: this.mousePos.y - img.rect.height / 2,
        },
        0
      );

    if (this.visibleImagesTotal > 0 && this.visibleImagesCount >= this.visibleImagesTotal) {
      const lastInQueue = getNewPosition(this.imgPosition, this.visibleImagesTotal, this.images);
      const oldImg = this.images[lastInQueue];
      gsap.to(oldImg.DOM.el, {
        duration: 0.4,
        ease: "power4",
        opacity: 0,
        scale: 1.3,
        onComplete: () => {
          if (this.activeImagesCount === 0) this.isIdle = true;
        },
      });
    }
  }
}

class ImageTrailVariant8 extends BaseTrail {
  constructor(container, options) {
    super(container, options);
    this.rotation = { x: 0, y: 0 };
    this.cachedRotation = { x: 0, y: 0 };
    this.zValue = 0;
    this.cachedZValue = 0;
  }

  showNextImage() {
    const rect = this.container.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const relX = this.mousePos.x - centerX;
    const relY = this.mousePos.y - centerY;

    this.rotation.x = -(relY / centerY) * 30;
    this.rotation.y = (relX / centerX) * 30;
    this.cachedRotation = { ...this.rotation };

    const distanceFromCenter = Math.sqrt(relX * relX + relY * relY);
    const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
    const proportion = maxDistance === 0 ? 0 : distanceFromCenter / maxDistance;
    this.zValue = proportion * 1200 - 600;
    this.cachedZValue = this.zValue;
    const normalizedZ = (this.zValue + 600) / 1200;
    const brightness = 0.2 + normalizedZ * 2.3;

    ++this.zIndexVal;
    this.imgPosition =
      this.imgPosition < this.imagesTotal - 1 ? this.imgPosition + 1 : 0;
    const img = this.images[this.imgPosition];
    gsap.killTweensOf(img.DOM.el);

    gsap
      .timeline({
        onStart: () => this.onImageActivated(),
        onComplete: () => this.onImageDeactivated(),
      })
      .set(this.DOM.el, { perspective: 1000 }, 0)
      .fromTo(
        img.DOM.el,
        {
          opacity: 1,
          z: 0,
          scale: 1 + this.cachedZValue / 1000,
          zIndex: this.zIndexVal,
          x: this.cacheMousePos.x - img.rect.width / 2,
          y: this.cacheMousePos.y - img.rect.height / 2,
          rotationX: this.cachedRotation.x,
          rotationY: this.cachedRotation.y,
          filter: `brightness(${brightness})`,
        },
        {
          duration: 1,
          ease: "expo",
          scale: 1 + this.zValue / 1000,
          x: this.mousePos.x - img.rect.width / 2,
          y: this.mousePos.y - img.rect.height / 2,
          rotationX: this.rotation.x,
          rotationY: this.rotation.y,
        },
        0
      )
      .to(img.DOM.el, { duration: 0.4, ease: "power2", opacity: 0, z: -800 }, 0.3);
  }
}

const variantMap = {
  1: ImageTrailVariant1,
  2: ImageTrailVariant2,
  3: ImageTrailVariant3,
  4: ImageTrailVariant4,
  5: ImageTrailVariant5,
  6: ImageTrailVariant6,
  7: ImageTrailVariant7,
  8: ImageTrailVariant8,
};

export default function ImageTrail({ items = [], variant = 1, listenTarget = "window" }) {
  const containerRef = useRef(null);
  const instanceRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Skip on touch devices for performance
    const isTouch = window.matchMedia("(hover: none)").matches;
    if (isTouch) return;

    if (instanceRef.current?.destroy) {
      instanceRef.current.destroy();
      instanceRef.current = null;
    }

    if (!items || items.length === 0) return;

    const Cls = variantMap[variant] || variantMap[1];
    instanceRef.current = new Cls(containerRef.current, {
      listenTarget,
      ignoreSelector: "#mainNav",
    });

    return () => {
      if (instanceRef.current?.destroy) {
        instanceRef.current.destroy();
        instanceRef.current = null;
      }
    };
  }, [variant, items, listenTarget]);

  // When scoped to container, pointer-events must be enabled so mousemove fires
  const pointerClass = listenTarget === "container" ? "pointer-events-auto" : "pointer-events-none";

  return (
    <div
      className={`absolute inset-0 z-[100] rounded-lg bg-transparent overflow-visible ${pointerClass}`}
      ref={containerRef}
    >
      {items.map((url, i) => (
        <div
          className="content__img w-[280px] aspect-[1.1] rounded-[15px] absolute top-0 left-0 opacity-0 overflow-hidden [will-change:transform,filter]"
          key={i}
        >
          <div
            className="content__img-inner bg-center bg-cover w-[calc(100%+20px)] h-[calc(100%+20px)] absolute top-[-10px] left-[-10px]"
            style={{ backgroundImage: `url(${url})` }}
          />
        </div>
      ))}
    </div>
  );
}
